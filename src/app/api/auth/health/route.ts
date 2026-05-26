import { NextResponse } from "next/server";
import { getFirebaseAuth } from "@/lib/firebase";
import { getDb } from "@/lib/firebase";
import { isFirebaseWebConfigured } from "@/lib/firebase/client-config";

export async function GET() {
  const web = isFirebaseWebConfigured();
  const admin = Boolean(getFirebaseAuth());
  const firestore = Boolean(getDb());

  return NextResponse.json({
    web,
    admin,
    firestore,
    ready: web && admin,
    hint: !web
      ? "Missing NEXT_PUBLIC_FIREBASE_* — restart npm run dev after editing .env.local"
      : !admin
        ? "Missing FIREBASE_PROJECT_ID / CLIENT_EMAIL / PRIVATE_KEY in .env.local"
        : "Auth should work — enable Email/Password in Firebase Console → Authentication",
  });
}
