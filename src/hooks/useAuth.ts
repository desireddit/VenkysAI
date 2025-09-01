import { useState, useEffect } from 'react';
import { User } from '../types';
import { 
  loginUser, 
  registerUser, 
  logoutUser,
  onAuthStateChange,
  LoginCredentials,
  RegisterCredentials,
  UserProfile 
} from '../services/auth';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChange((userProfile: UserProfile | null) => {
      if (userProfile) {
        setUser({
          id: userProfile.id,
          username: userProfile.username,
          email: userProfile.email,
          createdAt: userProfile.createdAt
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (credentials: LoginCredentials) => {
    setLoading(true);
    setError(null);

    try {
      const result = await loginUser(credentials);
      if (!result.success) {
        setError(result.error || 'Login failed');
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (credentials: RegisterCredentials) => {
    setLoading(true);
    setError(null);

    try {
      const result = await registerUser(credentials);
      if (!result.success) {
        setError(result.error || 'Registration failed');
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await logoutUser();
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return { user, loading, signIn, signUp, signOut, error };
};