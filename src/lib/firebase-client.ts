// Lightweight Firebase client wrapper with mock fallback when env missing.
import { initializeApp, getApps } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

// Read at call-time so the values reflect the actual runtime env, not a
// snapshot taken at module-load (which can be `undefined` during SSR/build).
function getClientConfig() {
  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
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
