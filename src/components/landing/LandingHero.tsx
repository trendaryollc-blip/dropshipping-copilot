import Link from "next/link"
import { ArrowRight, ShieldCheck, Sparkles, TrendingUp, Zap } from "lucide-react"
import { Reveal } from "./Reveal"

export function LandingHero() {
  return (
    <section className="relative overflow-hidden px-4 pb-20 pt-32 sm:px-6 lg:px-8 lg:pb-28 lg:pt-40">
      <div className="absolute left-1/2 top-24 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-violet-500/20 blur-3xl" aria-hidden="true" />
      <div className="absolute right-0 top-80 h-[24rem] w-[24rem] rounded-full bg-fuchsia-500/15 blur-3xl" aria-hidden="true" />
      <div className="absolute bottom-0 left-10 h-[22rem] w-[22rem] rounded-full bg-amber-400/10 blur-3xl" aria-hidden="true" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <Reveal className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-sm font-bold text-violet-700 shadow-sm backdrop-blur-xl dark:border-violet-300/20 dark:text-violet-200">
            <Sparkles className="size-4" />
            AI dropshipping copilot for smarter scaling
          </div>

          <h1 className="max-w-4xl text-5xl font-black tracking-tight text-slate-950 dark:text-white sm:text-6xl lg:text-7xl">
            Find winning products before your competitors do.
          </h1>

          <p className="max-w-2xl text-lg leading-relaxed text-slate-600 dark:text-slate-300 sm:text-xl">
            DropEase turns product research, supplier matching, listing creation, and order automation into one intelligent workflow built for modern dropshippers.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/auth/register" className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-600 via-fuchsia-500 to-amber-400 px-8 py-4 text-base font-bold text-white shadow-2xl shadow-fuchsia-500/20 transition-all hover:-translate-y-1 hover:shadow-[0_28px_80px_rgba(217,70,239,0.28)]">
              Start building free
              <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <a href="#discovery" className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white/70 px-8 py-4 text-base font-bold text-slate-800 shadow-lg shadow-slate-950/5 backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-violet-200 hover:shadow-xl dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:border-violet-700/50">
              Watch the copilot work
            </a>
          </div>

          <div className="flex flex-wrap gap-4 text-sm font-semibold text-slate-600 dark:text-slate-300">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/60 px-4 py-2 shadow-sm ring-1 ring-slate-900/5 dark:bg-white/5 dark:ring-white/10">
              <ShieldCheck className="size-4 text-emerald-500" />
              No credit card required
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/60 px-4 py-2 shadow-sm ring-1 ring-slate-900/5 dark:bg-white/5 dark:ring-white/10">
              <Zap className="size-4 text-amber-500" />
              Launch in minutes
            </span>
          </div>
        </Reveal>

        <Reveal className="relative mx-auto w-full max-w-xl lg:ml-auto" delay={120}>
          <div className="relative mx-auto w-full max-w-xl">
            <div className="relative rounded-[2.5rem] border border-white/50 bg-white/80 shadow-2xl shadow-violet-500/15 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/80">
              <div className="flex items-center gap-2 border-b border-slate-200/60 px-5 py-3 dark:border-white/10">
                <div className="flex gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
                  <div className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
                </div>
                <div className="ml-3 rounded-md bg-slate-100 px-2.5 py-1 text-[0.65rem] font-bold text-slate-500 dark:bg-white/10 dark:text-slate-300">
                  DropEase — Dashboard
                </div>
              </div>
              <div className="grid grid-cols-[1.4fr_1fr]">
                <div className="border-r border-slate-200/60 p-4 dark:border-white/10">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="text-[0.65rem] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Winning Products</p>
                      <p className="text-lg font-black text-slate-950 dark:text-white">AI Research Feed</p>
                    </div>
                    <div className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-1 text-[0.65rem] font-black text-emerald-600 dark:text-emerald-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Live
                    </div>
                  </div>
                  <div className="space-y-3">
                    {[
                      { name: "Smart Pet Fountain", score: 96, margin: "42%", demand: 91, trend: "+184%", color: "from-emerald-300 to-teal-300" },
                      { name: "Mini Projector Pro", score: 93, margin: "38%", demand: 88, trend: "+156%", color: "from-violet-300 to-fuchsia-300" },
                      { name: "Ergonomic Pillow", score: 91, margin: "51%", demand: 84, trend: "+127%", color: "from-amber-300 to-orange-300" },
                    ].map((item, i) => (
                      <div key={item.name} className="rounded-xl border border-white/60 bg-white/80 p-2.5 dark:border-white/10 dark:bg-white/5">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-xs font-black text-slate-950 dark:text-white">{item.name}</p>
                            <div className="mt-1 flex gap-2">
                              <span className="text-[0.6rem] font-bold text-slate-500 dark:text-slate-400">Score: {item.score}</span>
                              <span className="text-[0.6rem] font-bold text-emerald-500">{item.margin} margin</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-0.5 rounded-full bg-emerald-500/10 px-1.5 py-0.5">
                            <TrendingUp className="size-2.5 text-emerald-500" />
                            <span className="text-[0.6rem] font-black text-emerald-600 dark:text-emerald-300">{item.trend}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-slate-950 p-4 text-white">
                  <p className="text-[0.65rem] font-black uppercase tracking-wider text-slate-400">AI Verdict</p>
                  <p className="mt-2 text-sm font-black">Smart Pet Fountain</p>
                  <div className="mt-4 space-y-3">
                    {[
                      { label: "Competition", value: 28 },
                      { label: "Demand growth", value: 91 },
                      { label: "Supplier fit", value: 98 },
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <div className="mb-1 flex items-center justify-between text-[0.6rem] font-bold text-slate-400">
                          <span>{label}</span>
                          <span>{value}%</span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                          <div className="h-full rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-amber-400" style={{ width: `${value}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 rounded-lg bg-white/10 p-2.5">
                    <div className="flex items-start gap-2">
                      <Sparkles className="mt-0.5 size-3 shrink-0 text-amber-300" />
                      <p className="text-[0.6rem] leading-relaxed text-slate-200">Generate listing, compare suppliers, launch in minutes.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
