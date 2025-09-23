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

export interface Address {
  id: string; // uuid
  user_id: string; // uuid
  district: string;
  formatted_address?: string;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string; // uuid
  user_id: string; // uuid
  plan_id: string; // uuid
  status: 'pending' | 'active' | 'cancelled' | 'failed';
  start_date: string;
  end_date: string;
  delivery_address_id: string; // uuid
  price_charged_aed: number;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string; // uuid
  subscription_id: string; // uuid
  method: string;
  amount_aed: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'rejected';
  provider?: string;
  provider_txn_id?: string;
  receipt_url?: string;
  created_at: string;
  updated_at: string;
}
