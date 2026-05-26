/**
 * Firebase web config — client-safe only (NEXT_PUBLIC_*).
 * Keep separate from server auth config to avoid bundling issues.
 */

export function getFirebaseWebConfig() {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim();
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.trim();

  if (!projectId || !apiKey) {
    return null;
  }

  return {
    apiKey,
    authDomain:
      process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN?.trim() ||
      `${projectId}.firebaseapp.com`,
    projectId,
    storageBucket:
      process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET?.trim() ||
      `${projectId}.appspot.com`,
    messagingSenderId:
      process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID?.trim() || "",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID?.trim() || "",
  };
}

export function isFirebaseWebConfigured(): boolean {
  return getFirebaseWebConfig() !== null;
}
