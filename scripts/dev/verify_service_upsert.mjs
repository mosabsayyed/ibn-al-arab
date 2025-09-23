import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const url = process.env.SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!url || !serviceKey) {
  console.error('MISSING_CONFIG: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not found in environment')
  process.exit(2)
}

const supabase = createClient(url, serviceKey)

const userId = crypto.randomUUID()
const payload = {
  user_id: userId,
  email: `${userId}@example.com`,
  first_name: 'Dev',
  last_name: 'Upsert',
  phone_e164: '+10000000000',
  is_student: false,
  language_pref: 'en'
}

// Create a corresponding auth user via admin API so FK constraint is satisfied
const tempEmail = `dev+${Date.now()}@example.com`
const tempPassword = `DevTest!${Math.floor(Math.random() * 100000)}`

const createUserRes = await supabase.auth.admin.createUser({
  email: tempEmail,
  password: tempPassword,
  email_confirm: true,
})

if (createUserRes.error) {
  console.error('CREATE_USER_FAILED', createUserRes.error.message || createUserRes.error)
  process.exit(3)
}

const createdUser = createUserRes.data.user
if (!createdUser || !createdUser.id) {
  console.error('CREATE_USER_NO_ID')
  process.exit(4)
}

const userIdReal = createdUser.id
payload.user_id = userIdReal
payload.email = tempEmail

const res = await supabase.from('profiles').upsert([payload], { onConflict: 'user_id' }).select('*').single()
if (res.error) {
  console.error('UPSERT_FAILED', res.error.message || res.error)
  // Attempt cleanup
  try { await supabase.auth.admin.deleteUser(userIdReal) } catch (e) {}
  process.exit(5)
}

console.log('UPSERT_OK', { user_id: res.data.user_id })

// Cleanup: delete the created auth user
try {
  await supabase.auth.admin.deleteUser(userIdReal)
} catch (e) {
  // non-fatal
}

process.exit(0)
