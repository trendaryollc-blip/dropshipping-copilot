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
    <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-card/60 p-5 backdrop-blur-sm">
      <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-primary/5 blur-2xl" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-accent">
            <BarChart3 className="size-3" />
            Insights
          </span>
        </div>
        <h2 className="mt-3 text-lg font-bold text-foreground">Analytics & momentum</h2>
      </div>

      <div className="relative z-10 mt-5 grid gap-3 sm:grid-cols-2">
        {insights.map((insight) => {
          const Icon = insight.icon
          return (
            <div key={insight.title} className="group rounded-2xl border border-border/30 bg-card/40 p-4 transition-all duration-300 hover:border-primary/15 hover:bg-card/60">
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary/15">
                  <Icon className="size-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-[13px] font-bold text-foreground">{insight.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground/70">{insight.detail}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}