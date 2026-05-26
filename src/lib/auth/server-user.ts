import { DEFAULT_USER_ID } from "@/lib/constants";
import { isFirebaseAuthEnabled } from "./config";
import { verifySession } from "./session";

/**
 * Resolves the current user ID for API routes.
 * - Auth disabled (no public Firebase config): default demo user
 * - Auth enabled: Firebase session UID or null if unsigned in
 */
export async function getAuthenticatedUserId(): Promise<string | null> {
  if (!isFirebaseAuthEnabled()) {
    return DEFAULT_USER_ID;
  }

  const session = await verifySession();
  return session?.uid ?? null;
}

export async function requireAuthenticatedUserId(): Promise<
  { userId: string } | { error: string; status: 401 }
> {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return { error: "Sign in required", status: 401 };
  }
  return { userId };
}
