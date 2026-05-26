export function isFirebaseAuthEnabled(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim() &&
      process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.trim(),
  );
}

export function getFirebaseClientConfig() {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim();
  if (!projectId) return null;

  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.trim() ?? "",
    authDomain:
      process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN?.trim() ||
      `${projectId}.firebaseapp.com`,
    projectId,
    storageBucket:
      process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET?.trim() ||
      `${projectId}.appspot.com`,
    messagingSenderId:
      process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID?.trim() ?? "",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID?.trim() ?? "",
  };
}
