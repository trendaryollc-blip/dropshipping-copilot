"use client";

import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, type Auth } from "firebase/auth";
import {
  getFirebaseWebConfig,
  isFirebaseWebConfigured,
} from "@/lib/firebase/client-config";

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let initError: string | null = null;

export function getAuthInitError(): string | null {
  return initError;
}

export function isClientAuthConfigured(): boolean {
  return isFirebaseWebConfigured();
}

export function getClientApp(): FirebaseApp | null {
  if (initError) return null;

  const config = getFirebaseWebConfig();
  if (!config) {
    initError = "Firebase web config is missing from environment variables.";
    return null;
  }

  if (!app) {
    try {
      app = getApps().length > 0 ? getApp() : initializeApp(config);
      initError = null;
    } catch (err) {
      initError =
        err instanceof Error ? err.message : "Failed to initialize Firebase";
      return null;
    }
  }
  return app;
}

export function getClientAuth(): Auth | null {
  const firebaseApp = getClientApp();
  if (!firebaseApp) return null;

  if (!auth) {
    auth = getAuth(firebaseApp);
  }
  return auth;
}

export const googleProvider = new GoogleAuthProvider();
