import { GoogleSignin } from '@react-native-google-signin/google-signin';
import {
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithCredential,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    User,
} from 'firebase/auth';
import { Platform } from 'react-native';
import { create } from 'zustand';

import { GOOGLE_WEB_CLIENT_ID } from '../config/env';
import { auth } from '../services/firebase/firebaseClient';
import useFavoritesStore from './favoritesStore';

let authUnsubscribe: (() => void) | null = null;
let googleConfigured = false;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getErrorCode(error: unknown): string | null {
  if (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof (error as { code?: unknown }).code === 'string'
  ) {
    return (error as { code: string }).code;
  }
  return null;
}

function getFriendlyAuthError(error: unknown, flow: 'login' | 'signup' | 'google' | 'logout'): string {
  const code = getErrorCode(error);

  if (!code) {
    switch (flow) {
      case 'login':
        return 'Unable to sign in. Please try again.';
      case 'signup':
        return 'Unable to create your account. Please try again.';
      case 'google':
        return 'Google sign-in failed. Please try again.';
      default:
        return 'Logout failed. Please try again.';
    }
  }

  switch (code) {
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/missing-password':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return flow === 'signup'
        ? 'Please check your email and password.'
        : 'Incorrect email or password.';
    case 'auth/user-not-found':
      return 'No account found for this email.';
    case 'auth/email-already-in-use':
      return 'This email is already registered. Please sign in instead.';
    case 'auth/weak-password':
      return 'Password is too weak. Use at least 6 characters.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait a moment and try again.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection.';
    case 'auth/popup-closed-by-user':
      return 'Google sign-in was canceled.';
    case 'auth/popup-blocked':
      return 'Popup was blocked. Please allow popups and try again.';
    default:
      switch (flow) {
        case 'login':
          return 'Unable to sign in. Please try again.';
        case 'signup':
          return 'Unable to create your account. Please try again.';
        case 'google':
          return 'Google sign-in failed. Please try again.';
        default:
          return 'Logout failed. Please try again.';
      }
  }
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  initializing: boolean;
  initAuthListener: () => void;
  login: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  googleSignIn: () => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
    user: null,
    loading: false,
    error: null,
    initializing: true,

    initAuthListener: () => {
      if (authUnsubscribe) {
        return;
      }

      authUnsubscribe = onAuthStateChanged(auth, (user) => {
        set({ user, initializing: false });
        if (user) {
          useFavoritesStore.getState().loadFavorites();
        } else {
          useFavoritesStore.getState().clearFavorites();
        }
      });
    },

    login: async (email, password) => {
      set({ loading: true, error: null });
      try {
        if (!EMAIL_REGEX.test(email.trim())) {
          throw { code: 'auth/invalid-email' };
        }
        await signInWithEmailAndPassword(auth, email, password);
        set({ loading: false });
      } catch (e: unknown) {
        set({
          loading: false,
          error: getFriendlyAuthError(e, 'login'),
        });
      }
    },

    signUp: async (email, password) => {
      set({ loading: true, error: null });
      try {
        if (!EMAIL_REGEX.test(email.trim())) {
          throw { code: 'auth/invalid-email' };
        }
        await createUserWithEmailAndPassword(auth, email, password);
        set({ loading: false });
      } catch (e: unknown) {
        set({
          loading: false,
          error: getFriendlyAuthError(e, 'signup'),
        });
      }
    },

    googleSignIn: async () => {
      set({ loading: true, error: null });
      try {
        if (Platform.OS === 'web') {
          // Web: use Firebase's built-in popup flow — no native module needed
          const provider = new GoogleAuthProvider();
          await signInWithPopup(auth, provider);
        } else {
          // Android/iOS: use the native Google Sign-In module
          if (!GOOGLE_WEB_CLIENT_ID) {
            throw new Error('Missing GOOGLE_WEB_CLIENT_ID in environment configuration.');
          }
          if (!googleConfigured) {
            GoogleSignin.configure({ webClientId: GOOGLE_WEB_CLIENT_ID });
            googleConfigured = true;
          }
          await GoogleSignin.hasPlayServices();
          const { data } = await GoogleSignin.signIn();
          const credential = GoogleAuthProvider.credential(data?.idToken ?? null);
          await signInWithCredential(auth, credential);
        }
        set({ loading: false });
      } catch (e: unknown) {
        set({
          loading: false,
          error: getFriendlyAuthError(e, 'google'),
        });
      }
    },

    logout: async () => {
      set({ loading: true, error: null });
      try {
        await signOut(auth);
        useFavoritesStore.getState().clearFavorites();
        set({ user: null, loading: false });
      } catch (e: unknown) {
        set({
          loading: false,
          error: getFriendlyAuthError(e, 'logout'),
        });
      }
    },

    clearError: () => set({ error: null }),
  }),
);

if (typeof module !== 'undefined' && (module as { hot?: { dispose?: (cb: () => void) => void } }).hot?.dispose) {
  (module as { hot: { dispose: (cb: () => void) => void } }).hot.dispose(() => {
    authUnsubscribe?.();
    authUnsubscribe = null;
  });
}

export default useAuthStore;
