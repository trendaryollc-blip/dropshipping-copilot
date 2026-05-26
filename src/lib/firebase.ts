import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

// Initialize Firebase Admin SDK
let app: ReturnType<typeof initializeApp> | null = null;
let db: ReturnType<typeof getFirestore> | null = null;
let auth: ReturnType<typeof getAuth> | null = null;

export function getFirebaseApp() {
  if (app) return app;

  // Check if we have the required environment variables
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    console.warn("Firebase credentials not configured. Using mock mode.");
    return null;
  }

  try {
    app = initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
    return app;
  } catch (error) {
    console.error("Failed to initialize Firebase:", error);
    return null;
  }
}

export function getDb() {
  if (db) return db;

  const firebaseApp = getFirebaseApp();
  if (!firebaseApp) return null;

  try {
    db = getFirestore(firebaseApp);
    return db;
  } catch (error) {
    console.error("Failed to initialize Firestore:", error);
    return null;
  }
}

export function getFirebaseAuth() {
  if (auth) return auth;

  const firebaseApp = getFirebaseApp();
  if (!firebaseApp) return null;

  try {
    auth = getAuth(firebaseApp);
    return auth;
  } catch (error) {
    console.error("Failed to initialize Firebase Auth:", error);
    return null;
  }
}
