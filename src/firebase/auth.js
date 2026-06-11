import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './config';

const googleProvider = new GoogleAuthProvider();

// Register with email/password
export const registerWithEmail = async (email, password, displayName) => {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(credential.user, { displayName });
  await createUserDocument(credential.user);
  return credential.user;
};

// Sign in with email/password
export const loginWithEmail = async (email, password) => {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
};

// Sign in with Google
export const loginWithGoogle = async () => {
  const credential = await signInWithPopup(auth, googleProvider);
  await createUserDocument(credential.user);
  return credential.user;
};

// Sign out
export const logoutUser = () => signOut(auth);

// Forgot password
export const resetPassword = (email) => sendPasswordResetEmail(auth, email);

// Create user doc in Firestore on first sign-in
export const createUserDocument = async (user) => {
  if (!user) return;
  const userRef = doc(db, 'users', user.uid);
  const snap = await getDoc(userRef);
  if (!snap.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      displayName: user.displayName || '',
      email: user.email,
      photoURL: user.photoURL || '',
      createdAt: serverTimestamp(),
      plan: 'free',
    });
  }
};

// Auth state listener
export const onAuthChange = (callback) => onAuthStateChanged(auth, callback);
