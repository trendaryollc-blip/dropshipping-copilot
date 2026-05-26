"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { firebaseAuthErrorMessage } from "@/lib/auth/errors";
import {
  completeGoogleRedirectIfNeeded,
  signInWithGooglePopup,
  signInWithGoogleRedirect,
} from "@/lib/auth/google-sign-in";
import {
  getClientAuth,
  getAuthInitError,
  isClientAuthConfigured,
} from "@/lib/firebase-client";

interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  photoURL: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  authConfigured: boolean;
  authReady: boolean;
  initError: string | null;
  sessionError: string | null;
  demoMode: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (
    email: string,
    password: string,
    displayName?: string,
  ) => Promise<void>;
  signInWithGoogle: (useRedirect?: boolean) => Promise<void>;
  signOut: () => Promise<void>;
  clearSessionError: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function establishServerSession(firebaseUser: User): Promise<void> {
  const idToken = await firebaseUser.getIdToken(true);
  const res = await fetch("/api/auth/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    body: JSON.stringify({ idToken }),
  });

  const data = (await res.json().catch(() => ({}))) as { error?: string };

  if (!res.ok) {
    throw new Error(data.error ?? `Session failed (${res.status})`);
  }
}

function mapUser(user: User): AuthUser {
  return {
    id: user.uid,
    email: user.email ?? "",
    displayName: user.displayName ?? "",
    photoURL: user.photoURL ?? "",
  };
}

function debounce<T extends (...args: Parameters<T>) => void>(fn: T, delay: number) {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => { fn(...args); }, delay);
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(() => isClientAuthConfigured());
  const [authReady] = useState(true);
  const [authConfigured] = useState(() => isClientAuthConfigured());
  const [sessionError, setSessionError] = useState<string | null>(null);
  const signingOutRef = useRef(false);

  const initError = getAuthInitError();

  useEffect(() => {
    if (!authConfigured) {
      return;
    }

    const auth = getClientAuth();
    if (!auth) {
      return;
    }

    // Finish Google redirect sign-in when returning from Google
    completeGoogleRedirectIfNeeded(auth)
      .then(async (redirectUser) => {
        if (!redirectUser || signingOutRef.current) return;
        try {
          await establishServerSession(redirectUser);
          setSessionError(null);
          setUser(mapUser(redirectUser));
        } catch (err) {
          console.error("Google redirect session failed:", err);
          setSessionError(
            err instanceof Error ? err.message : "Could not complete Google sign-in",
          );
        }
      })
      .catch((err) => console.error("Google redirect result:", err));

    const debouncedRestoreSession = debounce(async (firebaseUser: User | null) => {
      if (!firebaseUser) return;
      try {
        await establishServerSession(firebaseUser);
        setSessionError(null);
        setUser(mapUser(firebaseUser));
      } catch (err) {
        console.error("Session restore failed:", err);
        setSessionError(
          err instanceof Error ? err.message : "Could not restore session",
        );
        setUser(mapUser(firebaseUser));
      } finally {
        setLoading(false);
      }
    }, 500);

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (signingOutRef.current) {
        if (!firebaseUser) {
          setUser(null);
          setLoading(false);
        }
        return;
      }

      if (!firebaseUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      debouncedRestoreSession(firebaseUser);
    });

    return () => unsubscribe();
  }, [authConfigured]);

  const runAuthAction = useCallback(
    async (action: () => Promise<User>) => {
      setSessionError(null);
      const auth = getClientAuth();
      if (!auth) {
        throw new Error(initError ?? "Firebase Auth is not configured");
      }

      const firebaseUser = await action();
      await establishServerSession(firebaseUser);
      setUser(mapUser(firebaseUser));
    },
    [initError],
  );

  const signInWithEmail = useCallback(
    async (email: string, password: string) => {
      try {
        await runAuthAction(async () => {
          const cred = await signInWithEmailAndPassword(
            getClientAuth()!,
            email.trim(),
            password,
          );
          return cred.user;
        });
      } catch (err) {
        throw new Error(firebaseAuthErrorMessage(err));
      }
    },
    [runAuthAction],
  );

  const signUpWithEmail = useCallback(
    async (email: string, password: string, displayName?: string) => {
      try {
        await runAuthAction(async () => {
          const auth = getClientAuth()!;
          const cred = await createUserWithEmailAndPassword(
            auth,
            email.trim(),
            password,
          );
          if (displayName?.trim()) {
            await updateProfile(cred.user, { displayName: displayName.trim() });
          }
          return cred.user;
        });
      } catch (err) {
        throw new Error(firebaseAuthErrorMessage(err));
      }
    },
    [runAuthAction],
  );

  const signInWithGoogle = useCallback(
    async (useRedirect = false) => {
      const auth = getClientAuth();
      if (!auth) {
        throw new Error(initError ?? "Firebase Auth is not configured");
      }

      try {
        if (useRedirect) {
          await signInWithGoogleRedirect(auth);
          return;
        }

        await runAuthAction(() => signInWithGooglePopup(auth));
      } catch (err) {
        if (err instanceof Error && err.message === "REDIRECTING") {
          return;
        }
        throw new Error(firebaseAuthErrorMessage(err));
      }
    },
    [runAuthAction, initError],
  );

  const signOut = useCallback(async () => {
    signingOutRef.current = true;
    setSessionError(null);

    try {
      const auth = getClientAuth();
      if (auth) {
        await firebaseSignOut(auth);
      }

      await fetch("/api/auth/session", {
        method: "DELETE",
        credentials: "same-origin",
      });

      setUser(null);
    } finally {
      signingOutRef.current = false;
    }
  }, []);

  const clearSessionError = useCallback(() => setSessionError(null), []);

  const value = useMemo(
    () => ({
      user,
      loading: loading || !authReady,
      authConfigured,
      authReady,
      initError,
      sessionError,
      demoMode: authReady && !authConfigured,
      signInWithEmail,
      signUpWithEmail,
      signInWithGoogle,
      signOut,
      clearSessionError,
    }),
    [
      user,
      loading,
      authReady,
      authConfigured,
      initError,
      sessionError,
      signInWithEmail,
      signUpWithEmail,
      signInWithGoogle,
      signOut,
      clearSessionError,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
