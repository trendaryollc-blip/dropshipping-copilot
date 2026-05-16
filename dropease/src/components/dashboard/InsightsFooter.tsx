"use client"

import { BarChart3, Sparkles, Heart, Star } from "lucide-react"

const insights = [
  {
    icon: BarChart3,
    title: "Weekly momentum",
    detail: "Revenue climbed 18% this week, driven by electronics and home goods.",
  },
  {
    icon: Sparkles,
    title: "Top product pick",
    detail: "Wireless Earbuds Pro remains the highest converting product.",
  },
  {
    icon: Heart,
    title: "Customer favorite",
    detail: "Beauty and wellness products show the strongest repeat demand.",
  },
  {
    icon: Star,
    title: "Motivation",
    detail: "Keep optimizing your top 3 suppliers and automate follow-up funnels.",
  },
]

export function InsightsFooter() {
  return (
    <div className="rounded-[34px] border border-white/10 bg-slate-950/95 p-5 shadow-[0_40px_90px_-60px_rgba(0,255,186,0.35)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-emerald-300/80">Insights</p>
          <h2 className="mt-3 text-xl font-semibold text-white">End-of-day analytics and momentum</h2>
          <p className="mt-2 max-w-xl text-sm text-slate-400">
            A quick look at what is working now, with recommendations to keep your store growing.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {insights.map((insight) => {
          const Icon = insight.icon
          return (
            <div key={insight.title} className="rounded-3xl border border-white/10 bg-slate-900/80 p-4 text-white transition hover:border-emerald-400/20 hover:bg-slate-800/90">
              <div className="flex items-center gap-3 text-emerald-300">
                <span className="flex h-11 w-11 items-center justify-center rounded-3xl bg-emerald-400/10 text-emerald-300">
                  <Icon className="size-5" />
                </span>
                <div>
                  <p className="font-semibold">{insight.title}</p>
                </div>
              </div>
              <p className="mt-3 text-sm text-slate-400">{insight.detail}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
