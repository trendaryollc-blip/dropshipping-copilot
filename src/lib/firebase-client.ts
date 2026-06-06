// Lightweight Firebase client wrapper with mock fallback when env missing.
import { initializeApp, getApps } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

// Read at call-time so the values reflect the actual runtime env, not a
// snapshot taken at module-load (which can be `undefined` during SSR/build).
// Fall back to the `new-automation-app-7dd33` project whose Identity
// Toolkit API is currently enabled (the trendaryo-automation-prod key
// in .env.local is rejected with API_KEY_SERVICE_BLOCKED).  See
// FIREBASE-LOGIN-TROUBLESHOOTING.md for the full story.
const FIREBASE_FALLBACK_CONFIG = {
  apiKey: "AIzaSyDC8NXskfapmCmf8O8y687bxG0DUshbfVY",
  authDomain: "new-automation-app-7dd33.firebaseapp.com",
  projectId: "new-automation-app-7dd33",
  storageBucket: "new-automation-app-7dd33.firebasestorage.app",
  messagingSenderId: "1042435665365",
  appId: "1:1042435665365:web:placeholder",
} as const

function getClientConfig() {
  return {
    apiKey:
      process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
      FIREBASE_FALLBACK_CONFIG.apiKey,
    authDomain:
      process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ||
      FIREBASE_FALLBACK_CONFIG.authDomain,
    projectId:
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
      FIREBASE_FALLBACK_CONFIG.projectId,
    storageBucket:
      process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
      FIREBASE_FALLBACK_CONFIG.storageBucket,
    messagingSenderId:
      process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ||
      FIREBASE_FALLBACK_CONFIG.messagingSenderId,
    appId:
      process.env.NEXT_PUBLIC_FIREBASE_APP_ID ||
      FIREBASE_FALLBACK_CONFIG.appId,
  }
}

let db: ReturnType<typeof getFirestore> | null = null

export function getFirestoreClient() {
  const cfg = getClientConfig()
  // If config missing, return null so callers can use mock behavior
  if (!cfg.projectId || cfg.projectId.startsWith('your_')) return null
  if (!getApps().length) {
    const app = initializeApp(cfg as any)
    db = getFirestore(app)
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
