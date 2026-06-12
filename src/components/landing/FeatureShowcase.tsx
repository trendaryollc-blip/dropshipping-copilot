"use client"

import { useState } from "react"
import type { ComponentType } from "react"
import { BarChart3, BrainCircuit, FileText, Megaphone, Package, Store, Zap } from "lucide-react"
import { Reveal } from "./Reveal"

type Feature = {
  title: string
  desc: string
  icon: ComponentType<{ className?: string }>
  points: string[]
  color: string
}

const features: Feature[] = [
  { title: "AI product research", desc: "Discover high-potential products with demand, competition, and margin signals.", icon: BrainCircuit, color: "from-violet-600 via-fuchsia-500 to-amber-400", points: ["Trend detection", "Competition scoring", "Margin analysis"] },
  { title: "Supplier matching", desc: "Compare supplier reliability, shipping speed, and quote quality in one place.", icon: Package, color: "from-cyan-500 via-blue-500 to-violet-500", points: ["Verified suppliers", "Quote comparison", "Shipping estimate"] },
  { title: "Listing generation", desc: "Create product titles, descriptions, SEO copy, and ad angles instantly.", icon: FileText, color: "from-emerald-400 via-teal-400 to-cyan-500", points: ["SEO descriptions", "Ad copy", "Creative hooks"] },
  { title: "Marketing automation", desc: "Launch campaigns, recover carts, and send customer messages automatically.", icon: Megaphone, color: "from-rose-400 via-fuchsia-500 to-violet-500", points: ["Email campaigns", "SMS flows", "Cart recovery"] },
  { title: "Order automation", desc: "Track fulfillment, monitor inventory, and reduce manual order work.", icon: Zap, color: "from-amber-400 via-orange-500 to-rose-500", points: ["Auto-fulfillment", "Inventory alerts", "Status tracking"] },
  { title: "Business analytics", desc: "Understand revenue, profit, product momentum, and store performance.", icon: BarChart3, color: "from-indigo-500 via-violet-500 to-fuchsia-500", points: ["Profit dashboards", "Momentum scores", "Store insights"] },
]

export function FeatureShowcase() {
  const [activeIndex, setActiveIndex] = useState(0)
  const active = features[activeIndex]
  const Icon = active.icon

  return (
    <section id="features" className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <Reveal className="mx-auto max-w-7xl">
        <div className="mb-14 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="section-label">Complete dropshipping suite</p>
            <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-950 dark:text-white sm:text-5xl">
              Powerful features wrapped in a simple workflow.
            </h2>
          </div>
          <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-300">
            Click through the system to see how DropEase connects research, sourcing, listing, marketing, orders, and analytics into one AI-powered workspace.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="grid gap-4 sm:grid-cols-2">
            {features.map((feature, index) => {
              const FeatureIcon = feature.icon
              return (
                <button
                  key={feature.title}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={`landing-card-sheen group rounded-[1.75rem] border p-5 text-left transition-all duration-300 ${index === activeIndex ? "border-violet-300 bg-violet-500/10 shadow-xl shadow-violet-500/15 ring-1 ring-violet-500/25" : "border-white/40 bg-white/60 hover:-translate-y-1 hover:border-violet-200 dark:border-white/10 dark:bg-white/5 dark:hover:border-violet-800/60"}`}
                >
                  <div className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.color} text-white shadow-lg`}>
                    <FeatureIcon className="size-6" />
                  </div>
                  <h3 className="text-xl font-black text-slate-950 dark:text-white">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{feature.desc}</p>
                </button>
              )
            })}
          </div>

          <div className="rounded-[2rem] border border-white/40 bg-white/60 p-6 shadow-2xl shadow-slate-950/5 backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
            <div className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${active.color} text-white shadow-lg shadow-fuchsia-500/20`}>
              <Icon className="size-8" />
            </div>
            <p className="text-sm font-black uppercase tracking-[0.25em] text-violet-500">Active module</p>
            <h3 className="mt-3 text-3xl font-black text-slate-950 dark:text-white">{active.title}</h3>
            <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-300">{active.desc}</p>

            <div className="mt-8 space-y-4">
              {active.points.map(point => (
                <div key={point} className="flex items-center gap-3 rounded-2xl bg-slate-950/5 p-4 dark:bg-white/5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-300">
                    <Store className="size-4" />
                  </div>
                  <span className="font-bold text-slate-700 dark:text-slate-200">{point}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-[1.5rem] bg-slate-950 p-5 text-white">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">AI action stream</span>
                <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-black text-emerald-300">Live</span>
              </div>
              <div className="space-y-3">
                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-[82%] rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-amber-400 bg-[length:200%_100%] animate-[landingShimmer_2.4s_ease-in-out_infinite]" />
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-[64%] rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-amber-400 bg-[length:200%_100%] animate-[landingShimmer_2.4s_ease-in-out_infinite]" />
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-[74%] rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-amber-400 bg-[length:200%_100%] animate-[landingShimmer_2.4s_ease-in-out_infinite]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
