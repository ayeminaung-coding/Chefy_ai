// ⚠️  This file is listed in .gitignore — never commit API keys.

export const SPOONACULAR_API_KEY: string = '5008b7687dca41bb9169a106ea0939c7';

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

export const FIREBASE_CONFIG: FirebaseConfig = {
  apiKey: 'AIzaSyANo6ERPzrrG-CKrWgR8ktoDdHUNsSpBMQ',
  authDomain: 'chefyai-161ed.firebaseapp.com',
  projectId: 'chefyai-161ed',
  storageBucket: 'chefyai-161ed.firebasestorage.app',
  messagingSenderId: '1029041651553',
  appId: '1:1029041651553:web:68ce855ea8f39692f80f20',
  measurementId: 'G-WJP33RZFW5',
};
