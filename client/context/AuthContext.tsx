import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  profile: any;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  register: (email: string, password: string, fullName?: string, profileData?: any) => Promise<{ error?: string; needsConfirmation?: boolean }>;
  resetPassword: (email: string) => Promise<{ error?: string; success?: boolean }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('🔍 Initial session check:', session?.user?.email || 'No session');
      setSession(session);
      setUser(session?.user ?? null);
      
      // Load profile if user exists
      if (session?.user) {
        loadUserProfile(session.user.id);
      }
      
      setLoading(false);
    });

    // Listen for auth changes - This is critical for handling email confirmations!
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state changed:', event, session?.user?.email || 'No session');

        setSession(session);
        setUser(session?.user ?? null);

        // Load or clear profile based on session
        if (session?.user) {
          // Do not await here — make the profile load non-blocking so a stalled fetch doesn't freeze auth state handling.
          loadUserProfile(session.user.id).catch((err) => {
            console.warn('loadUserProfile failed (non-blocking):', err);
          });
        } else {
          setProfile(null);
        }

        setLoading(false);

        // Handle specific auth events
        if (event === 'SIGNED_IN') {
          console.log('✅ User signed in successfully');
        } else if (event === 'SIGNED_OUT') {
          console.log('👋 User signed out');
        } else if (event === 'TOKEN_REFRESHED') {
          console.log('🔄 Token refreshed');
        }
      }
    );

    return () => {
      if (subscription && typeof subscription.unsubscribe === 'function') {
        subscription.unsubscribe();
      }
    };
  }, []);

  const loadUserProfile = async (userId: string) => {
    console.log('👤 Loading profile for user (backend):', userId);
    try {
      const tokenRes = await supabase.auth.getSession();
      const jwt = tokenRes.data?.session?.access_token;

      // Abortable fetch: avoid hanging forever if the backend stalls. Timeout after 8s.
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);

      console.log('👤 Fetching profile from backend with 8s timeout');
      const resp = await fetch(`/api/profiles/${encodeURIComponent(userId)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(jwt ? { Authorization: `Bearer ${jwt}` } : {})
        },
        signal: controller.signal
      }).finally(() => clearTimeout(timeout));

      if (!resp.ok) {
        const body = await resp.json().catch(() => ({}));
        console.warn('Profile fetch from backend returned non-OK:', resp.status, body);
        setProfile(null);
        return;
      }

      const data = await resp.json();
      console.log('✅ Profile loaded from backend:', !!data);
      if (data) {
        const normalized = { ...data } as any;
        const booleanAdmin = normalized.isAdmin === true || normalized.is_admin === true || normalized.is_admin === 'true' || normalized.isAdmin === 'true';
        if (!normalized.role && booleanAdmin) normalized.role = 'admin';
        normalized.isAdmin = booleanAdmin || !!normalized.isAdmin;
        setProfile(normalized);
      } else {
        setProfile(null);
      }
    } catch (err) {
      if ((err as any)?.name === 'AbortError') {
        console.warn('⏱️ Profile fetch aborted due to timeout');
      } else {
        console.error('💥 Profile load unexpected error (backend):', err);
      }
      setProfile(null);
    }
  };

  const login = async (email: string, password: string) => {
    console.log('🔐 Attempting login for:', email);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) {
        console.error('❌ Login error:', error.message);
        return { error: error.message };
      }
      
      // Session/user will be surfaced via onAuthStateChange -> loadUserProfile
      console.log('✅ Login successful:', data.user?.email);
      return {};
    } catch (err) {
      console.error('💥 Login unexpected error:', err);
      return { error: 'Unexpected error during login' };
    }
  };

  const register = async (email: string, password: string, fullName?: string, profileData?: any) => {
    console.log('📝 Attempting registration for:', email);

    // Require phone on registration (client-side validation) and ensure E.164 format
    const rawPhone = profileData?.phone?.toString().trim()
    if (!rawPhone) {
      console.warn('Registration prevented: phone is required')
      return { error: 'phone is required' }
    }
    // Basic E.164 validation: leading +, country code (no leading zero), max 15 digits total
    const e164Regex = /^\+[1-9]\d{1,14}$/
    if (!e164Regex.test(rawPhone)) {
      console.warn('Registration prevented: phone not in E.164 format', rawPhone)
      return { error: 'phone must be in E.164 format, e.g. +123456789' }
    }
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          // For development, we'll handle email confirmation differently
          // Don't set emailRedirectTo for localhost development
        }
      });
      
      if (error) {
        console.error('❌ Registration error:', error.message);
        return { error: error.message };
      }
      
      // Get confirmed user and session data
      const user = data.user ?? (await supabase.auth.getUser()).data.user;
      const session = data.session ?? (await supabase.auth.getSession()).data.session;
      
      // Create or update profile only when we have a user id — delegate to backend API
      if (user) {
        console.log('📝 Sending profile to backend for creation via /api/profiles');
        const profilePayload = {
          // Include user_id so backend can upsert immediately after signUp even if no session JWT is present
          user_id: user.id,
          email: user.email,
          firstName: profileData?.firstName || '',
          lastName: profileData?.lastName || '',
          phone: profileData?.phone || '',
          isStudent: profileData?.isStudent || false,
          universityEmail: profileData?.universityEmail || null,
          studentIdExpiry: profileData?.studentIdExpiry || null,
          language_pref: 'en'
        };

        try {
          const tokenRes = await supabase.auth.getSession();
          const jwt = tokenRes.data?.session?.access_token;

          const resp = await fetch('/api/profiles', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(jwt ? { Authorization: `Bearer ${jwt}` } : {})
            },
            body: JSON.stringify(profilePayload)
          });

          const body = await resp.json();
          console.log('📦 Backend /api/profiles response:', resp.status, body);

          if (!resp.ok) {
            const msg = body?.error || `Server returned ${resp.status}`;
            console.error('❌ Backend profile create failed:', msg);
            return { error: `Registration failed: ${msg}` };
          }

          // Set profile from backend response
          setProfile(body);
          console.log('✅ Profile created/updated by backend', body);
        } catch (err) {
          console.error('💥 Error calling backend /api/profiles:', err);
          return { error: 'Registration failed: error creating profile on server' };
        }
      }
      
      // If no session, user likely needs email confirmation
      if (!session) {
        console.log('📧 User created but needs email confirmation');
        return { needsConfirmation: true };
      }
      
      console.log('🎉 Registration successful with immediate confirmation');
      return {};
      
    } catch (err) {
      console.error('💥 Unexpected registration error:', err);
      return { error: 'Unexpected error during registration' };
    }
  };

  const resetPassword = async (email: string) => {
    console.log('🔄 Attempting password reset for:', email);
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      // Don't use localhost for password reset in development
      // This will use the default redirect URL from Supabase settings
    });
    
    if (error) {
      console.error('❌ Password reset error:', error.message);
      return { error: error.message };
    }
    
    console.log('✅ Password reset email sent');
    return { success: true };
  };

  const logout = async () => {
    console.log('👋 Attempting logout');
    
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('❌ Logout error:', error.message);
        throw error;
      }
      
      console.log('✅ Logout completed successfully');
    } catch (err) {
      console.error('💥 Unexpected logout error:', err);
      // Even if logout fails, clear local state to prevent user confusion
      setSession(null);
      setUser(null);
      setProfile(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, profile, login, register, resetPassword, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
