import Link from "next/link";
import { DashboardStats } from "@/components/DashboardStats";
import { ModuleCard } from "@/components/ModuleCard";
import { automationModules } from "@/lib/automation/modules";

export default function OverviewPage() {
  const modules = automationModules.filter((m) => m.id !== "full-pipeline");

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-50">
          Command center
        </h1>
        <p className="mt-2 max-w-2xl text-zinc-400">
          Automate the repetitive work dropshippers do every day — from finding
          winning products to fulfilling orders. Connect APIs in Settings to go
          live; modules fall back to demo mode when keys are missing.
        </p>
      </header>

      <DashboardStats />

      <section className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-emerald-200">
              Run full autopilot
            </h2>
            <p className="mt-1 text-sm text-emerald-100/70">
              Research → supplier match → AI copy → export-ready bundle in one
              workflow.
            </p>
          </div>
          <Link
            href="/pipeline"
            className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-emerald-400"
          >
            Start workflow
          </Link>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-zinc-500">
          Automation modules
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {modules.map((module) => (
            <ModuleCard key={module.id} module={module} />
          ))}
        </div>
      </section>
    </div>
  );
}
