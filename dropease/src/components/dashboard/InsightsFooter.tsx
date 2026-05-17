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
    <div className="rounded-[34px] border border-[#DDE6EE] bg-white p-5 shadow-[0_16px_52px_-24px_rgba(13,124,102,0.22)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-[#0D7C66]/80">Insights</p>
          <h2 className="mt-3 text-xl font-semibold text-[#171D28]">End-of-day analytics and momentum</h2>
          <p className="mt-2 max-w-xl text-sm text-[#6783A0]">
            A quick look at what is working now, with recommendations to keep your store growing.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {insights.map((insight) => {
          const Icon = insight.icon
          return (
            <div key={insight.title} className="rounded-3xl border border-[#DDE6EE] bg-[#F4F7FB] p-4 text-[#171D28] transition hover:border-[#0D7C66]/25 hover:shadow-[0_8px_28px_-20px_rgba(13,124,102,0.20)]">
              <div className="flex items-center gap-3 text-[#0D7C66]">
                <span className="flex h-11 w-11 items-center justify-center rounded-3xl bg-[#D4F0EE]/60 text-[#0D7C66]">
                  <Icon className="size-5" />
                </span>
                <div>
                  <p className="font-semibold text-[#171D28]">{insight.title}</p>
                </div>
              </div>
              <p className="mt-3 text-sm text-[#6783A0]">{insight.detail}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
