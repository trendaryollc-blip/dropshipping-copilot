"use client";

import { useState, useEffect } from "react";

interface AutomationStep {
  id: string;
  label: string;
  status: "idle" | "running" | "completed" | "failed";
  detail?: string;
  completedAt?: string;
}

interface RunRecord {
  id: string;
  moduleId: string;
  status: "completed" | "failed" | "running";
  message: string;
  startedAt: string;
  completedAt?: string;
  input: Record<string, unknown>;
  steps?: AutomationStep[];
}

const MODULE_LABELS: Record<string, string> = {
  "product-research": "Product Research",
  suppliers: "Supplier Match",
  copywriting: "Product Copy",
  orders: "Order Fulfillment",
  "full-pipeline": "Full Autopilot",
};

const MODULE_ICONS: Record<string, string> = {
  "product-research": "🔍",
  suppliers: "📦",
  copywriting: "✍️",
  orders: "🚚",
  "full-pipeline": "⚡",
};

function formatDuration(start: string, end?: string): string {
  if (!end) return "—";
  const ms = new Date(end).getTime() - new Date(start).getTime();
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  return `${Math.round(ms / 60000)}m ${Math.round((ms % 60000) / 1000)}s`;
}

function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 60000) return "just now";
  if (diff < 3600000) return `${Math.round(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.round(diff / 3600000)}h ago`;
  return `${Math.round(diff / 86400000)}d ago`;
}

export default function HistoryPage() {
  const [runs, setRuns] = useState<RunRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [moduleFilter, setModuleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isDemo, setIsDemo] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/history?limit=100");
        if (res.ok) {
          const data = await res.json();
          setRuns(data.runs ?? []);
          setIsDemo(data.demo ?? false);
        }
      } catch (err) {
        console.error("Failed to load history:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleClearHistory() {
    if (!confirm("Clear all automation history? This cannot be undone.")) return;
    setClearing(true);
    try {
      const res = await fetch("/api/history", { method: "DELETE" });
      if (res.ok) {
        setRuns([]);
      }
    } catch {
      console.error("Failed to clear history");
    } finally {
      setClearing(false);
    }
  }

  const filtered = runs.filter((r) => {
    const matchModule = moduleFilter === "all" || r.moduleId === moduleFilter;
    const matchStatus = statusFilter === "all" || r.status === statusFilter;
    return matchModule && matchStatus;
  });

  const completedCount = runs.filter((r) => r.status === "completed").length;
  const failedCount = runs.filter((r) => r.status === "failed").length;

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-50">Automation history</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Browse all past automation runs. Each entry shows the module, inputs, status, and duration.
            {isDemo && (
              <span className="ml-2 rounded-full bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400">
                Demo data
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-zinc-500">
            <span className="text-emerald-400 font-semibold">{completedCount}</span> completed
          </span>
          {failedCount > 0 && (
            <span className="text-zinc-500">
              <span className="text-red-400 font-semibold">{failedCount}</span> failed
            </span>
          )}
          {runs.length > 0 && !isDemo && (
            <button
              onClick={handleClearHistory}
              disabled={clearing}
              className="rounded-lg border border-red-800 px-3 py-1.5 text-xs text-red-400 hover:border-red-700 hover:bg-red-950/30 disabled:opacity-50"
            >
              {clearing ? "Clearing..." : "Clear history"}
            </button>
          )}
        </div>
      </header>

      <div className="flex flex-wrap gap-3 rounded-xl border border-zinc-800 bg-zinc-900/20 p-4">
        <div className="w-52">
          <select
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus:border-emerald-500 focus:outline-none"
          >
            <option value="all">All Modules</option>
            {Object.entries(MODULE_LABELS).map(([id, label]) => (
              <option key={id} value={id}>{label}</option>
            ))}
          </select>
        </div>
        <div className="w-40">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus:border-emerald-500 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>
        </div>
        <p className="ml-auto self-center text-xs text-zinc-500">
          {filtered.length} of {runs.length} runs
        </p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-16 animate-pulse rounded-xl border border-zinc-800 bg-zinc-900/20"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-800 p-12 text-center">
          <p className="text-sm text-zinc-500">
            No automation runs found. Run any module to see history here.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((run) => {
            const isOk = run.status === "completed";
            const isExpanded = expandedId === run.id;
            const hasSteps = run.steps && run.steps.length > 0;

            return (
              <div key={run.id} className="rounded-xl border border-zinc-800 bg-zinc-900/30 overflow-hidden">
                <div
                  className="px-5 py-4 flex flex-wrap items-center gap-4 hover:border-zinc-700 transition cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : run.id)}
                >
                  <span className="text-xl shrink-0" aria-hidden>
                    {MODULE_ICONS[run.moduleId] ?? "⚙️"}
                  </span>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-zinc-100 text-sm">
                        {MODULE_LABELS[run.moduleId] ?? run.moduleId}
                      </p>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                          isOk
                            ? "bg-emerald-500/15 text-emerald-300"
                            : "bg-red-500/15 text-red-400"
                        }`}
                      >
                        {run.status}
                      </span>
                      {hasSteps && (
                        <span className="text-[10px] text-zinc-600">
                          {run.steps!.filter((s) => s.status === "completed").length}/{run.steps!.length} steps
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-zinc-400 truncate">{run.message}</p>
                    {Object.keys(run.input ?? {}).length > 0 && (
                      <p className="mt-0.5 text-[10px] text-zinc-600 truncate">
                        Input: {Object.entries(run.input)
                          .map(([k, v]) => `${k}=${String(v)}`)
                          .join(", ")}
                      </p>
                    )}
                  </div>

                  <div className="text-right shrink-0 space-y-0.5">
                    <p className="text-xs text-zinc-400">{formatRelative(run.startedAt)}</p>
                    <p className="text-[10px] text-zinc-600">
                      Duration: {formatDuration(run.startedAt, run.completedAt)}
                    </p>
                  </div>

                  <span className="text-zinc-600 text-sm">
                    {isExpanded ? "▲" : "▼"}
                  </span>
                </div>

                {isExpanded && hasSteps && (
                  <div className="border-t border-zinc-800 px-5 py-3 space-y-1.5">
                    <p className="text-[10px] text-zinc-600 uppercase tracking-wide font-semibold mb-2">Steps</p>
                    {run.steps!.map((step) => (
                      <div key={step.id} className="flex items-center gap-2 text-xs">
                        <span className={`shrink-0 w-1.5 h-1.5 rounded-full ${
                          step.status === "completed" ? "bg-emerald-400" :
                          step.status === "failed" ? "bg-red-400" :
                          step.status === "running" ? "bg-amber-400 animate-pulse" :
                          "bg-zinc-700"
                        }`} />
                        <span className={`shrink-0 w-16 text-right ${
                          step.status === "completed" ? "text-emerald-400" :
                          step.status === "failed" ? "text-red-400" :
                          step.status === "running" ? "text-amber-400" :
                          "text-zinc-600"
                        }`}>
                          {step.status}
                        </span>
                        <span className="text-zinc-300">{step.label}</span>
                        {step.detail && (
                          <span className="text-zinc-600 ml-1">— {step.detail}</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
