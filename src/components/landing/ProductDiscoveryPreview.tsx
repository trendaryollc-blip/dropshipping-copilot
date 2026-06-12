"use client"

import { useEffect, useMemo, useState } from "react"
import { ArrowUpRight, BrainCircuit, CheckCircle2, Flame, PackageSearch, Percent, Truck } from "lucide-react"
import { Reveal } from "./Reveal"

const products = [
  {
    name: "Smart Pet Water Fountain",
    category: "Home & Pets",
    margin: "42%",
    score: 96,
    demand: 91,
    gradient: "bg-gradient-to-br from-emerald-300 via-teal-300 to-cyan-300",
    insight: "Rising search demand with low ad saturation.",
  },
  {
    name: "Portable Mini Projector",
    category: "Tech",
    margin: "38%",
    score: 93,
    demand: 88,
    gradient: "bg-gradient-to-br from-violet-300 via-fuchsia-300 to-rose-300",
    insight: "High-ticket niche with strong social proof potential.",
  },
  {
    name: "Ergonomic Travel Pillow",
    category: "Travel",
    margin: "51%",
    score: 91,
    demand: 84,
    gradient: "bg-gradient-to-br from-amber-200 via-orange-300 to-rose-300",
    insight: "Seasonal spike detected across multiple markets.",
  },
]

const signals = [
  { icon: Flame, label: "Trend velocity", value: "+184%" },
  { icon: Percent, label: "Avg. margin", value: "43.6%" },
  { icon: Truck, label: "Supplier fit", value: "98%" },
]

export function ProductDiscoveryPreview() {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const id = window.setInterval(() => {
      setActiveIndex(current => (current + 1) % products.length)
    }, 3600)

    return () => window.clearInterval(id)
  }, [])

  const activeProduct = useMemo(() => products[activeIndex], [activeIndex])

  return (
    <section id="discovery" className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <Reveal className="mx-auto max-w-7xl">
        <div className="mb-12 max-w-3xl">
          <p className="section-label">Product discovery engine</p>
          <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-950 dark:text-white sm:text-5xl">
            A live dashboard that shows opportunities, not just products.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-slate-600 dark:text-slate-300">
            DropEase scans demand, competition, margins, and supplier reliability so you can focus on products with the highest chance to sell.
          </p>
        </div>

        <div className="relative rounded-[2rem] border border-white/40 bg-white/55 p-3 shadow-2xl shadow-violet-500/15 backdrop-blur-2xl dark:border-white/10 dark:bg-white/5">
          <div className="landing-scan absolute inset-x-4 top-4 h-px bg-gradient-to-r from-transparent via-fuchsia-400/80 to-transparent" aria-hidden="true" />
          <div className="rounded-[1.5rem] border border-white/40 bg-white/75 p-4 dark:border-white/10 dark:bg-slate-950/70 sm:p-6">
            <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 via-fuchsia-500 to-amber-400 text-white shadow-lg shadow-fuchsia-500/20">
                  <PackageSearch className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-500 dark:text-slate-400">AI Research Feed</p>
                  <h3 className="text-xl font-black text-slate-950 dark:text-white">Winning product candidates</h3>
                </div>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2 text-sm font-bold text-emerald-600 dark:text-emerald-300">
                <span className="landing-live-dot h-2 w-2 rounded-full bg-emerald-500" />
                Scanning 50K+ products
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-[1fr_22rem]">
              <div className="grid gap-4 md:grid-cols-2">
                {products.map((product, index) => (
                  <button
                    key={product.name}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={`landing-card-sheen group relative overflow-hidden rounded-3xl border p-4 text-left transition-all duration-300 ${index === activeIndex ? "border-violet-300 bg-violet-500/10 shadow-xl shadow-violet-500/15 ring-1 ring-violet-500/25" : "border-white/50 bg-white/60 hover:-translate-y-1 hover:border-violet-200 dark:border-white/10 dark:bg-white/5 dark:hover:border-violet-800/60"}`}
                  >
                    <div className={`relative mb-4 h-36 overflow-hidden rounded-2xl ${product.gradient}`}>
                      <span className="absolute left-3 top-3 rounded-full bg-white/85 px-3 py-1 text-xs font-black text-slate-950 dark:bg-slate-950/80 dark:text-white">{product.category}</span>
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.85),transparent_32%)]" aria-hidden="true" />
                    </div>
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div>
                        <h4 className="font-black text-slate-950 dark:text-white">{product.name}</h4>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{product.insight}</p>
                      </div>
                      <ArrowUpRight className="size-5 shrink-0 text-violet-500" />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="rounded-2xl bg-white/70 p-3 dark:bg-white/5">
                        <p className="text-[0.65rem] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Score</p>
                        <p className="mt-1 text-lg font-black text-slate-950 dark:text-white">{product.score}</p>
                      </div>
                      <div className="rounded-2xl bg-white/70 p-3 dark:bg-white/5">
                        <p className="text-[0.65rem] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Margin</p>
                        <p className="mt-1 text-lg font-black text-slate-950 dark:text-white">{product.margin}</p>
                      </div>
                      <div className="rounded-2xl bg-white/70 p-3 dark:bg-white/5">
                        <p className="text-[0.65rem] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Demand</p>
                        <p className="mt-1 text-lg font-black text-slate-950 dark:text-white">{product.demand}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="rounded-[1.75rem] border border-white/20 bg-slate-950 p-5 text-white shadow-2xl dark:bg-slate-950">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/20 text-violet-200">
                    <BrainCircuit className="size-6" />
                  </div>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-wide">AI verdict</span>
                </div>

                <p className="text-sm font-semibold text-slate-400">Best opportunity</p>
                <h4 className="mt-2 text-2xl font-black">{activeProduct.name}</h4>
                <p className="mt-3 text-sm leading-relaxed text-slate-300">{activeProduct.insight}</p>

                <div className="mt-6 space-y-5">
                  {[
                    ["Competition", 28],
                    ["Demand growth", activeProduct.demand],
                    ["Supplier reliability", 98],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <div className="mb-2 flex items-center justify-between text-xs font-bold text-slate-400">
                        <span>{label}</span>
                        <span>{value}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-white/10">
                        <div className="h-full rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-amber-400 transition-all duration-500" style={{ width: `${value}%` }} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-3xl bg-white/10 p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-300" />
                    <p className="text-sm leading-relaxed text-slate-200">Recommended next action: generate listing copy, compare supplier quotes, and add this product to your launch pipeline.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {signals.map(signal => {
                const Icon = signal.icon
                return (
                  <div key={signal.label} className="rounded-3xl border border-white/40 bg-white/60 p-4 dark:border-white/10 dark:bg-white/5">
                    <div className="mb-3 flex items-center justify-between">
                      <Icon className="size-5 text-violet-500" />
                      <span className="text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">Live</span>
                    </div>
                    <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{signal.label}</p>
                    <p className="mt-1 text-2xl font-black text-slate-950 dark:text-white">{signal.value}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
