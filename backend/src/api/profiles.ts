import express from 'express'
import { supabase } from '../lib/supabase.js'
import { resolveUser, requireAuth } from '../middleware/auth.js'

const router = express.Router()

// Upsert profile for currently authenticated user or when caller provides user_id in payload
// Note: we intentionally do NOT use requireAuth here so the client can include user_id right after signup
router.post('/', resolveUser, async (req, res) => {
  try {
  // Allow payload to include user_id (useful immediately after signUp when client doesn't yet have a session JWT)
  const payload = req.body || {}
  const userId = (req as any).userId || payload.user_id
    if (!userId) {
      // If REQUIRE_AUTH is enabled, enforce authentication
      if (process.env.REQUIRE_AUTH === 'true') {
        return res.status(401).json({ error: 'authentication required' })
      }
    }

    // Ensure phone is provided and non-empty (required by DB)
    const phoneVal = (payload.phone ?? payload.phone_e164 ?? '').toString().trim()
    if (!phoneVal) {
      return res.status(400).json({ error: 'phone is required' })
    }

    // Ensure user_id matches authenticated user
    const profilePayload = {
      user_id: userId,
      email: payload.email ?? null,
      first_name: payload.firstName ?? payload.first_name ?? '',
      last_name: payload.lastName ?? payload.last_name ?? '',
      phone_e164: phoneVal,
      is_student: payload.isStudent ?? payload.is_student ?? false,
      university_email: payload.universityEmail ?? payload.university_email ?? null,
      student_id_expiry: payload.studentIdExpiry ?? payload.student_id_expiry ?? null,
      language_pref: payload.language_pref ?? 'en'
    }

    // Upsert using service role supabase client
    if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const { data, error } = await supabase.from('profiles').upsert([profilePayload], { onConflict: 'user_id' }).select('*').single()
      if (error) {
        console.error('Profile upsert failed:', error)
        // Map unique-constraint / duplicate key errors to 409
        const errMsg = (error as any).message || ''
        const errCode = (error as any).code || ''
        if (errCode === '23505' || /duplicate|unique|already exists/i.test(errMsg)) {
          return res.status(409).json({ error: 'conflict: profile with this phone or identifier already exists' })
        }
        return res.status(500).json({ error: error.message })
      }
      return res.status(200).json(data)
    }

    return res.status(500).json({ error: 'Supabase not configured on server' })
  } catch (err: any) {
    console.error('Unexpected error in /api/profiles:', err)
    return res.status(500).json({ error: err?.message ?? 'unexpected error' })
  }
})

// GET current authenticated user's profile
router.get('/', resolveUser, requireAuth, async (req, res) => {
  try {
    const userId = (req as any).userId
    if (!userId) return res.status(401).json({ error: 'authentication required' })

    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return res.status(500).json({ error: 'Supabase not configured on server' })
    }

    const { data, error } = await supabase.from('profiles').select('*').eq('user_id', userId).single()
    if (error) {
      if ((error as any).code === 'PGRST116' || (error as any).message?.includes('No rows')) {
        return res.status(404).json({ error: 'profile not found' })
      }
      console.error('Profile fetch failed:', error)
      return res.status(500).json({ error: error.message })
    }

    return res.status(200).json(data)
  } catch (err: any) {
    console.error('Unexpected error in GET /api/profiles:', err)
    return res.status(500).json({ error: err?.message ?? 'unexpected error' })
  }
})

// GET profile by id (admin-like read)
router.get('/:id', resolveUser, requireAuth, async (req, res) => {
  try {
    const paramId = req.params.id
    if (!paramId) return res.status(400).json({ error: 'missing id parameter' })

    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return res.status(500).json({ error: 'Supabase not configured on server' })
    }

    const { data, error } = await supabase.from('profiles').select('*').eq('user_id', paramId).single()
    if (error) {
      if ((error as any).code === 'PGRST116' || (error as any).message?.includes('No rows')) {
        return res.status(404).json({ error: 'profile not found' })
      }
      console.error('Profile fetch failed:', error)
      return res.status(500).json({ error: error.message })
    }

    return res.status(200).json(data)
  } catch (err: any) {
    console.error('Unexpected error in GET /api/profiles/:id:', err)
    return res.status(500).json({ error: err?.message ?? 'unexpected error' })
  }
})

export default router
