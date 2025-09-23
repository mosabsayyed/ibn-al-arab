import { supabase } from '../lib/supabase.js';
import { Plan } from '../models/plan.js';

export async function listActivePlans(): Promise<Plan[]> {
  const { data, error } = await supabase
    .from('plans')
    .select('*')
    .eq('status', 'active');

  if (error) {
    console.error('Error fetching active plans:', error);
    throw new Error('Could not fetch active plans');
  }

  return data as Plan[];
}
