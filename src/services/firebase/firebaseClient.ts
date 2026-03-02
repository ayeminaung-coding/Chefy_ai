import { getApps, initializeApp } from 'firebase/app'; 
import { getAuth } from 'firebase/auth'; 
import { getFirestore } from 'firebase/firestore'; 
import { FIREBASE_CONFIG } from '../../config/env'; 
 
// Prevent re-initializing the app on hot-reload 
const app = 
  getApps().length === 0 ? initializeApp(FIREBASE_CONFIG) : getApps()[0]; 
 
export const auth = getAuth(app); 
export const db = getFirestore(app);
