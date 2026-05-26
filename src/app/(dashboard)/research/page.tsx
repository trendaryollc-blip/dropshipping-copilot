"use client";

import { useState, useEffect } from "react";
import { AutomationRunner } from "@/components/AutomationRunner";
import { toast } from "@/components/Toast";

interface ResearchProduct {
  id: string;
  name: string;
  niche?: string;
  trend?: string;
  estimatedMargin?: string;
  score?: number;
  whyItWins?: string;
  createdAt: string;
}

export default function ResearchPage() {
  const [recentResults, setRecentResults] = useState<ResearchProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [autoSave, setAutoSave] = useState(true);

  useEffect(() => { loadRecent(); }, []);

  async function loadRecent() {
    try {
      const res = await fetch("/api/products?limit=20");
      if (res.ok) {
        const data = await res.json();
        setRecentResults((data.products ?? []).slice(0, 10));
      }
    } catch (err) {
      console.error("Failed to load recent products:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        setRecentResults((prev) => prev.filter((p) => p.id !== id));
        toast("Product removed.", "success");
      } else {
        toast("Failed to delete.", "error");
      }
    } catch {
      toast("Error deleting product.", "error");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleSaveProduct(product: Record<string, unknown>, idx: number) {
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: product.name,
          niche: product.niche ?? "General",
          trend: product.trend ?? "Stable",
          estimatedMargin: product.estimatedMargin ?? "40%",
          score: product.score ?? 75,
          whyItWins: product.whyItWins ?? "",
        }),
      });
      if (res.ok) {
        toast("Saved to product library!", "success");
        loadRecent();
      } else {
        toast("Failed to save.", "error");
      }
    } catch {
      toast("Error saving product.", "error");
    }
  }

  const savedCount = recentResults.length;
  const avgScore = savedCount > 0
    ? Math.round(recentResults.reduce((sum, p) => sum + (p.score ?? 0), 0) / savedCount)
    : 0;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold text-zinc-50">Winning products</h1>
        <p className="mt-1 text-sm text-zinc-400">
          AI-powered product ideas via OpenRouter. Results are scored and saved to your library automatically.
        </p>
      </header>

      <AutomationRunner
        moduleId="product-research"
        title="Product research scan"
        description="Enter a product name, niche, or keyword (e.g. pet hair remover, kitchen gadgets)."
        fields={[
          {
            name: "query",
            label: "Product name or niche",
            placeholder: "e.g. pet hair remover, kitchen gadgets",
          },
        ]}
        onResult={(result) => {
          if (autoSave && Array.isArray(result.output?.products)) {
            for (const p of result.output.products as Record<string, unknown>[]) {
              handleSaveProduct(p, 0);
            }
          }
          loadRecent();
        }}
      />

      {/* Recent Results Panel */}
      <section>
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg font-medium text-zinc-200">Recent Scans</h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              {savedCount} products scanned · Avg score {avgScore}
            </p>
          </div>
          <label className="flex items-center gap-2 text-xs text-zinc-400 cursor-pointer">
            <input
              type="checkbox"
              checked={autoSave}
              onChange={(e) => setAutoSave(e.target.checked)}
              className="accent-emerald-500"
            />
            Auto-save to library
          </label>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 animate-pulse rounded-xl border border-zinc-800 bg-zinc-900/20" />
            ))}
          </div>
        ) : recentResults.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-800 p-8 text-center">
            <p className="text-sm text-zinc-500">
              No products scanned yet. Run a research scan above to discover winning products.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {recentResults.map((p) => {
              const isHigh = (p.score ?? 0) >= 80;
              return (
                <div
                  key={p.id}
                  className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/30 px-5 py-4 hover:border-zinc-700 transition"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-zinc-100 text-sm line-clamp-1">{p.name}</p>
                      <span className="rounded bg-zinc-800 px-2 py-0.5 text-[10px] text-zinc-400">
                        {p.niche ?? "General"}
                      </span>
                      <span
                        className={`rounded px-2 py-0.5 text-[10px] font-semibold ${
                          isHigh
                            ? "bg-emerald-500/15 text-emerald-300"
                            : "bg-amber-500/15 text-amber-300"
                        }`}
                      >
                        {p.score ?? "—"}/100
                      </span>
                    </div>
                    <div className="flex gap-3 mt-1 text-[10px] text-zinc-500">
                      {p.trend && <span>Trend: {p.trend}</span>}
                      {p.estimatedMargin && <span>Margin: {p.estimatedMargin}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <a
                      href="/products"
                      className="text-xs text-emerald-400 hover:text-emerald-300 underline"
                    >
                      View
                    </a>
                    <button
                      onClick={() => handleDelete(p.id)}
                      disabled={deletingId === p.id}
                      className="text-xs text-red-400 hover:text-red-300 disabled:opacity-50"
                    >
                      {deletingId === p.id ? "..." : "Remove"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}