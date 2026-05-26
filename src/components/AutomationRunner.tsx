"use client";

import { useRef, useState } from "react";
import type { AutomationJobResult, AutomationModuleId } from "@/lib/automation/types";
import { toast } from "@/components/Toast";

interface ResearchProduct {
  name: string;
  niche?: string;
  trend?: string;
  estimatedMargin?: string;
  score?: number;
  whyItWins?: string;
}

interface AutomationRunnerProps {
  moduleId: AutomationModuleId;
  title: string;
  description: string;
  fields?: { name: string; label: string; placeholder: string }[];
  onResult?: (result: AutomationJobResult) => void;
}

function getErrorMessage(data: unknown, fallback: string): string {
  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    if (typeof obj.message === "string" && obj.message) return obj.message;
    if (typeof obj.error === "string" && obj.error) return obj.error;
  }
  return fallback;
}

export function AutomationRunner({
  moduleId,
  title,
  description,
  fields = [],
  onResult,
}: AutomationRunnerProps) {
  const [form, setForm] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AutomationJobResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Custom interactive states inside the runner
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [savingProductId, setSavingProductId] = useState<string | null>(null);
  const [savedProductIds, setSavedProductIds] = useState<Record<string, boolean>>({});
  const [activePipelineTab, setActivePipelineTab] = useState<"research" | "suppliers" | "copy">("research");

  const resultsRef = useRef<HTMLDivElement>(null);

  async function handleRun(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    setSavedProductIds({});

    try {
      const res = await fetch(`/api/automation/${moduleId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      let data: unknown = null;
      const text = await res.text();
      if (text) {
        try {
          data = JSON.parse(text);
        } catch {
          throw new Error(
            res.ok
              ? "Server returned invalid JSON"
              : `Server error (${res.status}). Is npm run dev running?`,
          );
        }
      }

      if (!res.ok) {
        if (res.status === 401) {
          window.location.href = "/login?from=" + encodeURIComponent(window.location.pathname);
          return;
        }
        throw new Error(getErrorMessage(data, `Automation failed (${res.status})`));
      }

      if (!data || typeof data !== "object") {
        throw new Error("Empty response from server");
      }

      setResult(data as AutomationJobResult);
      onResult?.(data as AutomationJobResult);
      requestAnimationFrame(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      requestAnimationFrame(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      });
    } finally {
      setLoading(false);
    }
  }

  // Handle saving product to library inline from research results
  async function handleSaveProduct(product: ResearchProduct, idx: number) {
    setSavingProductId(String(idx));
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
        setSavedProductIds((prev) => ({ ...prev, [idx]: true }));
      } else {
        toast("Failed to save product to library.", "error");
      }
    } catch (err) {
      console.error("Save product failed:", err);
      toast("Error saving product to library.", "error");
    } finally {
      setSavingProductId(null);
    }
  }

  function handleCopyToClipboard(text: string, section: string) {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
      {/* LEFT: FORM INPUT PANEL */}
      <form
        onSubmit={handleRun}
        className="rounded-xl border border-zinc-800 bg-zinc-900/20 p-6 glass-panel"
      >
        <h2 className="text-lg font-semibold text-zinc-50">{title}</h2>
        <p className="mt-2 text-sm text-zinc-400">{description}</p>

        {fields.length > 0 ? (
          <div className="mt-6 space-y-4">
            {fields.map((field) => (
              <label key={field.name} className="block">
                <span className="text-sm text-zinc-300">{field.label}</span>
                <input
                  name={field.name}
                  placeholder={field.placeholder}
                  value={form[field.name] ?? ""}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      [field.name]: e.target.value,
                    }))
                  }
                  className="mt-1.5 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-emerald-500 focus:outline-none"
                />
              </label>
            ))}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60 btn-glow"
        >
          {loading ? (
            <>
              <span
                className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-zinc-950 border-t-transparent"
                aria-hidden
              />
              Running autopilot scans…
            </>
          ) : (
            "Run Automation workflow"
          )}
        </button>
      </form>

      {/* RIGHT: PREMIUM RESULTS DISPLAY PANEL */}
      <div
        ref={resultsRef}
        aria-live="polite"
        className={`rounded-xl border p-6 transition-all duration-300 ${
          loading
            ? "border-emerald-500/50 bg-emerald-500/5"
            : error
              ? "border-red-500/40 bg-red-500/5"
              : result
                ? "border-emerald-500/20 bg-zinc-900/10 backdrop-blur-md"
                : "border-zinc-800 bg-zinc-900/20"
        }`}
      >
        <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
          Workflow Results
        </h3>

        {error ? (
          <p className="mt-4 text-sm text-red-400">{error}</p>
        ) : null}

        {!result && !error && !loading ? (
          <div className="mt-8 text-center py-12 space-y-3">
            <span className="text-3xl text-zinc-600">🤖</span>
            <p className="text-sm text-zinc-500 max-w-sm mx-auto">
              Configure parameters on the left and start the engine. Results will be processed and formatted in high-fidelity cards.
            </p>
          </div>
        ) : null}

        {loading ? (
          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-3">
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" />
              <p className="text-sm font-semibold text-emerald-400">
                AI Autopilot working — Please wait
              </p>
            </div>
            <div className="space-y-2.5">
              <div className="h-2 w-full bg-zinc-800 rounded overflow-hidden">
                <div className="h-full bg-emerald-500 animate-[pulse_1.5s_infinite]" style={{width: '65%'}} />
              </div>
              <p className="text-xs text-zinc-500">
                Chaining modules, mapping catalogs, and optimizing listing assets...
              </p>
            </div>
          </div>
        ) : null}

        {result ? (
          <div className="mt-4 space-y-6">
            <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 text-sm text-emerald-300">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>{result.message}</span>
            </div>

            {/* Step execution tracker */}
            <ul className="space-y-2 border-b border-zinc-800 pb-4">
              {result.steps.map((step) => (
                <li
                  key={step.id}
                  className="flex items-center gap-2 text-xs text-zinc-400 font-medium"
                >
                  <span
                    className={
                      step.status === "failed" ? "text-red-400" : "text-emerald-400"
                    }
                  >
                    {step.status === "failed" ? "✕" : "✓"}
                  </span>
                  {step.label}
                </li>
              ))}
            </ul>

            {/* MODULE SPECIFIC FORMATTED VIEWS */}
            
            {/* 1. PRODUCT RESEARCH MODULE VIEW */}
            {moduleId === "product-research" && Array.isArray(result.output.products) && (
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-zinc-300">Trending Winners Discovered</h4>
                <div className="space-y-3.5">
                  {(result.output.products as ResearchProduct[]).map((p, idx) => (
                    <div
                      key={idx}
                      className="rounded-lg border border-zinc-800 bg-zinc-950/80 p-4 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="rounded bg-zinc-900 px-2 py-0.5 text-xs text-zinc-400">
                            {p.niche ?? "General"}
                          </span>
                          <span className="shrink-0 rounded bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-xs text-emerald-300">
                            Score: {p.score ?? "—"}/100
                          </span>
                        </div>
                        <h5 className="mt-2 font-medium text-zinc-100">{p.name}</h5>
                        <p className="mt-1 text-xs text-zinc-500">
                          Trend: {p.trend ?? "Rising"} · Estimated Margin: {p.estimatedMargin ?? "—"}
                        </p>
                        {p.whyItWins && (
                          <p className="mt-3 text-xs text-zinc-400 leading-relaxed border-t border-zinc-900 pt-2">
                            {p.whyItWins}
                          </p>
                        )}
                      </div>
                      
                      {/* Save to library micro-interaction */}
                      <button
                        onClick={() => handleSaveProduct(p, idx)}
                        disabled={savedProductIds[idx] || savingProductId === String(idx)}
                        className="mt-4 w-full rounded border border-zinc-800 bg-zinc-900 py-1.5 text-xs text-zinc-300 hover:text-white hover:border-zinc-700 transition"
                      >
                        {savedProductIds[idx] ? "✓ Saved in Library" : savingProductId === String(idx) ? "Saving..." : "Save to Product Library"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. SUPPLIERS MODULE VIEW */}
            {moduleId === "suppliers" && Array.isArray(result.output.suppliers) && (
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-zinc-300">Supplier Sourcing Matches</h4>
                <div className="space-y-3">
                  {(result.output.suppliers as any[]).map((s, idx) => (
                    <div
                      key={idx}
                      className="rounded-lg border border-zinc-800 bg-zinc-950/80 p-4 flex items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <p className="font-medium text-zinc-200">{s.name}</p>
                        <p className="text-xs text-zinc-500 uppercase tracking-wide">
                          Platform: <span className="text-emerald-400">{s.platform}</span> · Shipping: {s.shippingDays} days · Rating: {s.rating}★
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-semibold text-emerald-400">${s.unitCost.toFixed(2)}</p>
                        {s.productUrl && (
                          <a
                            href={s.productUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-1 inline-block text-xs text-zinc-400 hover:text-zinc-200 underline"
                          >
                            Source Link →
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. COPYWRITING MODULE VIEW */}
            {moduleId === "copywriting" && (
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-zinc-300 font-mono">Product Copy Asset Generation</h4>
                
                {Boolean(result.output.title) && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-zinc-500 font-semibold uppercase">SEO Title</span>
                      <button
                        onClick={() => handleCopyToClipboard(String(result.output.title), "title")}
                        className="text-xs text-emerald-400 hover:text-emerald-300"
                      >
                        {copiedSection === "title" ? "Copied!" : "Copy"}
                      </button>
                    </div>
                    <div className="rounded bg-zinc-950 p-3 text-xs text-zinc-200 border border-zinc-900">
                      {String(result.output.title)}
                    </div>
                  </div>
                )}

                {Boolean(result.output.description) && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-zinc-500 font-semibold uppercase">Persuasive Description</span>
                      <button
                        onClick={() => handleCopyToClipboard(String(result.output.description), "desc")}
                        className="text-xs text-emerald-400 hover:text-emerald-300"
                      >
                        {copiedSection === "desc" ? "Copied!" : "Copy"}
                      </button>
                    </div>
                    <div className="rounded bg-zinc-950 p-3 text-xs text-zinc-300 border border-zinc-900 whitespace-pre-wrap">
                      {String(result.output.description)}
                    </div>
                  </div>
                )}

                {Array.isArray(result.output.bullets) && result.output.bullets.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-xs text-zinc-500 font-semibold uppercase block">Selling Points</span>
                    <ul className="list-disc pl-5 space-y-1 text-xs text-zinc-400">
                      {(result.output.bullets as string[]).map((bp, i) => (
                        <li key={i}>{bp}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* 4. ORDERS MODULE VIEW */}
            {moduleId === "orders" && Array.isArray(result.output.orders) && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-900 text-center">
                    <span className="text-xs text-zinc-500 block uppercase">Processed</span>
                    <span className="text-lg font-semibold text-zinc-200">{String(result.output.processed ?? 0)}</span>
                  </div>
                  <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-900 text-center">
                    <span className="text-xs text-zinc-500 block uppercase">Fulfilled</span>
                    <span className="text-lg font-semibold text-emerald-400">{String(result.output.placed ?? 0)}</span>
                  </div>
                  <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-900 text-center">
                    <span className="text-xs text-zinc-500 block uppercase">Failed</span>
                    <span className="text-lg font-semibold text-red-400">{String(result.output.failed ?? 0)}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-xs text-zinc-500 font-semibold uppercase block">Sync Details</span>
                  {(result.output.orders as any[]).map((o, idx) => (
                    <div key={idx} className="rounded bg-zinc-950 p-3 flex justify-between items-center text-xs border border-zinc-900">
                      <div>
                        <span className="font-semibold text-zinc-200">{o.id}</span>
                        <span className="text-zinc-500 ml-2">Tracking: {o.tracking ?? "—"}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        o.status === "placed" || o.status === "fulfilled"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-red-500/10 text-red-400"
                      }`}>
                        {o.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. FULL PIPELINE AUTOPILOT MODULE VIEW */}
            {moduleId === "full-pipeline" && (
              <div className="space-y-4 border-t border-zinc-800 pt-4">
                <div className="flex gap-2 border-b border-zinc-900 pb-2">
                  <button
                    type="button"
                    onClick={() => setActivePipelineTab("research")}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                      activePipelineTab === "research" ? "bg-emerald-500 text-zinc-950" : "text-zinc-400 hover:bg-zinc-900"
                    }`}
                  >
                    1. Product Scan
                  </button>
                  <button
                    type="button"
                    onClick={() => setActivePipelineTab("suppliers")}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                      activePipelineTab === "suppliers" ? "bg-emerald-500 text-zinc-950" : "text-zinc-400 hover:bg-zinc-900"
                    }`}
                  >
                    2. Sourcing Match
                  </button>
                  <button
                    type="button"
                    onClick={() => setActivePipelineTab("copy")}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                      activePipelineTab === "copy" ? "bg-emerald-500 text-zinc-950" : "text-zinc-400 hover:bg-zinc-900"
                    }`}
                  >
                    3. AI Listing Copy
                  </button>
                </div>

                {Boolean(activePipelineTab === "research" && result.output.product) && (
                  <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-900 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="rounded bg-zinc-900 px-2 py-0.5 text-xs text-zinc-400">
                        Niche: {(result.output.product as any).niche ?? "General"}
                      </span>
                      <span className="rounded bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-xs text-emerald-300">
                        Score: {(result.output.product as any).score ?? "—"}/100
                      </span>
                    </div>
                    <h5 className="font-medium text-zinc-100">{(result.output.product as any).name}</h5>
                    <p className="text-xs text-zinc-500">
                      Trend: {(result.output.product as any).trend ?? "Rising"} · Est. Margin: {(result.output.product as any).estimatedMargin ?? "—"}
                    </p>
                    <p className="text-xs text-zinc-400 leading-relaxed border-t border-zinc-900 pt-2">
                      {(result.output.product as any).whyItWins}
                    </p>
                  </div>
                )}

                {activePipelineTab === "suppliers" && Array.isArray(result.output.suppliers) && (
                  <div className="space-y-2">
                    {(result.output.suppliers as any[]).map((s, idx) => (
                      <div key={idx} className="rounded bg-zinc-950 p-3 flex justify-between items-center text-xs border border-zinc-900">
                        <div>
                          <p className="font-medium text-zinc-200">{s.name}</p>
                          <p className="text-[10px] text-zinc-500 uppercase">Shipping: {s.shippingDays} days · Rating: {s.rating}★</p>
                        </div>
                        <span className="font-semibold text-emerald-400">${s.unitCost.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                )}

                {Boolean(activePipelineTab === "copy" && result.output.copy) && (
                  <div className="space-y-3 bg-zinc-950 p-4 rounded-lg border border-zinc-900 text-xs">
                    <div>
                      <span className="text-zinc-500 block uppercase mb-1">Generated Title</span>
                      <p className="text-zinc-200 font-medium">{(result.output.copy as any).title}</p>
                    </div>
                    <div className="border-t border-zinc-900 pt-2">
                      <span className="text-zinc-500 block uppercase mb-1">AI Description</span>
                      <p className="text-zinc-400 whitespace-pre-wrap">{(result.output.copy as any).description}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* RAW OUTPUT DUMP TOGGLE */}
            <details className="mt-4">
              <summary className="text-xs text-zinc-600 hover:text-zinc-400 cursor-pointer focus:outline-none select-none font-mono">
                View Raw JSON Output
              </summary>
              <pre className="mt-2 max-h-48 overflow-auto rounded-lg bg-zinc-950 p-4 text-[10px] text-zinc-400 border border-zinc-900">
                {JSON.stringify(result.output, null, 2)}
              </pre>
            </details>
          </div>
        ) : null}
      </div>
    </div>
  );
}
