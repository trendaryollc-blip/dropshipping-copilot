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
    <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-card/60 p-5 backdrop-blur-sm">
      {/* Decorative glow */}
      <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-accent/5 blur-2xl" />

      <div className="relative z-10">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-primary">
            <Sparkles className="size-3" />
            AI Insights
          </span>
        </div>
        <h2 className="mt-3 text-lg font-bold text-foreground">Smart suggestions</h2>

        <div className="mt-5 space-y-3">
          {insights.map((insight, i) => {
            const Icon = insight.icon
            return (
              <div key={insight.label} className={`group/item relative rounded-2xl border border-border/30 bg-card/40 p-4 transition-all duration-300 hover:border-primary/15 hover:bg-card/60 animate-in delay-${i + 1}`}>
                <div className="flex items-start gap-3">
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${insight.accent} text-white shadow-md transition-transform duration-300 group-hover/item:scale-110`}>
                    <Icon className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-medium text-muted-foreground/60">{insight.label}</p>
                    <p className="mt-0.5 text-sm font-bold text-foreground">{insight.value}</p>
                    <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground/70">{insight.detail}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}