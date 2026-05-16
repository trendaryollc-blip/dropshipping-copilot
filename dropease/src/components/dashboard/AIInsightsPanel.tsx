"use client"

import { TrendingUp, ShieldCheck, Sparkles } from "lucide-react"

const insights = [
  {
    label: "Trending product",
    value: "Wireless Earbuds Pro",
    detail: "High demand, low competition, 40% margin potential.",
    accent: "from-cyan-400 to-emerald-400",
    icon: TrendingUp,
  },
  {
    label: "Supplier reliability",
    value: "TechSupply Co",
    detail: "95% on-time delivery with fast response rates.",
    accent: "from-violet-500 to-fuchsia-500",
    icon: ShieldCheck,
  },
  {
    label: "AI recommendation",
    value: "Cross-sell skin care bundles",
    detail: "Suggested for customers who bought wellness products.",
    accent: "from-emerald-400 to-teal-400",
    icon: Sparkles,
  },
]

export function AIInsightsPanel() {
  return (
    <div className="rounded-[34px] border border-white/10 bg-slate-950/95 p-5 shadow-[0_40px_90px_-60px_rgba(148,0,255,0.25)]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-fuchsia-300/80">AI insights</p>
          <h2 className="mt-3 text-xl font-semibold text-white">Smart suggestions for your next move</h2>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {insights.map((insight) => {
          const Icon = insight.icon
          return (
            <div key={insight.label} className="rounded-3xl border border-white/10 bg-slate-900/80 p-4 text-white transition hover:border-fuchsia-400/20 hover:bg-slate-800/90">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className={`flex h-12 w-12 items-center justify-center rounded-3xl bg-gradient-to-br ${insight.accent} text-white shadow-lg shadow-slate-950/30`}>
                    <Icon className="size-5" />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-slate-300">{insight.label}</p>
                    <p className="mt-1 text-lg font-semibold text-white">{insight.value}</p>
                  </div>
                </div>
                <span className="text-xs uppercase tracking-[0.25em] text-slate-500">AI</span>
              </div>
              <p className="mt-4 text-sm text-slate-400">{insight.detail}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
