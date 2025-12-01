import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { AppState } from 'react-native';

// Create the Auth Context
const AuthContext = createContext({});

/**
 * Custom hook to use the Auth Context
 * @returns {Object} Auth context with user, session, and auth methods
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/**
 * AuthProvider component that wraps the app and provides authentication state
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      console.log('AuthContext: Initial session check completed')
      if (error) {
        console.error('AuthContext: getSession error:', error)
      }
      if (session) {
        console.log('AuthContext: Session found for user:', session.user.email)
      } else {
        console.log('AuthContext: No session found (getSession returned null)')
      }
      setSession(session);
      setUser(session?.user ?? null);
      setInitialLoading(false);
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('AuthContext: onAuthStateChange event:', _event, session ? 'Session Active' : 'No Session')
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Handle app state changes (refresh token when app comes to foreground)
    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === 'active') {
        supabase.auth.startAutoRefresh();
      } else {
        supabase.auth.stopAutoRefresh();
      }
    };

    const subscriptionAppState = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.unsubscribe();
      subscriptionAppState?.remove();
    };
  }, []);

  /**
   * Sign in with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} Object with error or success data
   */
  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return { data: null, error };
    }
  };

  /**
   * Sign up with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {Object} metadata - Optional user metadata
   * @returns {Promise<Object>} Object with error or success data
   */
  const signUp = async (email, password, metadata = {}) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      });

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      return { data: null, error };
    }
  };

  /**
   * Sign out the current user
   * @returns {Promise<Object>} Object with error or success data
   */
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) throw error;

      setUser(null);
      setSession(null);

      return { error: null };
    } catch (error) {
      console.error('Sign out error:', error);
      return { error };
    }
  };

  /**
   * Send password reset email
   * @param {string} email - User email
   * @returns {Promise<Object>} Object with error or success data
   */
  const resetPassword = async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'myapp://reset-password',
      });

      if (error) throw error;

      return { error: null };
    } catch (error) {
      console.error('Reset password error:', error);
      return { error };
    }
  };

  /**
   * Update user password
   * @param {string} newPassword - New password
   * @returns {Promise<Object>} Object with error or success data
   */
  const updatePassword = async (newPassword) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      return { error: null };
    } catch (error) {
      console.error('Update password error:', error);
      return { error };
    }
  };

  /**
   * Update user metadata
   * @param {Object} metadata - User metadata to update
   * @returns {Promise<Object>} Object with error or success data
   */
  const updateUser = async (metadata) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: metadata,
      });

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Update user error:', error);
      return { data: null, error };
    }
  };

  /**
   * Get current user
   * @returns {Promise<Object>} Current user object
   */
  const getUser = async () => {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) throw error;

      return { user, error: null };
    } catch (error) {
      console.error('Get user error:', error);
      return { user: null, error };
    }
  };

  /**
   * Check if user is authenticated
   * @returns {boolean} True if user is authenticated
   */
  const isAuthenticated = () => {
    return !!user;
  };

  /**
   * Refresh the current session
   * @returns {Promise<Object>} Object with error or success data
   */
  const refreshSession = async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Refresh session error:', error);
      return { data: null, error };
    }
  };

  /**
   * Send email verification
   * @returns {Promise<Object>} Object with error or success data
   */
  const resendEmailVerification = async () => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user?.email,
      });

      if (error) throw error;

      return { error: null };
    } catch (error) {
      console.error('Resend email verification error:', error);
      return { error };
    }
  };

  /**
   * Delete the current user account
   * @returns {Promise<Object>} Object with error or success data
   */
  const deleteAccount = async () => {
    try {
      const { error } = await supabase.auth.admin.deleteUser(user.id);

      if (error) throw error;

      setUser(null);
      setSession(null);

      return { error: null };
    } catch (error) {
      console.error('Delete account error:', error);
      return { error };
    }
  };

  // Context value
  const value = {
    user,
    session,
    loading,
    initialLoading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    updateUser,
    getUser,
    isAuthenticated,
    refreshSession,
    resendEmailVerification,
    deleteAccount,
  };

  return (
    <AuthContext.Provider value={value}>
      {!initialLoading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

