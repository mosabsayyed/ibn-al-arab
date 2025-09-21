export interface Plan {
  id: string; // uuid
  code: string;
  name_en: string;
  name_ar: string;
  meals_per_day: number;
  delivery_days: number;
  duration_label: string;
  base_price_aed: number;
  discounted_price_aed?: number;
  position_note_en?: string;
  position_note_ar?: string;
  status: 'active' | 'archived';
  created_at: string;
  updated_at: string;
}
