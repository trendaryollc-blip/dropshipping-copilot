/**
 * Validates that required environment variables are present and correctly formatted
 * when running in production. Call this early in the app lifecycle.
 */
export function validateEnv(): void {
  const errors: string[] = [];

  const projectId = process.env.FIREBASE_PROJECT_ID?.trim();
  const clientApiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.trim();
  const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN?.trim();
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.trim();
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL?.trim();

  if (!projectId) {
    errors.push("FIREBASE_PROJECT_ID is not set");
  }
  if (!clientApiKey) {
    errors.push("NEXT_PUBLIC_FIREBASE_API_KEY is not set");
  }
  if (!authDomain) {
    errors.push("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN is not set");
  }

  if (privateKey && !privateKey.includes("-----BEGIN PRIVATE KEY-----")) {
    errors.push("FIREBASE_PRIVATE_KEY is malformed — must be a valid JSON service account key");
  }

  if (clientEmail && !clientEmail.includes("@")) {
    errors.push("FIREBASE_CLIENT_EMAIL is malformed");
  }

  if (errors.length > 0) {
    const msg = `[Env Validation] ${errors.join("; ")}. App will run in demo mode.`;
    console.warn(msg);
  } else if (projectId && clientApiKey) {
    console.log("[Env] Firebase credentials validated.");
  }
}

export function getRequiredEnv(key: string): string {
  const val = process.env[key]?.trim();
  if (!val) {
    throw new Error(`Required environment variable ${key} is not set`);
  }
  return val;
}