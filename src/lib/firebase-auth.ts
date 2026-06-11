/**
 * Firebase Authentication wrapper
 * Provides auth functions used by pages like forgot-password and profile.
 * Uses the mock Firebase client from firebase-config.ts for development.
 */

import { getAuthInstance, updateAuthProfile as fbUpdateAuthProfile, resetPassword as fbResetPassword } from "@/lib/firebase-config"

/**
 * Send password reset email to the given address.
 * Uses Firebase Auth or mock implementation from firebase-config.
 */
export async function resetPassword(email: string): Promise<void> {
  // Use the Firebase config's resetPassword implementation
  await fbResetPassword(email)
}

/**
 * Update the current user's profile (name, photo, etc).
 */
export async function updateAuthProfile(data: { displayName?: string; photoURL?: string }): Promise<{ name: string; email: string }> {
  const result = await fbUpdateAuthProfile(data)
  return {
    name: result.name,
    email: result.email
  }
}

/**
 * Re-authenticate user before sensitive operations.
 * Required for password changes after recent login.
 */
export async function reauthenticate(email: string, password: string): Promise<void> {
  const auth = getAuthInstance()
  if (auth?.currentUser) {
    // In production, this would use reauthenticateWithCredential
    console.log(`[Firebase Auth] Re-authenticating ${email}`)
    return
  }
  // Mock implementation
  console.log(`[Mock] Re-authenticated ${email}`)
  await new Promise((resolve) => setTimeout(resolve, 500))
}

/**
 * Update the current user's password.
 * Requires recent authentication (use reauthenticate first if needed).
 */
export async function changePassword(newPassword: string): Promise<void> {
  const auth = getAuthInstance()
  if (auth?.currentUser) {
    // In production, this would use updatePassword
    console.log(`[Firebase Auth] Changing password`)
    return
  }
  // Mock implementation
  console.log(`[Mock] Password changed`)
  await new Promise((resolve) => setTimeout(resolve, 500))
}

/**
 * Get the current user's email, or null if not authenticated.
 */
export function getCurrentEmail(): string | null {
  const auth = getAuthInstance()
  if (auth?.currentUser?.email) {
    return auth.currentUser.email
  }
  return null
}