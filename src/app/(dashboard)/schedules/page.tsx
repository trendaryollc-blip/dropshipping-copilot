import Link from "next/link";
import { AutomationPreferences } from "@/components/settings/AutomationPreferences";

export default function SchedulesPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold text-zinc-50">Schedules</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Configure automatic product research and run scans on demand. Results
          appear under Winning Products and in your dashboard stats.
        </p>
      </header>

      <AutomationPreferences />

      <section className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 text-sm text-zinc-400">
        <h2 className="font-medium text-zinc-200">Production cron (optional)</h2>
        <p className="mt-2">
          Set <code className="text-zinc-300">CRON_SECRET</code> in your env and
          call this URL on a schedule (e.g. daily via Vercel Cron or Windows Task
          Scheduler):
        </p>
        <pre className="mt-3 overflow-x-auto rounded-lg bg-zinc-950 p-3 text-xs text-zinc-300">
          GET /api/cron/research-scan{"\n"}
          Authorization: Bearer YOUR_CRON_SECRET
        </pre>
        <p className="mt-3">
          See{" "}
          <Link href="/settings" className="text-emerald-400 hover:text-emerald-300">
            Settings
          </Link>{" "}
          for API keys required by each automation.
        </p>
      </section>
    </div>
  );
}
