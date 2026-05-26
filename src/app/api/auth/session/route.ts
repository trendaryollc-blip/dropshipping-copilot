import { NextRequest, NextResponse } from "next/server";
import { getFirebaseAuth } from "@/lib/firebase";
import { upsertUser } from "@/lib/database/operations";
import { SESSION_COOKIE, SESSION_MAX_AGE_MS } from "@/lib/auth/constants";
import { createSessionCookie, sessionCookieOptions } from "@/lib/auth/session";
import { isFirebaseAuthEnabled } from "@/lib/auth/config";

export async function POST(request: NextRequest) {
  if (!isFirebaseAuthEnabled()) {
    return NextResponse.json(
      { error: "Firebase Auth is not configured on the client" },
      { status: 503 },
    );
  }

  const auth = getFirebaseAuth();
  if (!auth) {
    return NextResponse.json(
      { error: "Firebase Admin is not configured" },
      { status: 503 },
    );
  }

  try {
    const { idToken } = await request.json();
    if (!idToken || typeof idToken !== "string") {
      return NextResponse.json({ error: "ID token is required" }, { status: 400 });
    }

    const decoded = await auth.verifyIdToken(idToken);
    const sessionCookie = await createSessionCookie(idToken);

    const provider =
      decoded.firebase?.sign_in_provider === "google.com" ? "google" : "email";

    try {
      await upsertUser(decoded.uid, {
        email: decoded.email ?? "",
        displayName: decoded.name ?? "",
        photoURL: decoded.picture ?? "",
        provider,
        isActive: true,
      });
    } catch (err) {
      console.error("Failed to sync user profile:", err);
    }

    const maxAgeSec = Math.floor(SESSION_MAX_AGE_MS / 1000);
    const response = NextResponse.json({
      success: true,
      uid: decoded.uid,
      email: decoded.email,
    });
    response.cookies.set({
      ...sessionCookieOptions(maxAgeSec),
      value: sessionCookie,
    });

    return response;
  } catch (error) {
    console.error("Session creation error:", error);
    const message =
      error instanceof Error ? error.message : "Invalid or expired token";
    const isAdmin =
      message.includes("credential") ||
      message.includes("private key") ||
      message.includes("DECODER");
    return NextResponse.json(
      {
        error: isAdmin
          ? "Server Firebase Admin misconfigured — check FIREBASE_PRIVATE_KEY in .env.local"
          : "Invalid or expired token",
      },
      { status: isAdmin ? 503 : 401 },
    );
  }
}

export async function DELETE() {
  const auth = getFirebaseAuth();
  const response = NextResponse.json({ success: true });

  try {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const session = cookieStore.get(SESSION_COOKIE)?.value;

    if (session && auth) {
      const decoded = await auth.verifySessionCookie(session);
      await auth.revokeRefreshTokens(decoded.uid);
    }
  } catch {
    // Cookie may already be invalid — still clear it below
  }

  response.cookies.set({
    ...sessionCookieOptions(0),
    value: "",
  });
  response.cookies.delete(SESSION_COOKIE);

  return response;
}
