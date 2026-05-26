import { NextRequest, NextResponse } from "next/server";
import { getUser, upsertUser } from "@/lib/database/operations";
import { isFirebaseAuthEnabled } from "@/lib/auth/config";
import { verifySession } from "@/lib/auth/session";
import { getFirebaseAuth } from "@/lib/firebase";
import { DEFAULT_USER_ID } from "@/lib/constants";

export async function GET() {
  if (!isFirebaseAuthEnabled()) {
    return NextResponse.json({
      authenticated: false,
      demoMode: true,
      user: { id: DEFAULT_USER_ID, email: "demo@local", displayName: "Demo User" },
    });
  }

  const session = await verifySession();
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const profile = await getUser(session.uid).catch(() => null);

  return NextResponse.json({
    authenticated: true,
    user: {
      id: session.uid,
      email: profile?.email ?? session.email ?? "",
      displayName: profile?.displayName ?? session.name ?? "",
      photoURL: profile?.photoURL ?? "",
    },
  });
}

export async function PATCH(request: NextRequest) {
  if (!isFirebaseAuthEnabled()) {
    return NextResponse.json({ error: "Not available in demo mode" }, { status: 403 });
  }

  const session = await verifySession();
  if (!session) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  let body: Record<string, unknown> = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const allowed: Parameters<typeof upsertUser>[1] = {};
  const displayName = body.displayName;
  const photoURL = body.photoURL;

  if (typeof displayName === "string") {
    allowed.displayName = displayName.slice(0, 100).trim();
  }
  if (typeof photoURL === "string") {
    try {
      new URL(photoURL);
      allowed.photoURL = photoURL;
    } catch {
      return NextResponse.json({ error: "Invalid photoURL format" }, { status: 400 });
    }
  }

  if (Object.keys(allowed).length === 0) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
  }

  try {
    await upsertUser(session.uid, allowed);
    const updated = await getUser(session.uid);
    return NextResponse.json({
      success: true,
      user: {
        id: session.uid,
        email: updated?.email ?? session.email ?? "",
        displayName: updated?.displayName ?? session.name ?? "",
        photoURL: updated?.photoURL ?? "",
      },
    });
  } catch (err) {
    console.error("Profile update failed:", err);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}

export async function DELETE() {
  if (!isFirebaseAuthEnabled()) {
    return NextResponse.json({ error: "Not available in demo mode" }, { status: 403 });
  }

  const session = await verifySession();
  if (!session) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const { uid } = session;

  try {
    const firebaseAuth = getFirebaseAuth();
    if (firebaseAuth) {
      await firebaseAuth.deleteUser(uid);
    }
  } catch (err) {
    console.error("Firebase Auth deletion failed:", err);
    return NextResponse.json({ error: "Failed to delete auth account" }, { status: 500 });
  }

  try {
    const { getDb } = await import("@/lib/firebase");
    const db = getDb();
    if (db) {
      const collections = ["products", "suppliers", "orders", "settings", "automations"];
      await Promise.all(
        collections.map((col) =>
          db.collection(col).doc(uid).delete().catch(() => null),
        ),
      );
    }
  } catch (err) {
    console.error("Firestore data deletion failed:", err);
  }

  return NextResponse.json({ success: true });
}
