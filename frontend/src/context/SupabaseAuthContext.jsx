import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import supabase from '../lib/supabase';

const AuthContext = createContext({});

export const SupabaseAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Fetch the nomad_profile for a given user ID.
   * Gracefully handles missing table / row.
   */
  const fetchProfile = useCallback(async (userId) => {
    try {
      const { data, error } = await supabase
        .from('nomad_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        // PGRST116 = no rows returned — not a real error, profile just doesn't exist yet
        if (error.code !== 'PGRST116') {
          console.warn('[SupabaseAuth] Profile fetch error:', error.message);
        }
        setUserProfile(null);
        return;
      }

      setUserProfile(data);
    } catch (err) {
      console.warn('[SupabaseAuth] Profile fetch failed:', err.message || err);
      setUserProfile(null);
    }
  }, []);

  /* ── Initialise session on mount ─────────────────────────────────────── */
  useEffect(() => {
    let mounted = true;

    const initSession = async () => {
      try {
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        if (error) throw error;

        if (mounted) {
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
          if (currentSession?.user) {
            fetchProfile(currentSession.user.id);
          }
        }
      } catch (err) {
        console.warn('[SupabaseAuth] getSession failed:', err.message || err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    initSession();

    /* ── Listen for auth state changes ────────────────────────────────── */
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        if (!mounted) return;

        setSession(newSession);
        setUser(newSession?.user ?? null);

        if (newSession?.user) {
          fetchProfile(newSession.user.id);
        } else {
          setUserProfile(null);
        }

        setLoading(false);
      },
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  /* ── Auth actions ───────────────────────────────────────────────────── */

  /**
   * Sign up with email, password and display name.
   * Creates auth user + inserts a nomad_profile row.
   */
  const signUp = useCallback(async (email, password, name) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });
    if (error) throw error;

    // Create nomad profile row
    if (data.user) {
      try {
        await supabase.from('nomad_profiles').insert({
          user_id: data.user.id,
          name,
          avatar_gradient: 'from-cyan-500 to-blue-500',
          status: 'open',
        });
      } catch (profileErr) {
        // Table may not exist yet in dev — log but don't block signup
        console.warn('[SupabaseAuth] Profile creation failed (table may not exist):', profileErr.message || profileErr);
      }
    }

    return data;
  }, []);

  /**
   * Sign in with email and password.
   */
  const signIn = useCallback(async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  }, []);

  /**
   * Sign out the current user.
   */
  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUserProfile(null);
  }, []);

  /* ── Context value ──────────────────────────────────────────────────── */

  const value = {
    user,
    session,
    userProfile,
    loading,
    signUp,
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook to access Supabase auth state and actions.
 *
 * Usage:
 *   const { user, session, loading, signUp, signIn, signOut, userProfile } = useSupabaseAuth();
 */
export const useSupabaseAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined || Object.keys(context).length === 0) {
    throw new Error('useSupabaseAuth must be used within a SupabaseAuthProvider');
  }
  return context;
};

export default AuthContext;
