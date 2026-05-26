"use client";

import { useState, useEffect } from "react";
import { toast } from "@/components/Toast";

interface PromptTemplate {
  id: string;
  moduleId: string;
  name: string;
  systemPrompt: string;
  userPromptTemplate: string;
  temperature?: number;
  createdAt: string;
}

const MODULES = [
  { value: "product-research", label: "Product Research" },
  { value: "suppliers", label: "Supplier Match" },
  { value: "copywriting", label: "Product Copy" },
  { value: "orders", label: "Order Fulfillment" },
  { value: "full-pipeline", label: "Full Autopilot" },
];

const MODULE_DEFAULTS: Record<string, { systemPrompt: string; userPromptTemplate: string }> = {
  "product-research": {
    systemPrompt: "You are an expert product researcher analyzing dropshipping opportunities.",
    userPromptTemplate: "Research winning products for: {query}. Find products with high demand, good margins, and strong winning criteria.",
  },
  copywriting: {
    systemPrompt: "You are an expert e-commerce copywriter specializing in high-conversion product listings.",
    userPromptTemplate: "Write conversion-optimized listing copy for: {productName}. Tone: {tone}",
  },
  suppliers: {
    systemPrompt: "You are an expert sourcing analyst finding the best dropshipping suppliers.",
    userPromptTemplate: "Find suppliers for product: {productName}",
  },
};

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<PromptTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    moduleId: "copywriting",
    name: "",
    systemPrompt: "",
    userPromptTemplate: "",
    temperature: 0.5,
  });

  useEffect(() => { loadTemplates(); }, []);

  async function loadTemplates() {
    try {
      const res = await fetch("/api/templates");
      if (res.ok) {
        const data = await res.json();
        setTemplates(data.templates ?? []);
      }
    } catch (err) {
      console.error("Failed to load templates:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!form.name.trim() || !form.systemPrompt.trim() || !form.userPromptTemplate.trim()) {
      toast("All fields are required.", "error");
      return;
    }
    setSaving(true);
    try {
      const res = editingId
        ? await fetch("/api/templates", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: editingId, ...form }),
          })
        : await fetch("/api/templates", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
          });

      if (res.ok) {
        toast(editingId ? "Template updated." : "Template saved.", "success");
        setShowForm(false);
        setEditingId(null);
        resetForm();
        await loadTemplates();
      } else {
        const data = await res.json();
        toast(data.error ?? "Save failed.", "error");
      }
    } catch {
      toast("Failed to save template.", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this template?")) return;
    const res = await fetch(`/api/templates?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      setTemplates((prev) => prev.filter((t) => t.id !== id));
      toast("Template deleted.", "success");
    }
  }

  function startEdit(t: PromptTemplate) {
    setEditingId(t.id);
    setForm({
      moduleId: t.moduleId,
      name: t.name,
      systemPrompt: t.systemPrompt,
      userPromptTemplate: t.userPromptTemplate,
      temperature: t.temperature ?? 0.5,
    });
    setShowForm(true);
  }

  function resetForm() {
    setForm({ moduleId: "copywriting", name: "", systemPrompt: "", userPromptTemplate: "", temperature: 0.5 });
    setEditingId(null);
  }

  function applyDefault() {
    const def = MODULE_DEFAULTS[form.moduleId];
    if (def) {
      setForm((p) => ({ ...p, systemPrompt: def.systemPrompt, userPromptTemplate: def.userPromptTemplate }));
    }
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-50">Prompt Templates</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Save and manage custom system prompts and user templates per automation module.
          </p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditingId(null); resetForm(); }}
          className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-emerald-400"
        >
          New Template
        </button>
      </header>

      {showForm && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-5">
          <div className="flex flex-wrap gap-4">
            <div className="w-48">
              <label className="block text-sm text-zinc-300 mb-1">Module</label>
              <select
                value={form.moduleId}
                onChange={(e) => setForm((p) => ({ ...p, moduleId: e.target.value }))}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
              >
                {MODULES.map((m) => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            </div>
            <div className="flex-1 min-w-0">
              <label className="block text-sm text-zinc-300 mb-1">Template Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="e.g. High-conversion dropship copy v2"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600"
                maxLength={100}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm text-zinc-300">System Prompt</label>
              <button onClick={applyDefault} className="text-xs text-emerald-400 hover:text-emerald-300">
                Apply default for module
              </button>
            </div>
            <textarea
              value={form.systemPrompt}
              onChange={(e) => setForm((p) => ({ ...p, systemPrompt: e.target.value }))}
              rows={3}
              maxLength={5000}
              placeholder="You are an expert e-commerce copywriter..."
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 resize-y"
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-300 mb-1">User Prompt Template</label>
            <textarea
              value={form.userPromptTemplate}
              onChange={(e) => setForm((p) => ({ ...p, userPromptTemplate: e.target.value }))}
              rows={3}
              maxLength={5000}
              placeholder="Write copy for: {productName}. Tone: {tone}"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 resize-y"
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="text-sm text-zinc-300">Temperature</label>
            <input
              type="range"
              min={0}
              max={1}
              step={0.1}
              value={form.temperature}
              onChange={(e) => setForm((p) => ({ ...p, temperature: parseFloat(e.target.value) }))}
              className="flex-1"
            />
            <span className="text-xs text-zinc-400 w-8 text-right">{form.temperature}</span>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-emerald-400 disabled:opacity-50"
            >
              {saving ? "Saving..." : editingId ? "Update Template" : "Save Template"}
            </button>
            <button
              onClick={() => { setShowForm(false); setEditingId(null); }}
              className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl border border-zinc-800 bg-zinc-900/20" />
          ))}
        </div>
      ) : templates.length === 0 && !showForm ? (
        <div className="rounded-xl border border-dashed border-zinc-800 p-12 text-center">
          <p className="text-sm text-zinc-500">
            No templates saved yet. Create one to override defaults per module.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {templates.map((t) => (
            <div key={t.id} className="rounded-xl border border-zinc-800 bg-zinc-900/20 p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-zinc-100 text-sm">{t.name}</p>
                    <span className="rounded bg-zinc-800 px-2 py-0.5 text-[10px] text-zinc-400">
                      {MODULES.find((m) => m.value === t.moduleId)?.label ?? t.moduleId}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-zinc-500 line-clamp-1">
                    System: {t.systemPrompt.slice(0, 80)}...
                  </p>
                  <p className="mt-0.5 text-xs text-zinc-600 line-clamp-1">
                    Prompt: {t.userPromptTemplate.slice(0, 80)}...
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => startEdit(t)}
                    className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(t.id)}
                    className="rounded-lg border border-red-800 px-3 py-1.5 text-xs text-red-400 hover:bg-red-950/30"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
