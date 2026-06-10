"use client"
import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { User } from "@/types"
import {
  signIn,
  signUp,
  signOut,
  onAuthChange,
  updateAuthProfile,
  getAuthInstance,
  isFirebaseAuthConfigured,
} from "@/lib/firebase-auth"
import { setDocument } from "@/lib/firestore-service"

/**
 * Convert any error thrown by Firebase (or our own `requireAuth` guard) into
 * a human-readable, UI-friendly string.  This replaces the previous behaviour
 * which silently returned `false` and showed the generic "Invalid email or
 * password" message for *every* failure — even when Firebase was simply not
 * configured, when the network was down, or when the user's account was
 * disabled.
 */
function describeAuthError(err: unknown): string {
  const e = err as { code?: string; message?: string }
  const code = e?.code || ""
  const message = typeof e?.message === "string" ? e.message : ""
  // Common Firebase Auth error codes -> friendly message
  const map: Record<string, string> = {
    "auth/invalid-email": "That email address isn't valid.",
    "auth/user-disabled": "This account has been disabled.",
    "auth/user-not-found": "No account exists with that email.",
    "auth/wrong-password": "Incorrect password. Please try again.",
    "auth/invalid-credential": "Incorrect email or password.",
    "auth/invalid-login-credentials": "Incorrect email or password.",
    "auth/email-already-in-use": "An account with that email already exists.",
    "auth/weak-password": "Password is too weak. Use at least 6 characters.",
    "auth/too-many-requests": "Too many attempts. Please wait a moment and try again.",
    "auth/network-request-failed": "Network error. Check your connection and try again.",
    "auth/popup-closed-by-user": "Sign-in popup was closed before completing.",
    "auth/popup-blocked": "Sign-in popup was blocked by the browser.",
    "auth/unauthorized-domain": "This domain isn't authorised for OAuth sign-in.",
    "auth/operation-not-allowed": "This sign-in method isn't enabled. Contact the admin.",
    "auth/invalid-api-key": "Firebase isn't configured correctly. Contact the admin.",
    "auth/configuration-not-found": "Firebase project isn't configured. Contact the admin.",
  }
  if (code && map[code]) return map[code]
  // The raw Google API error string can be very long; surface a digest so
  // the user (and you) can act on it without filling the toast.
  if (
    message.includes("identitytoolkit") &&
    message.includes("are blocked")
  ) {
    return (
      "Firebase Authentication is disabled for this API key / project. " +
      "Open Google Cloud Console → APIs & Services → Library, search for " +
      "\u201cIdentity Toolkit API\u201d, and Enable it. Then re-deploy."
    )
  }
  if (message.includes("API_KEY_SERVICE_BLOCKED")) {
    return (
      "Firebase API key is blocked from calling Identity Toolkit. " +
      "Open Google Cloud Console → APIs & Services → Credentials, " +
      "edit the API key, and add \u201cIdentity Toolkit API\u201d to its allowed APIs."
    )
  }
  if (typeof message === "string" && message.length > 0) {
    // Trim Firebase's verbose raw error to something readable.
    const trimmed = message.length > 200 ? message.slice(0, 197) + "…" : message
    return trimmed
  }
  if (code) return code.replace(/^auth\//, "").replace(/-/g, " ")
  return "Sign-in failed. Please try again."
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isInitialised: boolean
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>
  register: (
    name: string,
    email: string,
    password: string,
  ) => Promise<{ ok: boolean; error?: string }>
  logout: () => Promise<void>
  updateProfile: (data: Partial<User>) => Promise<void>
  completeOnboarding: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isInitialised: false,

      login: async (email, password) => {
        try {
          const user = await signIn(email, password)
          // Best-effort: ensure a Firestore user doc exists.
          // Use merge: true WITHOUT overwriting isOnboarded — the persisted
          // localStorage value (or Firestore value) is the source of truth.
          try {
            await setDocument(
              `copilot_users/${user.id}`,
              { id: user.id, name: user.name, email, plan: "free" },
              true,
            )
          } catch (fsErr) {
            console.warn("[Auth] login: Firestore profile upsert failed:", fsErr)
          }
          // Preserve isOnboarded from the persisted store if it exists
          const prev = useAuthStore.getState().user
          const isOnboarded = prev?.id === user.id ? prev.isOnboarded : false
          set({ user: { ...user, isOnboarded }, isAuthenticated: true, isInitialised: true })
          return { ok: true }
        } catch (err) {
          const msg = describeAuthError(err)
          console.warn("[Auth] login failed:", msg, err)
          return { ok: false, error: msg }
        }
      },

      register: async (name, email, password) => {
        try {
          const user = await signUp(email, password, name)
          // New user — isOnboarded is false by default
          try {
            await setDocument(
              `copilot_users/${user.id}`,
              { id: user.id, name, email, plan: "free", isOnboarded: false },
              true,
            )
          } catch (fsErr) {
            console.warn("[Auth] register: Firestore profile upsert failed:", fsErr)
          }
          set({ user: { ...user, isOnboarded: false }, isAuthenticated: true, isInitialised: true })
          return { ok: true }
        } catch (err) {
          const msg = describeAuthError(err)
          console.warn("[Auth] register failed:", msg, err)
          return { ok: false, error: msg }
        }
      },

      logout: async () => {
        try {
          await signOut()
        } catch (err) {
          console.warn("[Auth] logout failed:", err)
        } finally {
          set({ user: null, isAuthenticated: false })
        }
      },

      updateProfile: async (data) => {
        try {
          const current = getAuthInstance().currentUser
          if (current) {
            const updated = await updateAuthProfile({
              displayName: data.name,
              photoURL: data.avatar,
            })
            set({ user: updated })
          } else {
            set((state) => ({
              user: state.user ? { ...state.user, ...data } : null,
            }))
          }
        } catch (err) {
          console.warn("[Auth] updateProfile failed:", err)
          set((state) => ({
            user: state.user ? { ...state.user, ...data } : null,
          }))
        }
      },

      completeOnboarding: () =>
        set((state) => ({
          user: state.user ? { ...state.user, isOnboarded: true } : null,
        })),
    }),
    {
      name: "dropease-auth",
      // Persist the full user object (or at least what we need) so onboarding
      // status survives page refreshes without relying on Firestore.
      partialize: (state) => ({
        user: state.user
          ? {
              id: state.user.id,
              email: state.user.email,
              name: state.user.name,
              isOnboarded: state.user.isOnboarded,
              avatar: state.user.avatar,
            }
          : null,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)

// ── Bootstrap: subscribe to Firebase Auth on first client mount ────────────────
if (typeof window !== "undefined") {
  if (!isFirebaseAuthConfigured()) {
    useAuthStore.setState({ isInitialised: true })
  } else {
    onAuthChange((user) => {
      if (user) {
        // Upsert the Firestore user doc WITHOUT overwriting isOnboarded.
        // The persisted localStorage value is the source of truth for onboarding.
        setDocument(
          `copilot_users/${user.id}`,
          { id: user.id, name: user.name, email: user.email, plan: "free" },
          true,
        ).catch(() => {})
        // Preserve isOnboarded from the existing persisted state
        const prev = useAuthStore.getState().user
        const isOnboarded = prev?.id === user.id && prev.isOnboarded
        useAuthStore.setState({
          user: { ...user, isOnboarded },
          isAuthenticated: true,
          isInitialised: true,
        })
      } else {
        useAuthStore.setState({
          user: null,
          isAuthenticated: false,
          isInitialised: true,
        })
      }
    })
  }
}
