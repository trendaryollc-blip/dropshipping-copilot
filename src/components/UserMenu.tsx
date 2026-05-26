"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export function UserMenu() {
  const router = useRouter();
  const { user, loading, authConfigured, demoMode, signOut } = useAuth();
  const [signingOut, setSigningOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSignOut() {
    setError(null);
    setSigningOut(true);
    try {
      await signOut();
      router.replace("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign out failed");
    } finally {
      setSigningOut(false);
    }
  }

  if (loading) {
    return <p className="text-xs text-zinc-600">Loading…</p>;
  }

  if (demoMode || !authConfigured) {
    return (
      <div className="space-y-2">
        <p className="text-xs text-zinc-500">Demo mode — no sign-in required</p>
        <Link
          href="/login"
          className="block text-xs text-emerald-400 hover:text-emerald-300"
        >
          Enable accounts →
        </Link>
      </div>
    );
  }

  if (!user) {
    return (
      <Link
        href="/login"
        className="text-xs text-emerald-400 hover:text-emerald-300"
      >
        Sign in
      </Link>
    );
  }

  const initial = (user.displayName || user.email || "?")[0]?.toUpperCase();

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20 text-sm font-medium text-emerald-300">
          {initial}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-zinc-200">
            {user.displayName || "Account"}
          </p>
          <p className="truncate text-xs text-zinc-500">{user.email}</p>
        </div>
      </div>
      {error ? <p className="text-xs text-red-400">{error}</p> : null}
      <button
        type="button"
        onClick={handleSignOut}
        disabled={signingOut}
        className="text-xs text-zinc-500 hover:text-zinc-300 disabled:opacity-50"
      >
        {signingOut ? "Signing out…" : "Sign out"}
      </button>
    </div>
  );
}
