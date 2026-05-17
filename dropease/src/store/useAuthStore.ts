"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { nanoid } from "nanoid"
import type { User } from "@/types"

interface RegisteredUser extends User {
  password: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  registeredUsers: RegisteredUser[]
  login: (email: string, password: string) => boolean
  register: (name: string, email: string, password: string) => boolean
  logout: () => void
  updateProfile: (data: Partial<User>) => void
  completeOnboarding: () => void
}

const DEMO_USER: RegisteredUser = {
  id: "demo-1",
  name: "Drop Shipper",
  email: "beginner@dropease.com",
  password: "password123",
  plan: "free",
  createdAt: "2024-01-01",
  isOnboarded: true,
  avatar: "https://i.pravatar.cc/80?u=dropease-user",
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      registeredUsers: [DEMO_USER],

      login: (email, password) => {
        const found = get().registeredUsers.find(
          (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        )
        if (!found) return false
        const { password: _pw, ...user } = found
        set({ user, isAuthenticated: true })
        return true
      },

      register: (name, email, password) => {
        const exists = get().registeredUsers.some(
          (u) => u.email.toLowerCase() === email.toLowerCase()
        )
        if (exists) return false

        const newUser: RegisteredUser = {
          id: nanoid(),
          name,
          email,
          password,
          plan: "free",
          createdAt: new Date().toISOString().split("T")[0],
          isOnboarded: false,
          avatar: `https://i.pravatar.cc/80?u=${email}`,
        }

        const { password: _pw, ...user } = newUser
        set((state) => ({
          registeredUsers: [...state.registeredUsers, newUser],
          user,
          isAuthenticated: true,
        }))
        return true
      },

      logout: () => set({ user: null, isAuthenticated: false }),

      updateProfile: (data) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        })),

      completeOnboarding: () =>
        set((state) => ({
          user: state.user ? { ...state.user, isOnboarded: true } : null,
          registeredUsers: state.registeredUsers.map((u) =>
            u.id === state.user?.id ? { ...u, isOnboarded: true } : u
          ),
        })),
    }),
    { name: "dropease-auth" }
  )
)
