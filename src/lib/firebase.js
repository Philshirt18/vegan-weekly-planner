import { initializeApp } from 'firebase/app'
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore'

// The access values come from .env.local (see .env.example) and never from the code.
const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

export const isConfigured = Boolean(config.apiKey && config.projectId && config.appId)

let auth = null
let db = null
if (isConfigured) {
  const app = initializeApp(config)
  auth = getAuth(app)
  db = getFirestore(app)
}

// Calls callback(user) at start and on every sign-in/sign-out (user is null when signed out).
export function watchAuth(callback) {
  if (!auth) {
    callback(null)
    return () => {}
  }
  return onAuthStateChanged(auth, callback)
}

export const signUp = (email, password) => createUserWithEmailAndPassword(auth, email, password)
export const signIn = (email, password) => signInWithEmailAndPassword(auth, email, password)
export const signOutUser = () => signOut(auth)

const userDoc = (uid) => doc(db, 'users', uid)

export async function loadUserData(uid) {
  const snap = await getDoc(userDoc(uid))
  return snap.exists() ? snap.data() : null
}

export function saveUserData(uid, patch) {
  return setDoc(userDoc(uid), patch, { merge: true })
}

// Friendly messages for the most common sign-in errors.
export function authErrorMessage(error) {
  switch (error?.code) {
    case 'auth/invalid-email':
      return 'That email address does not look right.'
    case 'auth/email-already-in-use':
      return 'There is already an account with this email. Please sign in.'
    case 'auth/weak-password':
      return 'The password is too short. Please use at least 6 characters.'
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Email or password is wrong.'
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait a moment and try again later.'
    case 'auth/network-request-failed':
      return 'No connection. Please check your internet.'
    default:
      return 'That did not work. Please try again.'
  }
}
