/**
 * Firebase Admin SDK for server-side operations (API routes)
 * 
 * Uses the `firebase-admin` package to securely access Firestore
 * and verify auth tokens from within server-side code (API routes, cron jobs).
 * 
 * Environment Variables (set in Vercel):
 *   FIREBASE_SERVICE_ACCOUNT_KEY — Full JSON string of the service account key
 *   (or set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY individually)
 * 
 * Fallback: If no service account is configured, attempts to use the client SDK
 * (Firestore via firebase/firestore). This is acceptable for development but NOT
 * recommended for production.
 */

import type { Firestore } from 'firebase-admin/firestore';

let adminDb: Firestore | null = null;

/**
 * Initialize and return the Firebase Admin Firestore instance.
 * Returns null if no service account credentials are available.
 */
export function getAdminFirestore(): Firestore | null {
  if (adminDb) return adminDb;

  try {
    // Check if firebase-admin can be initialized
    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

    if (!projectId) return null;

    // Dynamic import to avoid bundling firebase-admin on client-side
    const admin = require('firebase-admin');

    if (admin.apps.length === 0) {
      if (serviceAccountKey) {
        // Initialize with full service account key JSON
        const serviceAccount = JSON.parse(serviceAccountKey);
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          projectId: serviceAccount.project_id || projectId,
        });
      } else if (process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
        // Initialize with individual credential fields
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId: projectId,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
          }),
        });
      } else {
        // Try default application credentials (works on GCP/Vercel with proper setup)
        admin.initializeApp({ projectId });
      }
    }

    adminDb = admin.firestore() as Firestore;
    return adminDb;
  } catch (error) {
    console.warn('[FirebaseAdmin] Failed to initialize Firebase Admin SDK:', (error as Error).message);
    console.warn('[FirebaseAdmin] Server-side Firestore operations will fall back to client SDK.');
    return null;
  }
}

/**
 * Verify a Firebase ID token server-side.
 * Returns the decoded token (including uid) or null if invalid.
 */
export async function verifyAuthToken(idToken: string): Promise<{ uid: string; email?: string; name?: string } | null> {
  try {
    const admin = require('firebase-admin');
    if (admin.apps.length === 0) {
      // Initialize if not already done
      getAdminFirestore();
    }
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    return {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name,
    };
  } catch (error) {
    console.warn('[FirebaseAdmin] Token verification failed:', (error as Error).message);
    return null;
  }
}

/**
 * Check if Firebase Admin SDK is available (service account configured).
 */
export function isAdminAvailable(): boolean {
  return !!(process.env.FIREBASE_SERVICE_ACCOUNT_KEY ||
    (process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY));
}