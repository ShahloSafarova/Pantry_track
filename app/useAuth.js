// useAuth.js
import { useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { useAuth } from '@/hooks/useAuth'; // Import your custom hook

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Monitor authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUp = async (email, password) => {
    try {
      setError(null); // Clear any previous errors
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError(err.message);
    }
  };

  const signIn = async (email, password) => {
    try {
      setError(null); // Clear any previous errors
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError(err.message);
    }
  };

  const logOut = async () => {
    try {
      setError(null); // Clear any previous errors
      await signOut(auth);
    } catch (err) {
      setError(err.message);
    }
  };

  return { user, loading, error, signUp, signIn, logOut };
};
