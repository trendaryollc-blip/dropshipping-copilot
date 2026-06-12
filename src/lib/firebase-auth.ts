// Firebase Authentication wrapper for automation-copilot-62b12
// Provides clean async helper functions built on the Firebase Auth client SDK.
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
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  getIdToken,
  type Auth,
  type User as FBUser,
} from "firebase/auth"
import { initializeApp, getApps, type FirebaseApp } from "firebase/app"
import { getFirestore, type Firestore } from "firebase/firestore"
import type { User } from "@/types"

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyCuxoy9erTCoB_QYARF724PC513tDWL8jQ",
  authDomain: "automation-copilot-62b12.firebaseapp.com",
  projectId: "automation-copilot-62b12",
  storageBucket: "automation-copilot-62b12.firebasestorage.app",
  messagingSenderId: "140344348376",
  appId: "1:140344348376:web:8ff56d66a593eaf6ec11ad",
  measurementId: "G-HCCW1FQET4",
} as const

function getFirebaseConfig() {
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

let fbApp: FirebaseApp | null = null
let db: Firestore | null = null
let auth: Auth | null = null

export function isFirebaseAuthConfigured(): boolean {
  const { apiKey, projectId } = getFirebaseConfig()
  const validApiKey =
    typeof apiKey === "string" &&
    apiKey.length > 10 &&
    !apiKey.startsWith("your_")
  const validProjectId =
    typeof projectId === "string" &&
    projectId.length > 0 &&
    !projectId.startsWith("your_")
  return Boolean(validApiKey && validProjectId)
}

function requireAuth(): Auth {
  if (!isFirebaseAuthConfigured()) {
    throw new Error(
      "Firebase Auth is not configured. Set NEXT_PUBLIC_FIREBASE_* in .env.local or Vercel.",
    )
  }
  if (!auth) {
    const cfg = getFirebaseConfig()
    if (!getApps().length) {
      fbApp = initializeApp(cfg)
      db = getFirestore(fbApp)
    } else {
      fbApp = getApps()[0]!
      db = getFirestore(fbApp)
    }
    auth = getAuth(fbApp)
  }
  return auth
}

// ── Converters ────────────────────────────────────────────────────────────────

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
 */
export async function signIn(email: string, password: string): Promise<User> {
  const cred = await signInWithEmailAndPassword(requireAuth(), email, password)
  return fbUserToUser(cred.user)
}

/**
 * Register a new account with email + password.
 */
export async function signUp(
  email: string,
  password: string,
  displayName?: string,
): Promise<User> {
  const cred = await createUserWithEmailAndPassword(requireAuth(), email, password)
  if (displayName) {
    await fbUpdateProfile(cred.user, { displayName })
  }
  return fbUserToUser(cred.user)
}

/**
 * Sign out the currently authenticated user.
 */
export async function signOut(): Promise<void> {
  await fbSignOut(requireAuth())
}

const SESSION_COOKIE_NAME = "__session"
const SESSION_COOKIE_MAX_AGE_SECONDS = 60 * 60

export function setSessionCookie(token: string): void {
  if (typeof document === "undefined") return

  const secure = typeof window !== "undefined" && window.location.protocol === "https:"

  document.cookie = [
    `${SESSION_COOKIE_NAME}=${encodeURIComponent(token)}`,
    `path=/`,
    `max-age=${SESSION_COOKIE_MAX_AGE_SECONDS}`,
    "SameSite=Lax",
    ...(secure ? ["Secure"] : []),
  ].join("; ")
}

export function clearSessionCookie(): void {
  if (typeof document === "undefined") return

  document.cookie = [
    `${SESSION_COOKIE_NAME}=`,
    `path=/`,
    "max-age=0",
    "SameSite=Lax",
  ].join("; ")
}

export async function refreshSessionCookie(): Promise<string | null> {
  const instance = requireAuth()
  if (!instance.currentUser) return null

  const token = await getIdToken(instance.currentUser)
  if (!token) return null

  setSessionCookie(token)
  return token
}

/**
 * Send a password-reset email to `email`.
 */
export async function resetPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(requireAuth(), email)
}

/**
 * Send an email-verification link to the currently signed-in user.
 */
export async function sendVerification(): Promise<void> {
  const instance = requireAuth()
  if (instance.currentUser) {
    await sendEmailVerification(instance.currentUser)
  }
}

/**
 * Subscribe to real-time auth state changes.
 */
export function onAuthChange(callback: (user: User | null) => void): () => void {
  if (!isFirebaseAuthConfigured()) {
    callback(null)
    return () => {}
  }
  return onAuthStateChanged(requireAuth(), (fbUser) => {
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
  const instance = requireAuth()
  if (!instance.currentUser) throw new Error("No authenticated user")
  await fbUpdateProfile(instance.currentUser, data)
  return fbUserToUser(instance.currentUser)
}

/**
 * Track an in-flight Google redirect.
 */
let googleRedirectInFlight = false

/**
 * Sign in with Google.
 */
export async function googleSignIn(mode: "popup" | "redirect" = "redirect"): Promise<void> {
  const provider = new GoogleAuthProvider()
  const instance = requireAuth()

  if (mode === "redirect") {
    googleRedirectInFlight = true
    await signInWithRedirect(instance, provider)
    googleRedirectInFlight = false
    return
  }

  try {
    await signInWithPopup(instance, provider)
  } finally {
    googleRedirectInFlight = false
  }
}

export function isGoogleRedirectInFlight(): boolean {
  return googleRedirectInFlight
}

export function clearGoogleRedirectFlag() {
  googleRedirectInFlight = false
}

/**
 * Consume any pending OAuth result from a signInWithRedirect round-trip.
 */
export async function handleGoogleRedirect(): Promise<boolean> {
  if (!isFirebaseAuthConfigured()) return false
  try {
    const result = await getRedirectResult(requireAuth())
    if (result) {
      googleRedirectInFlight = false
      return true
    }
  } catch {
    // No redirect pending
  }
  return false
}

/**
 * Get the raw Firebase Auth instance for advanced use-cases.
 */
export function getAuthInstance(): Auth {
  return requireAuth()
}

/**
 * Expose Firestore client so Firestore services can use it.
 */
export function isFirestoreConfigured(): boolean {
  return isFirebaseAuthConfigured()
}

export function getFirestoreClient() {
  if (!isFirebaseAuthConfigured()) return null
  requireAuth()
  return db
}