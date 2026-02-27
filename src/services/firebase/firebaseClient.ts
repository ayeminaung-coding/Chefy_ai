import { getApps, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { FIREBASE_CONFIG } from '../../config/env';

// Prevent re-initializing the app on hot-reload
const app =
  getApps().length === 0 ? initializeApp(FIREBASE_CONFIG) : getApps()[0];

// NOTE: getAnalytics() is a browser-only API and is intentionally
// omitted — it throws at runtime in React Native.

export const db = getFirestore(app);
