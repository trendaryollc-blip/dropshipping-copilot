import { NextRequest, NextResponse } from "next/server";
import { getFirebaseAuth } from "@/lib/firebase";
import { upsertUser } from "@/lib/database/operations";
import { createSessionCookie, sessionCookieOptions } from "@/lib/auth/session";
import { SESSION_MAX_AGE_MS } from "@/lib/auth/constants";

/** Legacy endpoint — prefer POST /api/auth/session after client Google sign-in. */
export async function POST(request: NextRequest) {
  const auth = getFirebaseAuth();
  if (!auth) {
    return NextResponse.json(
      { error: "Authentication not configured" },
      { status: 500 },
    );
  }

  try {
    const { idToken } = await request.json();

    if (!idToken) {
      return NextResponse.json({ error: "ID token is required" }, { status: 400 });
    }

    const decoded = await auth.verifyIdToken(idToken);
    const provider =
      decoded.firebase?.sign_in_provider === "google.com" ? "google" : "email";

    await upsertUser(decoded.uid, {
      email: decoded.email ?? "",
      displayName: decoded.name ?? "",
      photoURL: decoded.picture ?? "",
      provider,
      isActive: true,
    });

    const sessionCookie = await createSessionCookie(idToken);
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
  } catch (error: unknown) {
    console.error("Google auth error:", error);
    return NextResponse.json(
      { error: "Google authentication failed" },
      { status: 500 },
    );
  }
}
