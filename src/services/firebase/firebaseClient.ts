import { getApps, initializeApp } from 'firebase/app';
import { getAuth, getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FIREBASE_CONFIG } from '../../config/env';

// Prevent re-initializing the app on hot-reload
const alreadyInitialized = getApps().length > 0;
const app = alreadyInitialized ? getApps()[0] : initializeApp(FIREBASE_CONFIG);

// Use AsyncStorage persistence so auth session survives app restarts on React Native.
// On hot-reload the auth instance already exists, so fall back to getAuth().
export const auth = alreadyInitialized
  ? getAuth(app)
  : initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });

export const db = getFirestore(app);
