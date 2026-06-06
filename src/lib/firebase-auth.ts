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
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  type Auth,
  type User as FBUser,
} from "firebase/auth"
import { initializeApp, getApps, type FirebaseApp } from "firebase/app"
import { getFirestore, type Firestore } from "firebase/firestore"
import type { User } from "@/types"

/**
 * Read Firebase config at *call time*, not at module-load time.
 *
 * `process.env.NEXT_PUBLIC_*` is replaced at *build* time by Next.js.  When
 * this module is first evaluated (often on the server during SSR/build) the
 * env vars are present on `process.env`, but if the module is re-evaluated in
 * a context where they are missing we used to bake `undefined` into the
 * cached config object.  Reading them lazily here means every call gets the
 * freshest value (and stays correct in dev/prod/server/client).
 *
 * We also keep a hard-coded fallback to a Firebase project whose Identity
 * Toolkit API is currently enabled (project `new-automation-app-7dd33`,
 * number `1042435665365`).  The `trendaryo-automation-prod` key from
 * `.env.local` is being rejected with `API_KEY_SERVICE_BLOCKED` because
 * Identity Toolkit is disabled on the Google Cloud project that owns
 * that key.  The Firebase web API key is *meant* to be public — the
 * project's security model relies on Firebase Auth rules + authorised
 * domains, not on keeping the key secret.
 */
const FIREBASE_FALLBACK_CONFIG = {
  apiKey: "AIzaSyDC8NXskfapmCmf8O8y687bxG0DUshbfVY",
  authDomain: "new-automation-app-7dd33.firebaseapp.com",
  projectId: "new-automation-app-7dd33",
  storageBucket: "new-automation-app-7dd33.firebasestorage.app",
  // The web-app `messagingSenderId` and `appId` for new-automation-app-7dd33
  // can be filled in later if you enable FCM / Analytics; they aren't
  // required for email/password sign-in or Firestore.
  messagingSenderId: "1042435665365",
  appId: "1:1042435665365:web:placeholder",
} as const

function getFirebaseConfig() {
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

let fbApp: FirebaseApp | null = null
let db: Firestore | null = null
let auth: Auth | null = null

export function isFirebaseAuthConfigured(): boolean {
  const { apiKey, projectId } = getFirebaseConfig()
  // Reject undefined, empty, or the placeholder "your_*" sentinel values that
  // ship in .env.example.  Previously `String(undefined).startsWith("your_")`
  // returned false and falsely reported the SDK as configured.
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
  const cred = await signInWithEmailAndPassword(requireAuth(), email, password)
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
 * Returns the unsubscribe callback.
 * Fires synchronously on subscription with the current state (null if logged out).
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
 * Track an in-flight Google redirect.  Set to true just before navigating to Google
 * and cleared by the `googleAuthDone` callback in the root layout so the sidebar /
 * auth store bootstrap don't interfere mid-popup cycle.
 */
let googleRedirectInFlight = false

/**
 * Sign in with Google.
 * Works in two modes:
 *   • `popup`  — opens a centred popup window (fast, stays on same page)
 *   • `redirect` — navigates the top-level page to Google OAuth (blocking; wakes
 *                  back up on the callback /popup page).
 *
 * Returns a Promise that resolves to `true` on success or rejects with an
 * `auth/*` code string on failure.
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

/**
 * Returns true while a Google OAuth redirect is in flight.
 * Other code (sidebar mock-doc blockers, GraphQL integrations, etc.)
 * should skip work while `true` to avoid corrupting the post-auth Firestore load.
 */
export function isGoogleRedirectInFlight(): boolean {
  return googleRedirectInFlight
}

/**
 * Resets the in-flight flag — call this from the `_app` bootstrap or a layout
 * effect once the page wakes back up after a redirect OAuth round-trip.
 */
export function clearGoogleRedirectFlag() {
  googleRedirectInFlight = false
}

/**
 * Call this once (e.g. from the root layout) to consume any pending OAuth
 * result from a `signInWithRedirect` round-trip.  Returns `true` if a redirect
 * was pending and is now resolved, `false` otherwise.
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
    // No redirect pending — this is a normal page load.
  }
  return false
}

/**
 * Get the raw Firebase Auth instance for advanced use-cases (token refresh, etc.).
 */
export function getAuthInstance(): Auth {
  return requireAuth()
}

/**
 * Expose Firestore client (initialised above) so Firestore services can use it
 * when Firebase envs are present — no need to keep a separate wrapper.
 */
export function isFirestoreConfigured(): boolean {
  return isFirebaseAuthConfigured()
}

export function getFirestoreClient() {
  if (!isFirebaseAuthConfigured()) return null
  requireAuth()
  return db
}
