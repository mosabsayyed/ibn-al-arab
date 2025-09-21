export type Payment = {
  id: string
  subscription_id?: string
  amount_aed?: number
  provider: string
  status: 'pending' | 'confirmed' | 'rejected'
  receipt_url?: string
}

export function validatePayment(p: Partial<Payment>){
  if (!p.id) throw new Error('id required')
}
