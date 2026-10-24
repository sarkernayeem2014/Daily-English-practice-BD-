import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
  User,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './config';
import { handleFirestoreError, OperationType } from './errors';

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export interface UserProfileData {
  uid: string;
  email: string;
  displayName: string;
  name?: string;
  photoURL?: string;
  createdAt: string;
  updatedAt: string;
  fullName?: string;
  institution?: string;
  classLevel?: string;
  phone?: string;
  profileCompleted?: boolean;
}

/**
 * Maps Firebase Auth error codes into clear, empathetic Bengali messages
 */
export function getAuthErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'এই ইমেইল ঠিকানা দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট তৈরি করা আছে। অনুগ্রহ করে লগইন করুন।';
    case 'auth/invalid-email':
      return 'অনুগ্রহ করে একটি সঠিক ও পূর্ণাঙ্গ ইমেইল ঠিকানা লিখুন।';
    case 'auth/operation-not-allowed':
      return 'এই লগইন পদ্ধতিটি বর্তমানে সক্রিয় নেই। অ্যাডমিনের সাথে যোগাযোগ করুন।';
    case 'auth/weak-password':
      return 'পাসওয়ার্ডটি খুবই দুর্বল। কমপক্ষে ৬টি অক্ষরের শক্ত পাসওয়ার্ড দিন।';
    case 'auth/user-disabled':
      return 'এই অ্যাকাউন্টটি নিষ্ক্রিয় করা হয়েছে।';
    case 'auth/user-not-found':
      return 'এই ইমেইলের কোনো অ্যাকাউন্ট পাওয়া যায়নি। সঠিক ইমেইল দিন অথবা নতুন অ্যাকাউন্ট খুলুন।';
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'ইমেইল বা পাসওয়ার্ড সঠিক নয়। অনুগ্রহ করে পুনরায় যাচাই করুন।';
    case 'auth/popup-closed-by-user':
      return 'গুগল সাইন-ইন উইন্ডো বন্ধ করা হয়েছে। পুনরায় চেষ্টা করুন।';
    case 'auth/cancelled-popup-request':
      return 'পূর্বে একটি লগইন উইন্ডো চলমান রয়েছে। অনুগ্রহ করে সেটি সম্পন্ন করুন।';
    case 'auth/popup-blocked':
      return 'ব্রাউজার পপআপ ব্লক করেছে। অনুগ্রহ করে পপআপ অনুমোদন করুন।';
    case 'auth/network-request-failed':
      return 'ইন্টারনেট সংযোগে সমস্যা দেখা দিয়েছে। আপনার কানেকশন চেক করুন।';
    case 'auth/too-many-requests':
      return 'অনেকবার ভুল প্রচেষ্টা করা হয়েছে। কিছু সময় পর পুনরায় চেষ্টা করুন।';
    default:
      return 'লগইন বা রেজিস্ট্রেশনে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।';
  }
}

/**
 * Register a new user with Email and Password
 * Supports register(fullName, email, password) or register(email, password)
 */
export async function register(
  param1: string,
  param2: string,
  param3?: string
): Promise<User> {
  let fullName = '';
  let email = '';
  let password = '';

  if (param3 !== undefined) {
    // Called as register(fullName, email, password)
    fullName = param1;
    email = param2;
    password = param3;
  } else {
    // Called as register(email, password)
    email = param1;
    password = param2;
  }

  const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
  const user = userCredential.user;

  // Update Auth Profile Display Name
  if (fullName.trim()) {
    try {
      await updateProfile(user, { displayName: fullName.trim() });
    } catch {
      // Non-fatal if displayName update fails
    }
  }

  // Create User Profile in Firestore
  const userDocPath = `users/${user.uid}`;
  const profileData: UserProfileData = {
    uid: user.uid,
    email: user.email || email.trim(),
    displayName: fullName.trim() || user.displayName || user.email?.split('@')[0] || 'শিক্ষার্থী',
    photoURL: user.photoURL || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  try {
    await setDoc(doc(db, 'users', user.uid), profileData, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, userDocPath);
  }

  return user;
}

// Alias for explicit email registration
export const registerWithEmail = register;

/**
 * Sign in an existing user with Email and Password
 */
export async function login(email: string, password: string): Promise<User> {
  const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
  return userCredential.user;
}

// Alias for explicit email login
export const loginWithEmail = login;

/**
 * Sign in or Register using Google Sign In Popup
 */
export async function loginWithGoogle(): Promise<User> {
  const userCredential = await signInWithPopup(auth, googleProvider);
  const user = userCredential.user;

  // Ensure user profile document exists in Firestore
  const userDocPath = `users/${user.uid}`;
  try {
    const existingDoc = await getDoc(doc(db, 'users', user.uid));
    if (!existingDoc.exists()) {
      const profileData: UserProfileData = {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || user.email?.split('@')[0] || 'শিক্ষার্থী',
        photoURL: user.photoURL || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await setDoc(doc(db, 'users', user.uid), profileData, { merge: true });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, userDocPath);
  }

  return user;
}

/**
 * Send Password Reset Email
 */
export async function resetPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email.trim());
}

// Aliases for password reset
export const passwordReset = resetPassword;
export const sendPasswordReset = resetPassword;

/**
 * Sign Out
 */
export async function logout(): Promise<void> {
  await signOut(auth);
}

// Alias for logout
export const logoutUser = logout;

/**
 * Converts Bengali numerical digits to English digits
 * e.g. "০১৭১২৩৪৫৬৭৮" -> "01712345678"
 */
export function convertBanglaDigitsToEnglish(input: string): string {
  if (!input) return '';
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return input.replace(/[০-৯]/g, (char) => {
    const idx = bnDigits.indexOf(char);
    return idx !== -1 ? String(idx) : char;
  });
}

/**
 * Validates a Bangladeshi mobile phone number
 * Format: 11 digits, starts with 013, 014, 015, 016, 017, 018, 019
 */
export function validateBangladeshiPhone(phone: string): boolean {
  if (!phone) return true; // Optional field
  const normalized = convertBanglaDigitsToEnglish(phone).replace(/[\s\-+]/g, '');
  const cleanPhone = normalized.startsWith('88') ? normalized.slice(2) : normalized;
  return /^01[3-9]\d{8}$/.test(cleanPhone);
}

/**
 * Fetch user profile from /users/{uid}
 */
export async function getUserProfile(uid: string): Promise<UserProfileData | null> {
  const userDocPath = `users/${uid}`;
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    if (!snap.exists()) return null;
    return snap.data() as UserProfileData;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, userDocPath);
    return null;
  }
}

/**
 * Update user profile at /users/{uid} using setDoc with merge: true
 * Guarantees uid is always present and matches auth.currentUser.uid
 */
export async function updateUserProfile(
  uid: string,
  profileUpdates: Partial<UserProfileData>
): Promise<void> {
  const userDocPath = `users/${uid}`;
  try {
    const payload = {
      ...profileUpdates,
      uid, // Guaranteed to always match user's auth UID
      updatedAt: new Date().toISOString(),
    };
    await setDoc(doc(db, 'users', uid), payload, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, userDocPath);
    throw error;
  }
}


