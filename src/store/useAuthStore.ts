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
} from "@/lib/firebase-auth"
import { setDocument } from "@/lib/firestore-service"

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isInitialised: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  updateProfile: (data: Partial<User>) => Promise<void>
  completeOnboarding: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, _get) => ({
      user: null,
      isAuthenticated: false,
      isInitialised: false,

      login: async (email, password) => {
        try {
          const user = await signIn(email, password)
          await setDocument(
            `dropease_users/${user.id}`,
            { id: user.id, name: user.name, email, plan: "free", isOnboarded: false },
            true,
          )
          set({ user, isAuthenticated: true, isInitialised: true })
          return true
        } catch (err: any) {
          console.warn("[Auth] login failed:", err.message)
          return false
        }
      },

      register: async (name, email, password) => {
        try {
          const user = await signUp(email, password, name)
          await setDocument(
            `dropease_users/${user.id}`,
            { id: user.id, name, email, plan: "free", isOnboarded: false },
            true,
          )
          set({ user, isAuthenticated: true, isInitialised: true })
          return true
        } catch (err: any) {
          console.warn("[Auth] register failed:", err.message)
          return false
        }
      },

      logout: async () => {
        try {
          await signOut()
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
      partialize: (state) => ({
        isOnboarded: state.user?.isOnboarded || false,
      }),
    },
  ),
)

// ── Bootstrap: subscribe to Firebase Auth on first client mount ────────────────
if (typeof window !== "undefined") {
  onAuthChange((user) => {
    // Also upsert the Firestore user doc so it exists on every silent re-auth
    if (user) {
      setDocument(
        `dropease_users/${user.id}`,
        { id: user.id, name: user.name, email: user.email, plan: "free", isOnboarded: false },
        true,
      ).catch(() => {})
    }
    useAuthStore.setState({
      user,
      isAuthenticated: !!user,
      isInitialised: true,
    })
  })
}
