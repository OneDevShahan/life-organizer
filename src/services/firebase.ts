import { getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyA1aBVVp5_7yQqFPyLgGOaDarkg3ielfP8',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'life-organizer-dea64.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'life-organizer-dea64',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'life-organizer-dea64.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '136823120649',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:136823120649:web:03201de65aceea25a6e9d8',
};

export const firebaseReady = Boolean(
  firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.appId,
);

const app = firebaseReady
  ? getApps()[0] ?? initializeApp(firebaseConfig)
  : null;

export const firebaseAuth = app ? getAuth(app) : null;
export const firestore = app ? getFirestore(app) : null;
