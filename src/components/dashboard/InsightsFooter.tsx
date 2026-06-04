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
    <div className="rounded-[34px] border border-muted bg-card-bg p-5 shadow-[0_16px_52px_-24px_rgba(13,124,102,0.22)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-primary/80">Insights</p>
          <h2 className="mt-3 text-xl font-semibold text-text-primary">End-of-day analytics and momentum</h2>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            A quick look at what is working now, with recommendations to keep your store growing.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {insights.map((insight) => {
          const Icon = insight.icon
          return (
            <div key={insight.title} className="rounded-3xl border border-muted bg-card-solid p-4 text-text-primary transition hover:border-primary/25 hover:shadow-[0_8px_28px_-20px_rgba(13,124,102,0.20)]">
              <div className="flex items-center gap-3 text-primary">
                <span className="flex h-11 w-11 items-center justify-center rounded-3xl bg-primary-light/60 text-primary">
                  <Icon className="size-5" />
                </span>
                <div>
                  <p className="font-semibold text-text-primary">{insight.title}</p>
                </div>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{insight.detail}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
