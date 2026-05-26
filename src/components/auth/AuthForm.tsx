"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  firebaseConsoleAuthSettingsUrl,
} from "@/lib/auth/errors";

interface AuthFormProps {
  mode: "login" | "register";
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const {
    user,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    authConfigured,
    authReady,
    initError,
    sessionError,
    clearSessionError,
  } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [healthHint, setHealthHint] = useState<string | null>(null);
  const [hostname] = useState(() =>
    typeof window === "undefined" ? "" : window.location.hostname
  );

  const isLogin = mode === "login";
  const isLocalhost =
    hostname === "localhost" || hostname === "127.0.0.1" || hostname === "";

  // Redirect away from login/register if already authenticated (covers Google redirect flow races)
  useEffect(() => {
    if (user) {
      router.replace("/");
    }
  }, [user, router]);

  useEffect(() => {
    fetch("/api/auth/health")
      .then((r) => r.json())
      .then((data) => {
        if (!data.ready && data.hint) setHealthHint(data.hint);
      })
      .catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    clearSessionError();
    setError(null);

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password, displayName);
      }
      router.replace("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle(useRedirect = false) {
    clearSessionError();
    setError(null);
    setLoading(true);
    try {
      await signInWithGoogle(useRedirect);
      if (!useRedirect) {
        router.replace("/");
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google sign-in failed");
      setLoading(false);
    }
  }

  if (!authReady) {
    return (
      <div className="flex items-center justify-center py-12 text-sm text-zinc-400">
        <span
          className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent"
          aria-hidden
        />
        Loading…
      </div>
    );
  }

  if (!authConfigured) {
    return (
      <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-6 text-sm text-amber-100">
        <p className="font-medium">Firebase login is not active yet</p>
        <p className="mt-2 text-amber-100/80">
          The app could not read{" "}
          <code className="text-amber-200">NEXT_PUBLIC_FIREBASE_*</code> from your
          env files. Stop the server (Ctrl+C), run{" "}
          <code className="text-amber-200">npm run dev</code> again, then reload
          this page.
        </p>
        {healthHint ? (
          <p className="mt-2 text-amber-200/90">{healthHint}</p>
        ) : null}
        {initError ? (
          <p className="mt-2 text-red-300">{initError}</p>
        ) : null}
        <Link
          href="/"
          className="mt-4 inline-block text-emerald-400 hover:text-emerald-300"
        >
          Continue in demo mode →
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {sessionError ? (
        <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">
          Signed in to Firebase but server session failed: {sessionError}. Try
          signing in again, or check FIREBASE_* keys in .env.local.
        </div>
      ) : null}

      {healthHint && !error ? (
        <p className="text-xs text-zinc-500">{healthHint}</p>
      ) : null}

      {hostname && !isLocalhost ? (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-100">
          You are on <strong>{hostname}</strong>. Google sign-in requires adding this
          domain in Firebase → Authentication → Authorized domains, or switch to{" "}
          <a href="http://localhost:3000/login" className="text-emerald-300 underline">
            localhost:3000
          </a>
          .
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin ? (
          <label className="block">
            <span className="text-sm text-zinc-300">Display name</span>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your name"
              className="mt-1.5 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-emerald-500 focus:outline-none"
            />
          </label>
        ) : null}

        <label className="block">
          <span className="text-sm text-zinc-300">Email</span>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="mt-1.5 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-emerald-500 focus:outline-none"
          />
        </label>

        <label className="block">
          <span className="text-sm text-zinc-300">Password</span>
          <input
            type="password"
            required
            minLength={6}
            autoComplete={isLogin ? "current-password" : "new-password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
            className="mt-1.5 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-emerald-500 focus:outline-none"
          />
        </label>

        {error ? (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            <p className="whitespace-pre-wrap">{error}</p>
            {error.includes("Authorized domains") ? (
              <a
                href={firebaseConsoleAuthSettingsUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-emerald-400 underline hover:text-emerald-300"
              >
                Open Firebase Authorized domains →
              </a>
            ) : null}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-emerald-500 py-2.5 text-sm font-medium text-zinc-950 hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Please wait…" : isLogin ? "Sign in" : "Create account"}
        </button>
        {isLogin && (
          <div className="mt-2 text-right">
            <Link href="/login/forgot" className="text-xs text-emerald-400 hover:text-emerald-300">
              Forgot password?
            </Link>
          </div>
        )}
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-zinc-800" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-zinc-950 px-2 text-zinc-500">or</span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => handleGoogle(false)}
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 py-2.5 text-sm text-zinc-200 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Please wait…" : "Continue with Google"}
      </button>

      {error?.includes("Authorized domains") ? (
        <button
          type="button"
          onClick={() => handleGoogle(true)}
          disabled={loading}
          className="w-full rounded-lg border border-zinc-700 py-2 text-xs text-zinc-400 hover:bg-zinc-900 disabled:opacity-60"
        >
          Retry with full-page Google sign-in
        </button>
      ) : null}

      <p className="text-center text-sm text-zinc-500">
        {isLogin ? (
          <>
            No account?{" "}
            <Link
              href="/register"
              className="text-emerald-400 hover:text-emerald-300"
            >
              Register
            </Link>
            {" · "}
            <Link
              href="/login/forgot"
              className="text-emerald-400 hover:text-emerald-300"
            >
              Forgot password?
            </Link>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <Link href="/login" className="text-emerald-400 hover:text-emerald-300">
              Sign in
            </Link>
          </>
        )}
      </p>

      <p className="text-center text-xs text-zinc-600">
        Use{" "}
        <a href="http://localhost:3000/login" className="text-zinc-400 underline">
          localhost:3000
        </a>{" "}
        (not a network IP) if buttons seem unresponsive in dev.
      </p>
    </div>
  );
}
