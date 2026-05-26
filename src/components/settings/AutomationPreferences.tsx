"use client";

import { useEffect, useState } from "react";

interface AutomationPrefs {
  scheduledScans: boolean;
  scanFrequency: "daily" | "weekly" | "monthly";
  scanQuery: string;
  autoFulfillOrders: boolean;
  autoSyncTracking: boolean;
  lastScanAt?: string;
  nextScanAt?: string;
}

export function AutomationPreferences() {
  const [prefs, setPrefs] = useState<AutomationPrefs>({
    scheduledScans: false,
    scanFrequency: "weekly",
    scanQuery: "trending dropshipping products",
    autoFulfillOrders: false,
    autoSyncTracking: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [running, setRunning] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/settings/preferences")
      .then((r) => r.json())
      .then((data) => {
        if (data.automation) {
          setPrefs({
            scheduledScans: Boolean(data.automation.scheduledScans),
            scanFrequency: data.automation.scanFrequency ?? "weekly",
            scanQuery:
              data.automation.scanQuery ?? "trending dropshipping products",
            autoFulfillOrders: Boolean(data.automation.autoFulfillOrders),
            autoSyncTracking: data.automation.autoSyncTracking !== false,
            lastScanAt: data.automation.lastScanAt,
            nextScanAt: data.automation.nextScanAt,
          });
        }
      })
      .catch(() => setError("Could not load automation preferences"))
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    const trimmed = prefs.scanQuery.trim();
    if (!trimmed) {
      setError("Research query cannot be empty.");
      return;
    }
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch("/api/settings/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...prefs, scanQuery: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Save failed");
      if (data.settings?.automation) {
        setPrefs((p) => ({
          ...p,
          lastScanAt: data.settings.automation.lastScanAt,
          nextScanAt: data.settings.automation.nextScanAt,
        }));
      }
      setMessage("Preferences saved.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleRunNow() {
    const trimmed = prefs.scanQuery.trim();
    if (!trimmed) {
      setError("Research query cannot be empty.");
      return;
    }
    setRunning(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch("/api/schedules/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message ?? data.error ?? "Scan failed");
      }
      setMessage(data.message ?? "Scan completed.");
      const prefRes = await fetch("/api/settings/preferences");
      if (prefRes.ok) {
        const updated = await prefRes.json();
        setPrefs((p) => ({
          ...p,
          lastScanAt: updated.automation?.lastScanAt,
          nextScanAt: updated.automation?.nextScanAt,
        }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Scan failed");
    } finally {
      setRunning(false);
    }
  }

  function formatWhen(iso?: string) {
    if (!iso) return "—";
    return new Date(iso).toLocaleString();
  }

  if (loading) {
    return (
      <section className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 text-sm text-zinc-500">
        Loading automation preferences…
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
      <h2 className="text-lg font-semibold text-zinc-50">Scheduled automation</h2>
      <p className="mt-1 text-sm text-zinc-400">
        Automatically run winning-product research on a schedule. Requires
        OpenRouter in Settings.
      </p>

      <div className="mt-6 space-y-4">
        <label className="flex items-center justify-between gap-4">
          <span className="text-sm text-zinc-300">Enable scheduled product scans</span>
          <input
            type="checkbox"
            checked={prefs.scheduledScans}
            onChange={(e) =>
              setPrefs((p) => ({ ...p, scheduledScans: e.target.checked }))
            }
            className="h-4 w-4 rounded border-zinc-600 bg-zinc-950 text-emerald-500"
          />
        </label>

        <label className="block">
          <span className="text-sm text-zinc-300">Scan frequency</span>
          <select
            value={prefs.scanFrequency}
            onChange={(e) =>
              setPrefs((p) => ({
                ...p,
                scanFrequency: e.target.value as AutomationPrefs["scanFrequency"],
              }))
            }
            className="mt-1.5 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </label>

        <label className="block">
          <span className="text-sm text-zinc-300">Default research query</span>
          <input
            type="text"
            value={prefs.scanQuery}
            onChange={(e) =>
              setPrefs((p) => ({ ...p, scanQuery: e.target.value }))
            }
            placeholder="e.g. pet products, summer gadgets"
            className="mt-1.5 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
          />
        </label>

        <label className="flex items-center justify-between gap-4">
          <span className="text-sm text-zinc-300">Auto-fulfill orders (Trendaryo)</span>
          <input
            type="checkbox"
            checked={prefs.autoFulfillOrders}
            onChange={(e) =>
              setPrefs((p) => ({ ...p, autoFulfillOrders: e.target.checked }))
            }
            className="h-4 w-4 rounded border-zinc-600 bg-zinc-950 text-emerald-500"
          />
        </label>

        <label className="flex items-center justify-between gap-4">
          <span className="text-sm text-zinc-300">Auto-sync tracking numbers</span>
          <input
            type="checkbox"
            checked={prefs.autoSyncTracking}
            onChange={(e) =>
              setPrefs((p) => ({ ...p, autoSyncTracking: e.target.checked }))
            }
            className="h-4 w-4 rounded border-zinc-600 bg-zinc-950 text-emerald-500"
          />
        </label>

        <div className="rounded-lg border border-zinc-800 bg-zinc-950/50 px-3 py-2 text-xs text-zinc-500">
          <p>Last scan: {formatWhen(prefs.lastScanAt)}</p>
          <p className="mt-1">Next scan: {formatWhen(prefs.nextScanAt)}</p>
        </div>
      </div>

      {message ? <p className="mt-4 text-sm text-emerald-400">{message}</p> : null}
      {error ? <p className="mt-4 text-sm text-red-400">{error}</p> : null}

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-emerald-400 disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save preferences"}
        </button>
        <button
          type="button"
          onClick={handleRunNow}
          disabled={running}
          className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-800 disabled:opacity-60"
        >
          {running ? "Scanning…" : "Run scan now"}
        </button>
      </div>
    </section>
  );
}
