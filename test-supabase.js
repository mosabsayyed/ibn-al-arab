// Quick test to verify Supabase connection
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qdijzenzmmqnrvpyvsmv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkaWp6ZW56bW1xbnJ2cHl2c212Iiwicm9zZSI6ImFub24iLCJpYXQiOjE3NTc5MzE3NjMsImV4cCI6MjA3MzUwNzc2M30.fP6f_dv-CIMTyizeVOe0BtgCvhiZGuZJudotwwkx7J8'

const supabase = createClient(supabaseUrl, supabaseKey)

console.log('Testing Supabase connection...')

// Test basic connection
try {
  const { data, error } = await supabase.auth.getSession()
  console.log('✅ Supabase connection working')
  console.log('Session:', data.session ? 'Active' : 'None')
} catch (err) {
  console.error('❌ Supabase connection failed:', err)
}