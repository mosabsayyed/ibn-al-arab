import express from 'express'
import multer from 'multer'
import { LocalStorageService } from '../services/storage.js'
import { createEmailService } from '../services/email.js'
import { supabase } from '../lib/supabase.js'
import { resolveUser, requireAuth } from '../middleware/auth.js'
import { v4 as uuidv4 } from 'uuid'

const upload = multer()
const router = express.Router()
const emailService = createEmailService()

const storage = new LocalStorageService(process.env.UPLOADS_DIR || 'uploads')

// In-memory payments store for prototype
type Payment = {
  id: string
  planId: string
  subscriptionId?: string | null
  provider: string
  status: 'pending' | 'approved' | 'rejected'
  receipt_url: string
  metadata?: Record<string, any>
}

const payments: Payment[] = []

router.post('/', resolveUser, requireAuth, upload.single('proof'), async (req, res) => {
  const planId = String(req.body.planId || req.body.plan_id || '')
  const subscriptionId = String(req.body.subscriptionId || req.body.subscription_id || '') || null

  // Support either direct multipart upload (file) or providing a receipt_url from /api/uploads
  const file = req.file
  let stored: string | null = null

  if (file) {
    const filename = `${Date.now()}_${file.originalname}`
    stored = await storage.store(file.buffer, filename, { contentType: file.mimetype })
    console.debug('[payments] stored receipt:', stored)
  } else if (req.body && req.body.receipt_url) {
    stored = String(req.body.receipt_url)
  } else {
    return res.status(400).json({ error: 'proof file required (multipart) or receipt_url in body' })
  }

  const payment: Payment = {
    id: uuidv4(),
    planId,
    subscriptionId: subscriptionId || null,
    provider: 'wire_transfer',
    status: 'pending',
    receipt_url: stored as string, // relative path or url
    metadata: file ? { originalName: file.originalname } : (req.body.metadata ? req.body.metadata : undefined),
  }

  // Try to persist to DB when Supabase is configured; otherwise keep in-memory
  // Prefer userId set by middleware (if present)
  const userId = (req as any).userId ?? null
  
  try {
    if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const toInsert = {
        id: payment.id,
        plan_id: payment.planId,
        subscription_id: subscriptionId || null,
        provider: payment.provider,
  user_id: userId,
        status: payment.status,
        receipt_url: payment.receipt_url,
        metadata: payment.metadata ? JSON.stringify(payment.metadata) : null,
      }
      const { data, error } = await supabase.from('payments').insert([toInsert]).select().single()
      if (error) {
        console.error('Failed to insert payment to DB, falling back to memory store', error)
      } else {
        // Send order confirmation email
        await sendOrderConfirmationEmail(userId, payment.id, payment.planId)
        // Return DB row if available
        return res.status(201).json(data)
      }
    }
  } catch (err) {
    console.error('Error while persisting payment to DB:', err)
  }

  payments.push(payment)

  // Send order confirmation email for memory store fallback
  if (userId) {
    await sendOrderConfirmationEmail(userId, payment.id, payment.planId)
  }

  res.status(201).json(payment)
})

router.get('/', (req, res) => {
  res.json({ count: payments.length, payments })
})

// Helper function to send order confirmation email
async function sendOrderConfirmationEmail(userId: string, paymentId: string, planId: string) {
  if (!emailService) {
    console.log('Email service not configured, skipping order confirmation email');
    return;
  }

  try {
    // Get user email from Supabase Auth
    if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const { data: user, error: userError } = await supabase.auth.admin.getUserById(userId);
      if (userError || !user?.user?.email) {
        console.error('Failed to get user email for order confirmation:', userError);
        return;
      }

      // Get plan details with proper pricing
      const { data: plans } = await supabase.from('plans').select('*').eq('id', planId).single();
      if (!plans) {
        console.error('Plan not found for order confirmation email');
        return;
      }

      // Use the actual plan name and discounted price (student pricing)
      const planName = `${plans.name_en} (${plans.position_note_en})`;
      const amount = plans.discounted_price_aed || plans.base_price_aed || 0;

      await emailService.sendOrderConfirmation(user.user.email, {
        orderId: paymentId,
        planName,
        amount,
        currency: 'AED'
      });
    }
  } catch (error) {
    console.error('Failed to send order confirmation email:', error);
  }
}

// Export internal store for admin endpoints/tests to mutate or query
export function getPaymentsStore() {
  return payments
}

export default router
