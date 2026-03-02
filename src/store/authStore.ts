import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    User,
} from 'firebase/auth';
import { create } from 'zustand';

import { auth } from '../services/firebase/firebaseClient';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  initializing: boolean;
  login: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const useAuthStore = create<AuthState>((set) => {
  // Subscribe to Firebase Auth state changes
  onAuthStateChanged(auth, (user) => {
    set({ user, initializing: false });
  });

  return {
    user: null,
    loading: false,
    error: null,
    initializing: true,

    login: async (email, password) => {
      set({ loading: true, error: null });
      try {
        await signInWithEmailAndPassword(auth, email, password);
        set({ loading: false });
      } catch (e: unknown) {
        set({
          loading: false,
          error:
            e instanceof Error ? e.message : 'Login failed. Please try again.',
        });
      }
    },

    signUp: async (email, password) => {
      set({ loading: true, error: null });
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        set({ loading: false });
      } catch (e: unknown) {
        set({
          loading: false,
          error:
            e instanceof Error
              ? e.message
              : 'Sign up failed. Please try again.',
        });
      }
    },

    logout: async () => {
      // Clear local state immediately so navigation transitions right away,
      // regardless of how long signOut takes or whether it fails.
      set({ user: null });
      try {
        await signOut(auth);
      } catch {
        // Already cleared above — ignore Firebase errors.
      }
    },

    clearError: () => set({ error: null }),
  };
});

export default useAuthStore;
