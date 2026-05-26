"use client";
import { getClientAuth } from "@/lib/firebase-client";
import { sendPasswordResetEmail } from "firebase/auth";
import { firebaseAuthErrorMessage } from "./errors";

export async function requestPasswordReset(email: string): Promise<void> {
  const auth = getClientAuth();
  if (!auth) throw new Error("Firebase Auth is not configured");
  try {
    await sendPasswordResetEmail(auth, email.trim());
  } catch (err) {
    throw new Error(firebaseAuthErrorMessage(err));
  }
}
