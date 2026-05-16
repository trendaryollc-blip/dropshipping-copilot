// Lightweight Firebase client wrapper with mock fallback when env missing.
import { initializeApp, getApps } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const clientConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

let db: ReturnType<typeof getFirestore> | null = null

export function getFirestoreClient() {
  // If config missing, return null so callers can use mock behavior
  if (!clientConfig.projectId || clientConfig.projectId.startsWith('your_')) return null
  if (!getApps().length) {
    const app = initializeApp(clientConfig as any)
    db = getFirestore(app)
  }
  return db
}

export function isFirestoreConfigured() {
  return Boolean(clientConfig.projectId && !clientConfig.projectId.startsWith('your_'))
}
