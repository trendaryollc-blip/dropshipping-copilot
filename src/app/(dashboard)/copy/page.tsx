"use client";

import { useEffect, useRef, useState } from "react";
import { AutomationRunner } from "@/components/AutomationRunner";
import type { AutomationJobResult } from "@/lib/automation/types";

export default function CopyPage() {
  const resultRef = useRef<AutomationJobResult | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [published, setPublished] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  function scheduleErrorClear(ms = 4000) {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setPublishError(null), ms);
  }

  async function handlePublish() {
    const result = resultRef.current;
    if (!result || !result.output?.title) {
      setPublishError("Generate listing copy first before publishing.");
      scheduleErrorClear(3000);
      return;
    }

    try {
      const res = await fetch("/api/automation/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: result.output.title,
          description: result.output.description,
          bulletPoints: result.output.bulletPoints,
          seoKeywords: result.output.seoKeywords,
        }),
      });
      if (res.ok) {
        setPublished(true);
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setPublished(false), 3000);
      } else {
        const data = await res.json().catch(() => ({}));
        setPublishError(data.message ?? "Publish failed. Connect Trendaryo in Settings.");
        scheduleErrorClear(4000);
      }
    } catch {
      setPublishError("Publish failed. Check your Trendaryo API settings.");
      scheduleErrorClear(4000);
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-zinc-50">Product copy</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Generate titles, bullets, and descriptions optimized for conversions.
        </p>
      </header>
      <AutomationRunner
        moduleId="copywriting"
        title="Generate listing copy"
        description="Generates real listing copy via OpenRouter when OPENROUTER_API_KEY is set in .env.local."
        fields={[
          {
            name: "productName",
            label: "Product name",
            placeholder: "USB neck fan",
          },
          {
            name: "tone",
            label: "Brand tone",
            placeholder: "friendly, premium, urgent",
          },
        ]}
        onResult={(r) => {
          resultRef.current = r;
          setPublished(false);
          setPublishError(null);
        }}
      />

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-zinc-200">Publish to Store</p>
          <p className="mt-1 text-xs text-zinc-500">
            Push generated title, description, and bullets to your Trendaryo store via API.
            Requires Trendaryo API credentials in Settings.
          </p>
          {publishError && (
            <p className="mt-1 text-xs text-red-400">{publishError}</p>
          )}
        </div>
        <button
          onClick={handlePublish}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
            published
              ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-300"
              : "bg-emerald-500 text-zinc-950 hover:bg-emerald-400"
          }`}
        >
          {published ? "Published!" : "Publish Listing"}
        </button>
      </div>
    </div>
  );
}
