import { supabase } from '../lib/supabase.js'
import type { Request, Response, NextFunction } from 'express'

export async function resolveUser(req: Request, _res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization || (req.headers as any).Authorization
    if (authHeader && typeof authHeader === 'string') {
      const token = authHeader.replace(/^Bearer\s+/i, '')
      const userRes = await supabase.auth.getUser(token)
      if (!userRes.error && userRes.data?.user) {
        ;(req as any).userId = userRes.data.user.id
      }
    }
  } catch (err) {
    // ignore and continue as anonymous
    console.error('auth.resolveUser error', err)
  }
  next()
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (process.env.REQUIRE_AUTH === 'true') {
    const userId = (req as any).userId
    if (!userId) return res.status(401).json({ error: 'authentication required' })
  }
  next()
}
