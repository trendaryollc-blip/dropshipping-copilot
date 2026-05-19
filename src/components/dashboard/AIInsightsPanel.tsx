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
    <div className="rounded-[34px] border border-[#DDE6EE] bg-white p-5 shadow-[0_16px_52px_-20px_rgba(148,0,255,0.16)]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-[#0D7C66]/80">AI insights</p>
          <h2 className="mt-3 text-xl font-semibold text-[#171D28]">Smart suggestions for your next move</h2>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {insights.map((insight) => {
          const Icon = insight.icon
          return (
            <div key={insight.label} className="rounded-3xl border border-[#DDE6EE] bg-[#F4F7FB] p-4 text-[#171D28] transition hover:border-[#0D7C66]/25 hover:shadow-[0_8px_28px_-20px_rgba(13,124,102,0.20)]">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className={`flex h-12 w-12 items-center justify-center rounded-3xl bg-gradient-to-br ${insight.accent} text-white shadow-lg shadow-[rgba(0,0,0,0.12)]`}>
                    <Icon className="size-5" />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-[#52665E]">{insight.label}</p>
                    <p className="mt-1 text-lg font-semibold text-[#171D28]">{insight.value}</p>
                  </div>
                </div>
                <span className="text-xs uppercase tracking-[0.25em] text-[#A0AFBD]">AI</span>
              </div>
              <p className="mt-4 text-sm text-[#6783A0]">{insight.detail}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
