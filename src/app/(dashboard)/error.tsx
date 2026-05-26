"use client";

import { useEffect } from "react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Dashboard Error]:", error);
  }, [error]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 text-center space-y-6">
      <div className="text-4xl">⚠</div>
      <h1 className="text-2xl font-semibold text-zinc-100">Something went wrong</h1>
      <p className="text-sm text-zinc-400 max-w-md mx-auto">
        {error.message || "An unexpected error occurred while loading the dashboard."}
      </p>
      <button
        onClick={reset}
        className="rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-medium text-zinc-950 hover:bg-emerald-400 transition"
      >
        Try again
      </button>
    </div>
  );
}