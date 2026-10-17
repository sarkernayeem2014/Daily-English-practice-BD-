import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCekbdJq1fdbDmW8XfC10p83Vi1hsE6kug",
  authDomain: "daily-english-practice-bd.firebaseapp.com",
  projectId: "daily-english-practice-bd",
  storageBucket: "daily-english-practice-bd.firebasestorage.app",
  messagingSenderId: "638357894813",
  appId: "1:638357894813:web:b31a7ca7dd97eb66044674",
  measurementId: "G-GL3SW64833"
};

// Initialize Firebase App
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore with default database
export const db = getFirestore(app);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Test Firestore connection on app startup
export async function testFirestoreConnection(): Promise<boolean> {
  return !!db;
}

export default app;

