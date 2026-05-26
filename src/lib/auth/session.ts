import { cookies } from "next/headers";
import { getFirebaseAuth } from "@/lib/firebase";
import { SESSION_COOKIE, SESSION_MAX_AGE_MS } from "./constants";
import { isFirebaseAuthEnabled } from "./config";

export async function createSessionCookie(idToken: string): Promise<string> {
  const auth = getFirebaseAuth();
  if (!auth) {
    throw new Error("Firebase Admin is not configured");
  }
  return auth.createSessionCookie(idToken, { expiresIn: SESSION_MAX_AGE_MS });
}

export function sessionCookieOptions(maxAgeSec: number) {
  return {
    name: SESSION_COOKIE,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: maxAgeSec,
  };
}

export async function verifySession(): Promise<{
  uid: string;
  email?: string;
  name?: string;
} | null> {
  if (!isFirebaseAuthEnabled()) return null;

  const auth = getFirebaseAuth();
  if (!auth) return null;

  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE)?.value;
  if (!session) return null;

  try {
    const decoded = await auth.verifySessionCookie(session, true);
    return {
      uid: decoded.uid,
      email: decoded.email,
      name: decoded.name,
    };
  } catch {
    return null;
  }
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}
