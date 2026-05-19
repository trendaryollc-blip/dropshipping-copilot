// Firebase Authentication wrapper
// Provides clean async helper functions built on the Firebase Auth client SDK.
// Returns plain user objects so the UI layer never depends on the Firebase namespace.
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile as fbUpdateProfile,
  sendEmailVerification,
  signInWithPopup,
  GoogleAuthProvider,
  User as FBUser,
} from "firebase/auth"
import { initializeApp, getApps } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import type { User } from "@/types"
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

let fbApp: ReturnType<typeof initializeApp> | null = null
let db: ReturnType<typeof getFirestore> | null = null

if (!getApps().length) {
  fbApp = initializeApp(firebaseConfig as any)
  db = getFirestore(fbApp)
}

const auth = getAuth()

// ── Konverters ────────────────────────────────────────────────────────────────

function fbUserToUser(fbUser: FBUser): User {
  return {
    id: fbUser.uid,
    name: fbUser.displayName || fbUser.email?.split("@")[0] || "Drop Shipper",
    email: fbUser.email || "",
    avatar: fbUser.photoURL || `https://i.pravatar.cc/80?u=${fbUser.uid}`,
    plan: "free",
    createdAt: new Date(fbUser.metadata.creationTime || Date.now()).toISOString().split("T")[0],
    isOnboarded: false,
  }
}

// ── Public API ─────────────────────────────────────────────────────────────────

/**
 * Sign in with email + password.
 * Throws on invalid credentials. Always throws on any auth error.
 */
export async function signIn(email: string, password: string): Promise<User> {
  const cred = await signInWithEmailAndPassword(auth, email, password)
  return fbUserToUser(cred.user)
}

/**
 * Register a new account with email + password.
 * Returns the newly created user.
 */
export async function signUp(
  email: string,
  password: string,
  displayName?: string,
): Promise<User> {
  const cred = await createUserWithEmailAndPassword(auth, email, password)
  if (displayName) {
    await fbUpdateProfile(cred.user, { displayName })
  }
  return fbUserToUser(cred.user)
}

/**
 * Sign out the currently authenticated user.
 */
export async function signOut(): Promise<void> {
  await fbSignOut(auth)
}

/**
 * Send a password-reset email to `email`.
 */
export async function resetPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email)
}

/**
 * Send an email-verification link to the currently signed-in user.
 */
export async function sendVerification(): Promise<void> {
  if (auth.currentUser) {
    await sendEmailVerification(auth.currentUser)
  }
}

/**
 * Subscribe to real-time auth state changes.
 * Returns the unsubscribe callback.
 * Fires synchronously on subscription with the current state (null if logged out).
 */
export function onAuthChange(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, (fbUser) => {
    callback(fbUser ? fbUserToUser(fbUser) : null)
  })
}

/**
 * Update the signed-in user's display name and/or avatar.
 */
export async function updateAuthProfile(data: {
  displayName?: string
  photoURL?: string
}): Promise<User> {
  if (!auth.currentUser) throw new Error("No authenticated user")
  await fbUpdateProfile(auth.currentUser, data)
  return fbUserToUser(auth.currentUser)
}

/**
 * Sign in with Google via a popup.
 * Returns the converted app User so callers never deal with FB types.
 */
export async function googleSignIn(): Promise<User> {
  const provider = new GoogleAuthProvider()
  provider.setCustomParameters({ prompt: "select_account" })
  const cred = await signInWithPopup(auth, provider)
  return fbUserToUser(cred.user)
}

/**
 * Get the raw Firebase Auth instance for advanced use-cases (token refresh, etc.).
 */
export function getAuthInstance() {
  return auth
}

/**
 * Expose Firestore client (initialised above) so Firestore services can use it
 * when Firebase envs are present — no need to keep a separate wrapper.
 */
export function isFirestoreConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
      !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID.startsWith("your_"),
  )
}

export function getFirestoreClient() {
  return db
}
