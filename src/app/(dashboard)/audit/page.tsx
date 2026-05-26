"use client";

import { useState, useEffect } from "react";

interface AuditLog {
  id: string;
  action: string;
  resource: string;
  detail: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

const ACTION_LABELS: Record<string, string> = {
  create: "Create",
  update: "Update",
  delete: "Delete",
  auth: "Auth",
  publish: "Publish",
  run: "Run",
};

const ACTION_COLORS: Record<string, string> = {
  create: "bg-blue-500/15 text-blue-300",
  update: "bg-amber-500/15 text-amber-300",
  delete: "bg-red-500/15 text-red-400",
  auth: "bg-purple-500/15 text-purple-300",
  publish: "bg-emerald-500/15 text-emerald-300",
  run: "bg-cyan-500/15 text-cyan-300",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString();
}

export default function AuditLogPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [resourceFilter, setResourceFilter] = useState("all");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/audit?limit=100");
        if (res.ok) {
          const data = await res.json();
          setLogs(data.logs ?? []);
        }
      } catch (err) {
        console.error("Failed to load audit logs:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const resources = Array.from(new Set(logs.map((l) => l.resource))).sort();

  const filtered = logs.filter((l) => {
    return resourceFilter === "all" || l.resource === resourceFilter;
  });

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold text-zinc-50">Audit Log</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Record of all actions taken in your account, including data changes, publish events, and automation runs.
        </p>
      </header>

      <div className="flex flex-wrap gap-3 rounded-xl border border-zinc-800 bg-zinc-900/20 p-4">
        <div className="w-48">
          <select
            value={resourceFilter}
            onChange={(e) => setResourceFilter(e.target.value)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus:border-emerald-500 focus:outline-none"
          >
            <option value="all">All Resources</option>
            {resources.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
        <p className="ml-auto self-center text-xs text-zinc-500">
          {filtered.length} event{filtered.length !== 1 ? "s" : ""}
        </p>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-14 animate-pulse rounded-xl border border-zinc-800 bg-zinc-900/20" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-800 p-12 text-center">
          <p className="text-sm text-zinc-500">
            No audit events recorded yet. Events appear here as you use the app.
          </p>
        </div>
      ) : (
        <div className="space-y-1.5">
          {filtered.map((log) => (
            <div
              key={log.id}
              className="flex items-center gap-4 rounded-lg border border-zinc-800/60 bg-zinc-900/20 px-4 py-3"
            >
              <span
                className={`shrink-0 rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${ACTION_COLORS[log.action] ?? "bg-zinc-700 text-zinc-300"}`}
              >
                {ACTION_LABELS[log.action] ?? log.action}
              </span>

              <div className="flex-1 min-w-0">
                <p className="text-sm text-zinc-200">{log.detail}</p>
                {log.metadata && (
                  <p className="text-[10px] text-zinc-600">
                    {log.resource} · {JSON.stringify(log.metadata)}
                  </p>
                )}
              </div>

              <p className="shrink-0 text-xs text-zinc-500">{formatDate(log.createdAt)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
