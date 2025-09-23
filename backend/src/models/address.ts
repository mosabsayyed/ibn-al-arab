import { Address } from '../../../shared/types.js';
export type { Address };

export function validateAddress(a: Partial<Address>) {
  if (!a.id) throw new Error('id required');
  if (!a.user_id) throw new Error('user_id required');
  if (!a.district) throw new Error('district required');
  return true;
}