(async () => {
  try {
    // Load dotenv if available (node started with -r dotenv/config will populate process.env)
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !anonKey) {
      console.error('MISSING_CONFIG: Supabase URL or anon key not found in environment. Aborting.');
      process.exit(2);
    }

    const signupEmail = `devtest+${Date.now()}@example.com`;
    const signupPassword = `DevTest!${Math.floor(Math.random()*100000)}`;

    // 1) Sign up the user via Supabase Auth public endpoint
    const signupRes = await fetch(`${supabaseUrl.replace(/\/+$/, '')}/auth/v1/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
      },
      body: JSON.stringify({ email: signupEmail, password: signupPassword, options: { email_confirm: false } }),
    });

    const signupBody = await signupRes.json();
    if (!signupRes.ok) {
      console.error('SIGNUP_FAILED', signupRes.status, signupBody?.error || signupBody);
      process.exit(3);
    }

    if (!signupBody || !signupBody?.access_token) {
      // Supabase may require email confirmation depending on project settings; if no access_token, try to get user via /user endpoint
      console.error('SIGNUP_NO_TOKEN: Signup succeeded but no access_token returned. Received limited response.');
      process.exit(4);
    }

    const accessToken = signupBody.access_token;
    // 2) Post profile to backend /api/profiles using the access token
    const profilePayload = {
      email: signupEmail,
      firstName: 'Dev',
      lastName: 'Tester',
      phone: '+10000000000',
      isStudent: false,
      universityEmail: null,
      studentIdExpiry: null,
      language_pref: 'en'
    };

    const backendUrl = process.env.BACKEND_URL || 'http://localhost:4101';
    const createRes = await fetch(`${backendUrl.replace(/\/+$/, '')}/api/profiles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(profilePayload),
    });

    const createBody = await createRes.json().catch(() => null);
    if (!createRes.ok) {
      console.error('PROFILE_CREATE_FAILED', createRes.status, createBody || '(no body)');
      process.exit(5);
    }

    // Success
    console.log('PROFILE_CREATE_OK', { status: createRes.status, id: createBody?.user_id || createBody?.id || '(unknown)' });
    process.exit(0);
  } catch (err) {
    console.error('UNEXPECTED_ERROR', err && err.message ? err.message : err);
    process.exit(6);
  }
})();
