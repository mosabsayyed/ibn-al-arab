import express from 'express'
import { supabase } from '../lib/supabase.js'
import { resolveUser, requireAuth } from '../middleware/auth.js'
import { v4 as uuidv4 } from 'uuid'

const router = express.Router()

type Subscription = {
  id: string
  profile_id?: string | null
  user_id?: string | null
  plan_id: string
  status: 'pending' | 'active' | 'cancelled' | 'failed'
  price_charged_aed?: number | null
  metadata?: Record<string, any>
}

// In-memory store as fallback when no Supabase service role is available
const subscriptions: Subscription[] = []

// Create a subscription (or checkout)
// Accepts payload: { plan_id, profile_id?, user_id?, price_charged_aed?, metadata? }
router.post('/', resolveUser, async (req, res) => {
  try {
    const payload = req.body || {}
    const planId = String(payload.plan_id || payload.planId || '')
    if (!planId) return res.status(400).json({ error: 'plan_id is required' })

    const userId = (req as any).userId ?? payload.user_id ?? payload.userId ?? null
    const profileId = payload.profile_id ?? payload.profileId ?? null

    // If server requires auth, enforce it
    if (process.env.REQUIRE_AUTH === 'true' && !userId && !profileId) {
      return res.status(401).json({ error: 'authentication required' })
    }

    const subscription: Subscription = {
      id: uuidv4(),
      plan_id: planId,
      profile_id: profileId ?? null,
      user_id: userId ?? null,
      status: 'pending',
      price_charged_aed: payload.price_charged_aed ?? null,
      metadata: payload.metadata ?? null,
    }

    // Try to persist to DB using service role when configured
    if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const toInsert: any = {
          id: subscription.id,
          plan_id: subscription.plan_id,
          profile_id: subscription.profile_id,
          user_id: subscription.user_id,
          status: subscription.status,
          price_charged_aed: subscription.price_charged_aed ?? null,
          metadata: subscription.metadata ? JSON.stringify(subscription.metadata) : null,
        }

        const { data, error } = await supabase.from('subscriptions').insert([toInsert]).select().single()
        if (error) {
          console.error('Failed to insert subscription to DB, will attempt retry without metadata then fallback to memory store', error)

          // If PostgREST/cache indicates the 'metadata' column isn't present, retry without it
          try {
            const missingMetadata = (error && (error.code === 'PGRST204' || String(error.message || '').toLowerCase().includes('metadata')))
            if (missingMetadata) {
              const toInsert2 = { ...toInsert }
              delete toInsert2.metadata
              const { data: data2, error: error2 } = await supabase.from('subscriptions').insert([toInsert2]).select().single()
              if (!error2) {
                return res.status(201).json(data2)
              }
              console.error('Retry without metadata also failed', error2)
            }
          } catch (err2) {
            console.error('Error during retry without metadata:', err2)
          }

        } else {
          return res.status(201).json(data)
        }
      } catch (err) {
        console.error('Error while persisting subscription to DB:', err)
      }
    }

    // Fallback: in-memory store
    subscriptions.push(subscription)
    return res.status(201).json(subscription)
  } catch (err: any) {
    console.error('Unexpected error in /api/subscriptions:', err)
    return res.status(500).json({ error: err?.message ?? 'unexpected error' })
  }
})

router.get('/', (_req, res) => {
  res.json({ count: subscriptions.length, subscriptions })
})

// Get subscription by id
router.get('/:id', async (req, res) => {
  const id = req.params.id
  if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const { data, error } = await supabase.from('subscriptions').select().eq('id', id).single()
      if (!error && data) return res.json(data)
      console.error('Supabase fetch subscription error, falling back to memory store', error)
    } catch (err) {
      console.error('Supabase fetch subscription exception', err)
    }
  }

  const s = subscriptions.find((x: any) => x.id === id)
  if (!s) return res.status(404).json({ error: 'not found' })
  return res.json(s)
})

export function getSubscriptionsStore() {
  return subscriptions
}

export default router
