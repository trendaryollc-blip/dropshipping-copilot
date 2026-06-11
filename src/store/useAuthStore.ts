"use client"
import { create } from "zustand"
import { persist } from "zustand/middleware"
import { toast } from "sonner"

interface AuthState {
  user: any | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  isInitialised: boolean

  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  checkAuth: () => Promise<void>
  completeOnboarding: (userId: string) => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      isInitialised: false,

      login: async (email, password) => {
        set({ isLoading: true, error: null })

        // Mock authentication logic
        try {
          // Check if user exists in mock data
          const users = JSON.parse(localStorage.getItem('dropease-app') || '{}').users || [];

          const user = users.find((u: any) => u.email === email);

          if (!user) {
            toast.error("User not found");
            return;
          }

          // Verify password (mock)
          if (user.password !== password) {
            toast.error("Incorrect password");
            return;
          }

          // Successful login
          set({
            user,
            isAuthenticated: true,
            isLoading: false
          });

          toast.success("Login successful!");
        } catch (err) {
          set({ error: err instanceof Error ? err.message : "Login failed" });
          toast.error("Login failed");
        }
      },

      register: async (name, email, password) => {
        set({ isLoading: true, error: null })

        try {
          // Check if user already exists
          const users = JSON.parse(localStorage.getItem('dropease-app') || '{}').users || [];

          if (users.some((u: any) => u.email === email)) {
            toast.error("Email already in use");
            return;
          }

          // Create new user
          const newUser = {
            id: `user-${Date.now()}`,
            name,
            email,
            avatar: `https://i.pravatar.cc/80?u=${email}`,
            plan: "free",
            createdAt: new Date().toISOString(),
            isOnboarded: false,
            password // Store password in mock data (not secure, just for demo)
          };

          // Add to mock data
          const updatedUsers = [...users, newUser];

          // Update local storage
          const state = JSON.parse(localStorage.getItem('dropease-app') || '{}');
          state.users = updatedUsers;
          localStorage.setItem('dropease-app', JSON.stringify(state));

          // Set user in store
          set({
            user: newUser,
            isAuthenticated: true,
            isLoading: false
          });

          toast.success("Account created successfully!");
        } catch (err) {
          set({ error: err instanceof Error ? err.message : "Registration failed" });
          toast.error("Registration failed");
        }
      },

      completeOnboarding: async (userId) => {
        set({ isLoading: true, error: null })

        try {
          // Update user in mock data
          const users = JSON.parse(localStorage.getItem('dropease-app') || '{}').users || [];
          const updatedUsers = users.map((user: any) =>
            user.id === userId ? { ...user, isOnboarded: true } : user
          );

          // Update local storage
          const state = JSON.parse(localStorage.getItem('dropease-app') || '{}');
          state.users = updatedUsers;
          localStorage.setItem('dropease-app', JSON.stringify(state));

          // Update user in store
          set({
            user: { ...state.user, isOnboarded: true },
            isInitialised: true
          });

          toast.success("Onboarding completed!");
        } catch (err) {
          set({ error: err instanceof Error ? err.message : "Failed to complete onboarding" });
          toast.error("Failed to complete onboarding");
        } finally {
          set({ isLoading: false });
        }
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
          isInitialised: false
        });
        toast.info("You have been logged out");
      },

      checkAuth: async () => {
        set({ isLoading: true, error: null });

        try {
          // Check if user exists in local storage
          const state = JSON.parse(localStorage.getItem('dropease-app') || '{}');
          const user = state.users && state.users.length > 0 ? state.users[0] : null;

          if (user) {
            set({
              user,
              isAuthenticated: true,
              isInitialised: user.isOnboarded,
              isLoading: false
            });
          } else {
            set({
              isAuthenticated: false,
              isLoading: false
            });
          }
        } catch (err) {
          set({ error: err instanceof Error ? err.message : "Failed to check authentication" });
        }
      }
    }),
    {
      name: "dropease-auth",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        isLoading: state.isLoading,
        error: state.error,
        isInitialised: state.isInitialised
      })
    }
  )
)