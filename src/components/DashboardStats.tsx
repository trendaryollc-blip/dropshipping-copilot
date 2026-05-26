"use client";

import { useCallback, useEffect, useState } from "react";
import { StatCard } from "@/components/StatCard";

interface StatsResponse {
  productsScanned: number;
  suppliersMatched: number;
  listingsDrafted: number;
  ordersFulfilled: number;
  successRate: string;
  live: boolean;
  hint: string;
}

export function DashboardStats() {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(() => {
    setError(null);
    setStats(null);
    fetch("/api/dashboard/stats")
      .then((r) => r.json())
      .then((data) => setStats(data))
      .catch(() => setError("Failed to load stats"));
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (error) {
    return (
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="col-span-full flex flex-col items-center justify-center gap-3 rounded-xl border border-red-900/40 bg-zinc-900/40 p-8 text-center">
          <p className="text-sm text-red-400">{error}</p>
          <button
            onClick={fetchStats}
            className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-800"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  if (!stats) {
    return (
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-24 animate-pulse rounded-xl border border-zinc-800 bg-zinc-900/40"
          />
        ))}
      </section>
    );
  }

  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        label="Products scanned"
        value={String(stats.productsScanned)}
        hint={stats.hint}
      />
      <StatCard
        label="Suppliers matched"
        value={String(stats.suppliersMatched)}
        hint={stats.live ? "Completed runs" : "Demo"}
      />
      <StatCard
        label="Listings drafted"
        value={String(stats.listingsDrafted)}
        hint="AI copy runs"
      />
      <StatCard
        label="Orders auto-fulfilled"
        value={String(stats.ordersFulfilled)}
        hint={`Success rate ${stats.successRate}`}
      />
    </section>
  );
}
