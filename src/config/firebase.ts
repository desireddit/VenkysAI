import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyD1eCfKsUTg-Aq3FchnrSfrS3K-BMVLxng",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "venky-s-ai.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "venky-s-ai",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "venky-s-ai.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "528391320020",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:528391320020:web:ab98e9a85ed2700de86641",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-WP8MGE2SEB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;