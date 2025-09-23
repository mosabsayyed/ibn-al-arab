(async () => {
  try {
    // Load dotenv if present
    require('dotenv').config()
    const { createClient } = require('@supabase/supabase-js')

    const url = process.env.SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !serviceKey) {
      console.error('MISSING_CONFIG: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not found in environment')
      process.exit(2)
    }

    const supabase = createClient(url, serviceKey)

    const userId = `dev-user-${Date.now()}`
    const payload = {
      user_id: userId,
      email: `${userId}@example.com`,
      first_name: 'Dev',
      last_name: 'Upsert',
      phone_e164: '+10000000000',
      is_student: false,
      language_pref: 'en'
    }

    const { data, error } = await supabase.from('profiles').upsert([payload], { onConflict: 'user_id' }).select('*').single()
    if (error) {
      console.error('UPSERT_FAILED', error.message || error)
      process.exit(3)
    }

    console.log('UPSERT_OK', { user_id: data.user_id })
    process.exit(0)
  } catch (err) {
    console.error('UNEXPECTED', err && err.message ? err.message : err)
    process.exit(4)
  }
})()
