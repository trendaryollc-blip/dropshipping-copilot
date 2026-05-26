"use client";

import { useEffect, useState } from "react";

interface WorkflowStep { id: string; type: string; name: string; config: string }
interface Workflow { id: string; name: string; description: string; trigger: string; isActive: boolean; runCount: number; steps?: WorkflowStep[] }

const defaultSteps: WorkflowStep[] = [
  { id: "trigger", type: "trigger", name: "Trigger received", config: "{}" },
  { id: "condition", type: "condition", name: "Check order risk", config: "{\"risk\":\"low\"}" },
  { id: "action", type: "action", name: "Create supplier order", config: "{}" },
];

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [name, setName] = useState("");
  const [trigger, setTrigger] = useState("new_order");
  const [selected, setSelected] = useState<Workflow | null>(null);
  const [stepDraft, setStepDraft] = useState<WorkflowStep>({ id: "", type: "action", name: "", config: "{}" });

  useEffect(() => {
    fetch("/api/workflows").then((response) => response.json()).then((data) => setWorkflows((data.workflows ?? []).map((workflow: Workflow) => ({ ...workflow, steps: workflow.steps ?? defaultSteps }))));
  }, []);

  async function addWorkflow() {
    if (!name) return;
    const workflow = { name, trigger, description: "Custom placeholder workflow builder rule", isActive: true, runCount: 0, steps: defaultSteps };
    await fetch("/api/workflows", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(workflow) });
    setWorkflows((current) => [{ id: `workflow-${Date.now()}`, ...workflow }, ...current]);
    setName("");
  }

  function addStep() {
    if (!selected || !stepDraft.name) return;
    const step = { ...stepDraft, id: stepDraft.id || `step-${Date.now()}` };
    const updated = { ...selected, steps: [...(selected.steps ?? []), step] };
    setSelected(updated);
    setWorkflows((current) => current.map((workflow) => workflow.id === updated.id ? updated : workflow));
    setStepDraft({ id: "", type: "action", name: "", config: "{}" });
  }

  return (
    <div className="space-y-8">
      <header><h1 className="text-3xl font-semibold tracking-tight text-zinc-50">Workflow builder</h1><p className="mt-1.5 text-sm text-zinc-400">Build trigger, condition, delay, and action flows with placeholder retry-ready execution logs.</p></header>
      <section className="grid gap-3 rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 sm:grid-cols-[1fr_auto_auto]">
        <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Workflow name" className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm" />
        <select value={trigger} onChange={(event) => setTrigger(event.target.value)} className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"><option value="new_order">New order</option><option value="low_stock">Low stock</option><option value="schedule">Schedule</option><option value="webhook">Webhook</option></select>
        <button onClick={addWorkflow} className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-zinc-950">Add workflow</button>
      </section>
      <section className="grid gap-4 md:grid-cols-2">
        {workflows.map((workflow) => <article key={workflow.id} className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5"><div className="flex justify-between gap-3"><h2 className="font-medium text-zinc-100">{workflow.name}</h2><span className={workflow.isActive ? "text-xs text-emerald-300" : "text-xs text-zinc-500"}>{workflow.isActive ? "Active" : "Paused"}</span></div><p className="mt-2 text-sm text-zinc-400">{workflow.description}</p><p className="mt-4 text-xs text-zinc-500">Trigger: {workflow.trigger} · Runs: {workflow.runCount} · Steps: {workflow.steps?.length ?? 0}</p><button onClick={() => setSelected(workflow)} className="mt-4 rounded-lg border border-zinc-700 px-3 py-2 text-sm">Edit flow</button></article>)}
      </section>
      {selected && <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 p-4"><div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl border border-zinc-800 bg-zinc-900 p-6"><div className="flex justify-between border-b border-zinc-800 pb-3"><h2 className="text-lg font-medium text-zinc-50">{selected.name}</h2><button onClick={() => setSelected(null)}>Close</button></div><div className="mt-5 space-y-3">{(selected.steps ?? []).map((step, index) => <div key={step.id} className="rounded-lg bg-zinc-950 p-3"><p className="text-xs uppercase text-zinc-500">Step {index + 1} · {step.type}</p><p className="mt-1 text-sm text-zinc-100">{step.name}</p><code className="mt-2 block rounded bg-zinc-900 p-2 text-xs text-zinc-400">{step.config}</code></div>)}</div><div className="mt-5 grid gap-2 sm:grid-cols-4"><select value={stepDraft.type} onChange={(event) => setStepDraft({ ...stepDraft, type: event.target.value })} className="rounded border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"><option value="action">Action</option><option value="condition">Condition</option><option value="delay">Delay</option></select><input value={stepDraft.name} onChange={(event) => setStepDraft({ ...stepDraft, name: event.target.value })} placeholder="Step name" className="rounded border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm sm:col-span-2" /><button onClick={addStep} className="rounded bg-emerald-500 px-3 py-2 text-sm text-zinc-950">Add step</button></div></div></div>}
    </div>
  );
}
