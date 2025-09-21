import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  profile: any;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  register: (email: string, password: string, fullName?: string) => Promise<{ error?: string; needsConfirmation?: boolean }>;
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
          await loadUserProfile(session.user.id);
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
    console.log('👤 Loading profile for user:', userId);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (error) {
        // Treat 'no rows' as non-fatal
        console.warn('Profile load warning:', error.message);
        setProfile(null);
        return;
      }
      
      console.log('✅ Profile loaded:', data);
      setProfile(data);
    } catch (err) {
      console.error('💥 Profile load unexpected error:', err);
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

  const register = async (email: string, password: string, fullName?: string) => {
    console.log('📝 Attempting registration for:', email);
    
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
      
      // Create or update profile only when we have a user id (using upsert for safety)
      if (user && fullName) {
        console.log('📝 Creating/updating user profile...');
        
        const [first_name, ...rest] = fullName.trim().split(' ');
        const last_name = rest.join(' ');
        
        const profilePayload = {
          user_id: user.id,
          email: user.email,
          first_name,
          last_name,
          language_pref: 'en'
        };
        
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert(profilePayload, { onConflict: 'user_id' });
        
        if (profileError) {
          console.error('❌ Profile upsert error:', profileError.message);
        } else {
          console.log('✅ Profile created/updated successfully');
          await loadUserProfile(user.id);
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
    await supabase.auth.signOut();
    // Don't manually clear state here - let the auth state change listener handle it
    console.log('✅ Logout initiated');
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
