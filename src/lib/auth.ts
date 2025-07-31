import { create } from 'zustand';
import { supabase } from './supabase';
import { User, Session, AuthError } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  signUp: (email: string, password: string, userData?: any) => Promise<{ user: User | null; error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ user: User | null; error: AuthError | null }>;
  signInWithOAuth: (provider: 'google' | 'github') => Promise<{ user: User | null; error: AuthError | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  updateProfile: (updates: any) => Promise<{ user: User | null; error: AuthError | null }>;
  refreshSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  isLoading: true,
  error: null,

  signUp: async (email: string, password: string, userData?: any) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });

      if (error) {
        set({ error: error.message });
        return { user: null, error };
      }

      // Create profile record
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email: data.user.email,
            username: userData?.username,
            full_name: userData?.full_name,
            role: 'reader',
            subscription_status: 'free'
          });

        if (profileError) {
          console.error('Profile creation error:', profileError);
        }
      }

      set({ 
        user: data.user, 
        session: data.session,
        isLoading: false 
      });

      return { user: data.user, error: null };
    } catch (error) {
      set({ error: 'An unexpected error occurred', isLoading: false });
      return { user: null, error: error as AuthError };
    }
  },

  signIn: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        set({ error: error.message });
        return { user: null, error };
      }

      set({ 
        user: data.user, 
        session: data.session,
        isLoading: false 
      });

      return { user: data.user, error: null };
    } catch (error) {
      set({ error: 'An unexpected error occurred', isLoading: false });
      return { user: null, error: error as AuthError };
    }
  },

  signInWithOAuth: async (provider: 'google' | 'github') => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        set({ error: error.message });
        return { user: null, error };
      }

      return { user: null, error: null };
    } catch (error) {
      set({ error: 'An unexpected error occurred', isLoading: false });
      return { user: null, error: error as AuthError };
    }
  },

  signOut: async () => {
    try {
      set({ isLoading: true });
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        set({ error: error.message });
        return;
      }

      set({ 
        user: null, 
        session: null,
        isLoading: false,
        error: null 
      });
    } catch (error) {
      set({ error: 'An unexpected error occurred', isLoading: false });
    }
  },

  resetPassword: async (email: string) => {
    try {
      set({ isLoading: true, error: null });
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      });

      if (error) {
        set({ error: error.message });
        return { error };
      }

      set({ isLoading: false });
      return { error: null };
    } catch (error) {
      set({ error: 'An unexpected error occurred', isLoading: false });
      return { error: error as AuthError };
    }
  },

  updateProfile: async (updates: any) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data: { user }, error } = await supabase.auth.updateUser(updates);

      if (error) {
        set({ error: error.message });
        return { user: null, error };
      }

      // Update profile in database
      if (user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update(updates.data)
          .eq('id', user.id);

        if (profileError) {
          console.error('Profile update error:', profileError);
        }
      }

      set({ 
        user,
        isLoading: false 
      });

      return { user, error: null };
    } catch (error) {
      set({ error: 'An unexpected error occurred', isLoading: false });
      return { user: null, error: error as AuthError };
    }
  },

  refreshSession: async () => {
    try {
      set({ isLoading: true });
      
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Session refresh error:', error);
        set({ isLoading: false });
        return;
      }

      if (session) {
        const { data: { user } } = await supabase.auth.getUser();
        set({ 
          user, 
          session,
          isLoading: false 
        });
      } else {
        set({ 
          user: null, 
          session: null,
          isLoading: false 
        });
      }
    } catch (error) {
      console.error('Session refresh error:', error);
      set({ isLoading: false });
    }
  }
}));

// Initialize auth state
export const initializeAuth = async () => {
  const { refreshSession } = useAuthStore.getState();
  await refreshSession();

  // Listen for auth changes
  supabase.auth.onAuthStateChange(async (event, session) => {
    const { user } = useAuthStore.getState();
    
    if (event === 'SIGNED_IN' && session) {
      useAuthStore.setState({ 
        user: session.user, 
        session,
        isLoading: false,
        error: null 
      });
    } else if (event === 'SIGNED_OUT') {
      useAuthStore.setState({ 
        user: null, 
        session: null,
        isLoading: false,
        error: null 
      });
    }
  });
}; 