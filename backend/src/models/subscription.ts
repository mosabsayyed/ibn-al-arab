export type Subscription = {
  id: string
  profile_id: string
  plan_id: string
  status: 'pending' | 'active' | 'cancelled' | 'failed'
  price_charged_aed?: number
}

export function validateSubscription(s: Partial<Subscription>){
  if (!s.id) throw new Error('id required')
  if (!s.profile_id) throw new Error('profile_id required')
}
