// Production API base URL configuration
export const API_BASE = import.meta.env.VITE_API_URL || '';

export async function apiFetch(path: string, opts?: RequestInit) {
  // Handle absolute URLs (pass through as-is)
  const url = path.startsWith('http') 
    ? path 
    : `${API_BASE}${path.startsWith('/') ? '' : '/'}${path}`;
  
  const res = await fetch(url, opts);
  
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`apiFetch ${res.status} ${res.statusText} ${text}`);
  }
  
  return res.json();
}

// Helper for form data uploads
export async function apiUpload(path: string, formData: FormData) {
  const url = path.startsWith('http') 
    ? path 
    : `${API_BASE}${path.startsWith('/') ? '' : '/'}${path}`;
    
  const res = await fetch(url, {
    method: 'POST',
    body: formData,
  });
  
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`apiUpload ${res.status} ${res.statusText} ${text}`);
  }
  
  return res.json();
}