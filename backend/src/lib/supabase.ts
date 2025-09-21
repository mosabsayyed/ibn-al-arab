import { createClient } from '@supabase/supabase-js'

// These variables should be loaded from environment variables (.env file)
// for a secure backend implementation.
const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Supabase credentials for backend are missing!')
  console.error('Please create or check your .env file in the project root with SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.')
}

// The service role key has super admin privileges and should be kept secret.
// It is required for backend operations that need to bypass RLS.
export const supabase = createClient(supabaseUrl!, supabaseServiceKey!)
