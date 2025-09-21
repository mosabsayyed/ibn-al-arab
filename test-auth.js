// Quick test to verify Supabase connection and API key
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qdijzenzmmqnrvpyvsmv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkaWp6ZW56bW1xbnJ2cHl2c212Iiwicm9zZSI6ImFub24iLCJpYXQiOjE3NTc5MzE3NjMsImV4cCI6MjA3MzUwNzc2M30.fP6f_dv-CIMTyizeVOe0BtgCvhiZGuZJudotwwkx7J8'

const supabase = createClient(supabaseUrl, supabaseKey)

console.log('Testing Supabase connection...')
console.log('Supabase client created:', !!supabase)

// Test a simple auth operation
try {
  const { data, error } = await supabase.auth.getSession()
  console.log('✅ Auth test successful')
  console.log('Current session:', data.session ? 'Active' : 'None')
  
  // Test if signup endpoint is accessible (this will fail but should give us better error info)
  try {
    const { data: signupData, error: signupError } = await supabase.auth.signUp({
      email: 'test@test.com',
      password: 'test123456'
    })
    console.log('Signup test result:', signupData, signupError)
  } catch (signupErr) {
    console.log('Signup test error:', signupErr)
  }
  
} catch (err) {
  console.error('❌ Auth test failed:', err)
}