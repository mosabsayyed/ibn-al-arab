import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Minimal runtime checks - do NOT print secrets or keys to the browser console
if (typeof window !== 'undefined') {
  if (!supabaseUrl || !supabaseAnonKey) {
    // Only warn that values are missing; do not log the actual values
    console.error('❌ Supabase client configuration appears incomplete. Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.')
  } else if (supabaseUrl.includes('__YOUR_') || (typeof supabaseAnonKey === 'string' && supabaseAnonKey.includes('__YOUR_'))) {
    console.error('❌ Supabase client configuration contains placeholder values. Please update your .env and restart the dev server.')
  }
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
