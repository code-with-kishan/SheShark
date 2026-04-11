import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const hasFirebaseConfig = Boolean(
  import.meta.env.VITE_FIREBASE_API_KEY &&
  import.meta.env.VITE_FIREBASE_PROJECT_ID &&
  import.meta.env.VITE_FIREBASE_APP_ID
);

const usesDemoPlaceholders =
  (import.meta.env.VITE_FIREBASE_API_KEY || '').toLowerCase().includes('demo') ||
  (import.meta.env.VITE_FIREBASE_PROJECT_ID || '').toLowerCase().includes('demo') ||
  (import.meta.env.VITE_FIREBASE_APP_ID || '').toLowerCase().includes('demo');

export const firebaseAuthEnabled = hasFirebaseConfig && !usesDemoPlaceholders;

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-api-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "demo.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "demo.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "000000000000",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:000000000000:web:demo",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Analytics only in browser
if (typeof window !== "undefined" && hasFirebaseConfig && import.meta.env.VITE_FIREBASE_MEASUREMENT_ID) {
  try {
    getAnalytics(app);
  } catch (error) {
    console.warn("Firebase analytics disabled:", error);
  }
} else if (typeof window !== "undefined" && !hasFirebaseConfig) {
  console.warn("Firebase env vars are missing. App runs in demo-safe mode.");
}
 
//this the fire base file for the health and wellness module, it includes the firebase configuration and initialization for the health education, mood tracking, and mental health support features.