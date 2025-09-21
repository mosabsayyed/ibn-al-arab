// Simple URL checker to see what we're sending to Supabase
console.log('=== URL Configuration Check ===');
console.log('Current window.location.origin:', window.location.origin);
console.log('Current window.location.href:', window.location.href);
console.log('Environment VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);

// This will help us see exactly what URL the browser is using
if (typeof window !== 'undefined') {
  console.log('Browser is running from:', window.location.origin);
  console.log('Should match Site URL in Supabase dashboard');
}