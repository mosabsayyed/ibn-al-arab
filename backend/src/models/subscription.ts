import { Subscription } from '../../../shared/types.js';
export type { Subscription };

export function validateSubscription(s: Partial<Subscription>) {
  if (!s.id) throw new Error('id required');
  if (!s.user_id) throw new Error('user_id required');
  if (!s.plan_id) throw new Error('plan_id required');
  if (!s.status || !['pending', 'active', 'cancelled', 'failed'].includes(s.status)) throw new Error('Invalid status');
  return true;
}
