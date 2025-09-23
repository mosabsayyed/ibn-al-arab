import { Payment } from '../../../shared/types.js';
export type { Payment };

export function validatePayment(p: Partial<Payment>) {
  if (!p.id) throw new Error('id required');
  if (!p.subscription_id) throw new Error('subscription_id required');
  if (!p.method) throw new Error('method required');
  if (!p.amount_aed) throw new Error('amount_aed required');
  if (!p.status || !['pending', 'confirmed', 'rejected'].includes(p.status)) throw new Error('Invalid status');
  return true;
}
