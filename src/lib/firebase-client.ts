// Lightweight Firebase client wrapper for automation-copilot-62b12
import { initializeApp, getApps } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyCuxoy9erTCoB_QYARF724PC513tDWL8jQ",
  authDomain: "automation-copilot-62b12.firebaseapp.com",
  projectId: "automation-copilot-62b12",
  storageBucket: "automation-copilot-62b12.firebasestorage.app",
  messagingSenderId: "140344348376",
  appId: "1:140344348376:web:8ff56d66a593eaf6ec11ad",
  measurementId: "G-HCCW1FQET4",
} as const

function getClientConfig() {
  return {
    apiKey:
      process.env.NEXT_PUBLIC_FIREBASE_API_KEY || FIREBASE_CONFIG.apiKey,
    authDomain:
      process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || FIREBASE_CONFIG.authDomain,
    projectId:
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || FIREBASE_CONFIG.projectId,
    storageBucket:
      process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || FIREBASE_CONFIG.storageBucket,
    messagingSenderId:
      process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || FIREBASE_CONFIG.messagingSenderId,
    appId:
      process.env.NEXT_PUBLIC_FIREBASE_APP_ID || FIREBASE_CONFIG.appId,
  }
}

let db: ReturnType<typeof getFirestore> | null = null

export function getFirestoreClient() {
  const cfg = getClientConfig()
  if (!cfg.projectId || cfg.projectId.startsWith('your_')) return null
  if (!getApps().length) {
    const app = initializeApp(cfg as any)
    db = getFirestore(app)
  } else if (!db) {
    // App was already initialized by another module (e.g. firebase-auth.ts).
    // Retrieve Firestore from the existing app so callers still get a usable client.
    db = getFirestore(getApps()[0]!)
  }
  return db
}

export function isFirestoreConfigured() {
  const cfg = getClientConfig()
  return Boolean(
    cfg.projectId &&
      cfg.projectId.length > 0 &&
      !cfg.projectId.startsWith('your_'),
  )
}