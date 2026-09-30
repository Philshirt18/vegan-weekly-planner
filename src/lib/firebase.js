import { initializeApp } from 'firebase/app'
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore'

// Die Zugangswerte kommen aus .env.local (siehe .env.example) und nie aus dem Code.
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

// Ruft callback(user) beim Start und bei jeder Anmeldung/Abmeldung auf (user ist null, wenn abgemeldet).
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

// Verständliche deutsche Meldungen für die häufigsten Anmeldefehler.
export function authErrorMessage(error) {
  switch (error?.code) {
    case 'auth/invalid-email':
      return 'Diese E-Mail-Adresse sieht nicht richtig aus.'
    case 'auth/email-already-in-use':
      return 'Mit dieser E-Mail gibt es schon ein Konto. Bitte melde dich an.'
    case 'auth/weak-password':
      return 'Das Passwort ist zu kurz. Bitte mindestens 6 Zeichen.'
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'E-Mail oder Passwort stimmt nicht.'
    case 'auth/too-many-requests':
      return 'Zu viele Versuche. Bitte warte kurz und versuche es später noch einmal.'
    case 'auth/network-request-failed':
      return 'Keine Verbindung. Bitte prüfe dein Internet.'
    default:
      return 'Das hat nicht geklappt. Bitte versuche es noch einmal.'
  }
}
