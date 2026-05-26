"use client";

import {
  getRedirectResult,
  signInWithPopup,
  signInWithRedirect,
  type Auth,
  type User,
} from "firebase/auth";
import { googleProvider } from "@/lib/firebase-client";
import { firebaseAuthErrorMessage } from "./errors";

function configureGoogleProvider() {
  googleProvider.setCustomParameters({ prompt: "select_account" });
}

export async function signInWithGooglePopup(auth: Auth): Promise<User> {
  configureGoogleProvider();
  try {
    const cred = await signInWithPopup(auth, googleProvider);
    return cred.user;
  } catch (err) {
    const code =
      err && typeof err === "object" && "code" in err
        ? String((err as { code: string }).code)
        : "";

    // Popup blocked — redirect flow uses the same authorized domain but avoids popups
    if (code === "auth/popup-blocked") {
      await signInWithRedirect(auth, googleProvider);
      throw new Error("REDIRECTING");
    }

    throw new Error(firebaseAuthErrorMessage(err));
  }
}

export async function signInWithGoogleRedirect(auth: Auth): Promise<void> {
  configureGoogleProvider();
  await signInWithRedirect(auth, googleProvider);
}

/** Completes sign-in after returning from Google redirect. */
export async function completeGoogleRedirectIfNeeded(
  auth: Auth,
): Promise<User | null> {
  const result = await getRedirectResult(auth);
  return result?.user ?? null;
}
