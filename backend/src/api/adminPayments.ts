import express from 'express'
import { getPaymentsStore } from './payments.js'
import { createEmailService } from '../services/email.js'
import { supabase } from '../lib/supabase.js'

const router = express.Router()
const emailService = createEmailService()

// List payments (optionally filter by status)
router.get('/', async (req, res) => {
  const status = req.query.status as string | undefined
  if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const q = supabase.from('payments').select('*')
      if (status) q.eq('status', status)
      const { data, error } = await q
      if (!error && data) return res.json({ count: data.length, payments: data })
      console.error('Supabase query error, falling back to memory store', error)
    } catch (err) {
      console.error('Supabase list error, falling back to memory store', err)
    }
  }

  const payments = getPaymentsStore()
  const filtered = status ? payments.filter((p: any) => p.status === status) : payments
  res.json({ count: filtered.length, payments: filtered })
})

// Approve a payment
router.post('/:id/approve', async (req, res) => {
  const id = req.params.id
  if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const { data, error } = await supabase.from('payments').update({ status: 'approved' }).eq('id', id).select().single()
      if (!error && data) {
        // also attempt to set subscription status to active if subscription_id present
        try {
          if (data.subscription_id) {
            await supabase.from('subscriptions').update({ status: 'active' }).eq('id', data.subscription_id)
          }
        } catch (e) {
          console.error('Failed to update subscription status in DB', e)
        }
        
        // Send approval email
        await sendPaymentStatusEmail(data.user_id, data.id, data.plan_id, 'approved')
        
        return res.json({ payment: data })
      }
      console.error('Supabase approve error, falling back to memory store', error)
    } catch (err) {
      console.error('Supabase approve exception, falling back to memory store', err)
    }
  }

  const payments = getPaymentsStore()
  const p = payments.find((x: any) => x.id === id)
  if (!p) return res.status(404).json({ error: 'not found' })
  p.status = 'approved'
  // Update linked subscription in memory store if present
  if (p.subscriptionId) {
    try {
      // subscriptions store is in subscriptions module; import lazily to avoid cycles
      const { getSubscriptionsStore } = await import('./subscriptions.js')
      const subs = getSubscriptionsStore()
      const s = subs.find((x: any) => x.id === p.subscriptionId)
      if (s) s.status = 'active'
    } catch (e) {
      console.error('Failed to update in-memory subscription status', e)
    }
  }
  res.json({ payment: p })
})

// Reject a payment with optional reason
router.post('/:id/reject', async (req, res) => {
  const id = req.params.id
  if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const { data, error } = await supabase.from('payments').update({ status: 'rejected' }).eq('id', id).select().single()
      if (!error && data) {
        // Send rejection email
        await sendPaymentStatusEmail(data.user_id, data.id, data.plan_id, 'rejected')
        return res.json({ payment: data })
      }
      console.error('Supabase reject error, falling back to memory store', error)
    } catch (err) {
      console.error('Supabase reject exception, falling back to memory store', err)
    }
  }

  const payments = getPaymentsStore()
  const p = payments.find((x: any) => x.id === id)
  if (!p) return res.status(404).json({ error: 'not found' })
  p.status = 'rejected'
  res.json({ payment: p })
})

// Helper function to send payment status emails
async function sendPaymentStatusEmail(userId: string, paymentId: string, planId: string, status: 'approved' | 'rejected') {
  if (!emailService) {
    console.log('Email service not configured, skipping payment status email');
    return;
  }

  try {
    // Get user email from Supabase Auth
    if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const { data: user, error: userError } = await supabase.auth.admin.getUserById(userId);
      if (userError || !user?.user?.email) {
        console.error('Failed to get user email for payment status email:', userError);
        return;
      }

      // Get plan details with proper pricing
      const { data: plans } = await supabase.from('plans').select('*').eq('id', planId).single();
      if (!plans) {
        console.error('Plan not found for payment status email');
        return;
      }

      // Use the actual plan name and discounted price (student pricing)
      const planName = `${plans.name_en} (${plans.position_note_en})`;
      const amount = plans.discounted_price_aed || plans.base_price_aed || 0;

      const orderDetails = {
        orderId: paymentId,
        planName,
        amount,
        currency: 'AED'
      };

      if (status === 'approved') {
        await emailService.sendPaymentApproval(user.user.email, orderDetails);
      } else {
        await emailService.sendPaymentRejection(user.user.email, orderDetails);
      }
    }
  } catch (error) {
    console.error('Failed to send payment status email:', error);
  }
}

export default router
