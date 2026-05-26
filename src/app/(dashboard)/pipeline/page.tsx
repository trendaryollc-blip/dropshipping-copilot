"use client";

import { useRef, useState } from "react";
import { AutomationRunner } from "@/components/AutomationRunner";
import { exportToCSV } from "@/lib/utils/export";
import { toast } from "@/components/Toast";
import type { AutomationJobResult } from "@/lib/automation/types";

export default function PipelinePage() {
  const resultRef = useRef<AutomationJobResult | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);

  function handleExportBundle() {
    const result = resultRef.current;
    if (!result || !result.output?.product) {
      toast("Run the full autopilot first to generate a bundle to export.", "info");
      return;
    }

    const product = result.output.product as Record<string, unknown>;
    const suppliers = (result.output.suppliers as Array<Record<string, unknown>>) ?? [];
    const copy = result.output.copy as Record<string, unknown> | undefined;

    const rows = [
      {
        product_name: product.name ?? "",
        niche: product.niche ?? "",
        score: product.score ?? "",
        trend: product.trend ?? "",
        estimated_margin: product.estimatedMargin ?? "",
        why_it_wins: product.whyItWins ?? "",
        top_supplier: suppliers[0]?.name ?? "",
        supplier_cost: suppliers[0]?.unitCost ?? "",
        supplier_platform: suppliers[0]?.platform ?? "",
        generated_title: copy?.title ?? "",
        generated_description: copy?.description ?? "",
      },
    ];

    exportToCSV("pipeline-bundle", rows);
    toast("Pipeline bundle exported.", "success");
  }

  async function handlePublish() {
    const result = resultRef.current;
    if (!result || !result.output?.product) {
      setPublishError("Run the full autopilot first before publishing.");
      setTimeout(() => setPublishError(null), 3000);
      return;
    }

    setPublishing(true);
    setPublishError(null);

    try {
      const copy = result.output.copy as Record<string, unknown> | undefined;
      const res = await fetch("/api/automation/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: copy?.title,
          description: copy?.description,
          bulletPoints: copy?.bullets ?? copy?.bulletPoints ?? [],
          product: result.output.product,
          suppliers: result.output.suppliers,
        }),
      });
      if (res.ok) {
        setPublished(true);
        setTimeout(() => setPublished(false), 3000);
      } else {
        const data = await res.json().catch(() => ({}));
        setPublishError(data.message ?? "Publish failed. Connect Trendaryo in Settings.");
        setTimeout(() => setPublishError(null), 4000);
      }
    } catch {
      setPublishError("Publish failed. Check your Trendaryo API settings.");
      setTimeout(() => setPublishError(null), 4000);
    } finally {
      setPublishing(false);
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-zinc-50">Full autopilot</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Runs product research, supplier matching, and copywriting in sequence.
          Requires OpenRouter for best results; CJ key improves supplier data.
        </p>
      </header>
      <AutomationRunner
        moduleId="full-pipeline"
        title="End-to-end launch workflow"
        description="Picks the top research result, finds suppliers, and drafts listing copy."
        fields={[
          {
            name: "query",
            label: "Niche or product idea",
            placeholder: "e.g. summer gadgets, pet accessories",
          },
        ]}
        onResult={(r) => { resultRef.current = r; }}
      />

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-zinc-200">Publish & Export Bundle</p>
          <p className="mt-1 text-xs text-zinc-500">
            Download the full pipeline result as CSV, or push the listing directly to your Trendaryo store.
          </p>
          {publishError && (
            <p className="mt-1 text-xs text-red-400">{publishError}</p>
          )}
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={handleExportBundle}
            className="rounded-lg border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-900 transition"
          >
            Export CSV
          </button>
          <button
            onClick={handlePublish}
            disabled={publishing}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition disabled:opacity-60 ${
              published
                ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-300"
                : "bg-emerald-500 text-zinc-950 hover:bg-emerald-400"
            }`}
          >
            {publishing ? "Publishing..." : published ? "Published!" : "Publish to Store"}
          </button>
        </div>
      </div>
    </div>
  );
}
