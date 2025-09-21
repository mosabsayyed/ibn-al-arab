import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Debug logging to check if environment variables are loaded
console.log('🔐 Supabase Config Debug:')
console.log('URL:', supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : 'MISSING')
console.log('Key:', supabaseAnonKey ? `${supabaseAnonKey.substring(0, 10)}...` : 'MISSING')

// Check current browser URL for Site URL validation
if (typeof window !== 'undefined') {
  console.log('🌐 Browser URL Check:')
  console.log('Current origin:', window.location.origin)
  console.log('Current href:', window.location.href)
  console.log('📝 This origin should be in your Supabase Site URL settings')
}

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('__YOUR_') || supabaseAnonKey.includes('__YOUR_')) {
  console.error('❌ Supabase credentials are missing or still have placeholder values!')
  console.error('Please check your .env file and restart the dev server.')
}

// Create client with custom fetch to ensure ONLY apikey header is sent
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    fetch: (url: RequestInfo | URL, options: RequestInit = {}) => {
      // Ensure ONLY apikey header is present, remove any Authorization header
      const headers = { ...(options.headers as Record<string, string> || {}) };
      delete headers['Authorization']; // Explicitly remove Bearer token
      delete headers['authorization']; // Also remove lowercase version
      headers['apikey'] = supabaseAnonKey; // Ensure apikey is set

      return fetch(url, {
        ...options,
        headers,
      });
    },
  },
})
