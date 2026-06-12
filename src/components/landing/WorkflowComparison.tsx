import { CheckCircle2, XCircle } from "lucide-react"
import { Reveal } from "./Reveal"

const manualItems = [
  "Manually search multiple marketplaces",
  "Guess product demand from scattered data",
  "Compare suppliers one by one",
  "Write listings and ads from scratch",
  "Track orders, margins, and stock manually",
]

const easeItems = [
  "AI-ranked product opportunities",
  "Supplier reliability and shipping comparison",
  "Instant SEO descriptions and ad angles",
  "Automated order and inventory monitoring",
  "Profit, trend, and momentum dashboards",
]

export function WorkflowComparison() {
  return (
    <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <Reveal className="mx-auto max-w-7xl">
        <div className="mb-14 max-w-3xl text-center">
          <p className="section-label">Before vs after</p>
          <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-950 dark:text-white sm:text-5xl">
            Stop building your business around manual chaos.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-slate-600 dark:text-slate-300">
            DropEase replaces scattered tools and repetitive work with one intelligent command center.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-red-500/15 bg-red-500/5 p-6 sm:p-8">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-500">
                <XCircle className="size-6" />
              </div>
              <div>
                <p className="text-sm font-black uppercase tracking-[0.2em] text-red-500">Manual workflow</p>
                <h3 className="mt-1 text-2xl font-black text-slate-950 dark:text-white">Slow, scattered, risky</h3>
              </div>
            </div>
            <ul className="space-y-4">
              {manualItems.map(item => (
                <li key={item} className="flex items-start gap-3 rounded-2xl bg-white/50 p-4 dark:bg-white/5">
                  <XCircle className="mt-0.5 size-5 shrink-0 text-red-500" />
                  <span className="font-semibold leading-relaxed text-slate-700 dark:text-slate-200">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[2rem] border border-violet-500/20 bg-violet-500/10 p-6 shadow-2xl shadow-violet-500/10 sm:p-8">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 via-fuchsia-500 to-amber-400 text-white shadow-lg shadow-fuchsia-500/20">
                <CheckCircle2 className="size-6" />
              </div>
              <div>
                <p className="text-sm font-black uppercase tracking-[0.2em] text-violet-500">DropEase workflow</p>
                <h3 className="mt-1 text-2xl font-black text-slate-950 dark:text-white">Fast, connected, intelligent</h3>
              </div>
            </div>
            <ul className="space-y-4">
              {easeItems.map(item => (
                <li key={item} className="flex items-start gap-3 rounded-2xl bg-white/70 p-4 dark:bg-white/5">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-500" />
                  <span className="font-semibold leading-relaxed text-slate-700 dark:text-slate-200">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
