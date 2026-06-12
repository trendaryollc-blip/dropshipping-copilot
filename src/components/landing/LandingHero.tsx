import Link from "next/link"
import { ArrowRight, BarChart3, BrainCircuit, Cpu, PackageCheck, ShieldCheck, Sparkles, Zap } from "lucide-react"
import { Reveal } from "./Reveal"

const floatingCards = [
  { icon: BrainCircuit, title: "AI product score", value: "94/100", className: "lg:absolute lg:left-0 lg:top-10" },
  { icon: PackageCheck, title: "Supplier match", value: "98%", className: "lg:absolute lg:right-0 lg:top-16" },
  { icon: BarChart3, title: "Margin boost", value: "+37%", className: "lg:absolute lg:left-4 lg:bottom-14" },
  { icon: Cpu, title: "Auto listing", value: "Live", className: "lg:absolute lg:right-8 lg:bottom-6" },
]

export function LandingHero() {
  return (
    <section className="relative overflow-hidden px-4 pb-20 pt-32 sm:px-6 lg:px-8 lg:pb-28 lg:pt-40">
      <div className="absolute left-1/2 top-24 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-violet-500/20 blur-3xl" aria-hidden="true" />
      <div className="absolute right-0 top-80 h-[24rem] w-[24rem] rounded-full bg-fuchsia-500/15 blur-3xl" aria-hidden="true" />
      <div className="absolute bottom-0 left-10 h-[22rem] w-[22rem] rounded-full bg-amber-400/10 blur-3xl" aria-hidden="true" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.02fr_0.98fr]">
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
          <div className="relative mx-auto w-full max-w-xl lg:ml-auto">
            <div className="landing-hero-orbit absolute inset-0" aria-hidden="true">
              <div className="absolute inset-8 rounded-full border border-white/40 bg-white/10 shadow-2xl shadow-violet-500/20 backdrop-blur-3xl dark:border-white/10 dark:bg-white/5" />
              <div className="absolute inset-20 rounded-full border border-dashed border-violet-400/30" />
            </div>

            <div className="landing-hero-core absolute left-1/2 top-1/2 z-20 w-56 -translate-x-1/2 -translate-y-1/2 rounded-[2rem] border border-white/40 bg-white/80 p-6 text-center shadow-2xl shadow-violet-500/20 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/80">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 via-fuchsia-500 to-amber-400 shadow-lg shadow-fuchsia-500/25">
                <Zap className="size-8 text-white" />
              </div>
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">AI opportunity score</p>
              <p className="mt-3 text-7xl font-black tracking-tighter text-slate-950 dark:text-white">94</p>
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Winning product detected</p>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 lg:absolute lg:inset-0 lg:z-30 lg:mt-0">
              {floatingCards.map((card, index) => {
                const Icon = card.icon
                return (
                  <div key={card.title} className={`landing-float ${card.className} ${index % 2 ? "landing-float-delayed" : ""} w-full rounded-3xl border border-white/40 bg-white/75 p-4 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/80 lg:w-48`}>
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-600 dark:text-violet-300">
                        <Icon className="size-5" />
                      </div>
                      <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-black text-emerald-600 dark:text-emerald-300">Live</span>
                    </div>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{card.title}</p>
                    <p className="mt-1 text-2xl font-black text-slate-950 dark:text-white">{card.value}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
