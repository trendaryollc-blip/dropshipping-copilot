export function getCurrentHostname(): string {
  if (typeof window === "undefined") return "localhost";
  return window.location.hostname;
}

export function firebaseConsoleAuthSettingsUrl(): string {
  const projectId =
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim() ||
    "new-automation-app-7dd33";
  return `https://console.firebase.google.com/project/${projectId}/authentication/settings`;
}

export function unauthorizedDomainHelp(hostname = getCurrentHostname()): string {
  const settingsUrl = firebaseConsoleAuthSettingsUrl();

  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return `Google sign-in is blocked for "${hostname}".

1. Open Firebase Console → Authentication → Settings → Authorized domains:
   ${settingsUrl}
2. Ensure "${hostname}" is in the list (add it if missing).
3. Under Sign-in method, enable "Google".
4. Wait about a minute, then try again.

Use http://localhost:3000 (not a network IP) when developing locally.`;
  }

  return `Google sign-in is blocked for "${hostname}".

1. Open Firebase Console → Authentication → Settings → Authorized domains:
   ${settingsUrl}
2. Click "Add domain" and add exactly: ${hostname}
3. Under Sign-in method, enable "Google".
4. Wait about a minute, then try again.

For local development, prefer http://localhost:3000 instead of http://${hostname}:3000`;
}

export function firebaseAuthErrorMessage(err: unknown): string {
  const code =
    err && typeof err === "object" && "code" in err
      ? String((err as { code: string }).code)
      : "";

  if (code === "auth/unauthorized-domain") {
    return unauthorizedDomainHelp();
  }
  if (code === "auth/invalid-credential" || code === "auth/wrong-password") {
    return "Invalid email or password.";
  }
  if (code === "auth/email-already-in-use") {
    return "An account with this email already exists.";
  }
  if (code === "auth/weak-password") {
    return "Password must be at least 6 characters.";
  }
  if (code === "auth/operation-not-allowed") {
    return 'Google or email sign-in is disabled in Firebase. Open Authentication → Sign-in method and enable "Google" and/or "Email/Password".';
  }
  if (code === "auth/popup-closed-by-user") {
    return "Google sign-in was cancelled.";
  }
  if (code === "auth/popup-blocked") {
    return "Popup was blocked by your browser. Allow popups for this site or try again.";
  }
  if (code === "auth/network-request-failed") {
    return "Network error — check your internet connection.";
  }

  const raw = err instanceof Error ? err.message : "Authentication failed";
  if (raw.includes("auth/unauthorized-domain")) {
    return unauthorizedDomainHelp();
  }

  return raw;
}
