import 'dotenv/config'

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
const anonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
const backendUrl = process.env.BACKEND_URL || 'http://localhost:4101'

if (!supabaseUrl || !anonKey) {
  console.error('MISSING_CONFIG')
  process.exit(2)
}

const signupEmail = `dbg+${Date.now()}@example.com`
const signupPassword = `DbgPass!${Math.floor(Math.random()*100000)}`
console.log('Signing up:', signupEmail)

const signupRes = await fetch(`${supabaseUrl.replace(/\/+$/, '')}/auth/v1/signup`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', apikey: anonKey, Authorization: `Bearer ${anonKey}` },
  body: JSON.stringify({ email: signupEmail, password: signupPassword, options: { email_confirm: false } }),
})
const signupBody = await signupRes.json().catch(() => null)
console.log('Signup status:', signupRes.status)
console.log('Has access_token:', !!(signupBody && signupBody.access_token))

if (!signupRes.ok) {
  console.error('SIGNUP_FAILED', signupRes.status, signupBody)
  process.exit(3)
}
const accessToken = signupBody.access_token

console.log('Posting profile to backend...')
const profilePayload = { email: signupEmail, firstName: 'Dbg', lastName: 'Test' }
if (process.env.PROFILE_PHONE) profilePayload.phone = process.env.PROFILE_PHONE
const createRes = await fetch(`${backendUrl.replace(/\/+$/, '')}/api/profiles`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
  body: JSON.stringify(profilePayload),
})
const createBody = await createRes.text().catch(() => '(no body)')
console.log('Backend POST status:', createRes.status)
console.log('Backend POST body:', createBody)
process.exit(createRes.ok ? 0 : 5)
