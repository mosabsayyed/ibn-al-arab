import { Plan } from '../../../shared/types.js';
export type { Plan };

export function validatePlan(p: Partial<Plan>) {
  if (!p.id) throw new Error('id required');
  if (!p.code) throw new Error('code required');
  if (!p.name_en) throw new Error('name_en required');
  if (!p.name_ar) throw new Error('name_ar required');
  if (!p.meals_per_day) throw new Error('meals_per_day required');
  if (!p.delivery_days) throw new Error('delivery_days required');
  if (!p.base_price_aed) throw new Error('base_price_aed required');
}
