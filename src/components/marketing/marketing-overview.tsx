"use client"

import { Megaphone, TrendingUp, Target, BarChart3, Zap } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import Link from "next/link"

const MARKETING_TOOLS = [
  {
    href: "/campaigns",
    icon: Megaphone,
    label: "Ad Campaigns",
    description: "Create and manage advertising campaigns across Google, Meta, and TikTok.",
    color: "text-indigo-700",
    bg: "bg-indigo-100",
    badge: "Ads",
  },
  {
    href: "/trends",
    icon: TrendingUp,
    label: "Niche Trends",
    description: "Discover trending products and emerging market opportunities.",
    color: "text-emerald-600",
    bg: "bg-emerald-100",
    badge: "Insights",
  },
  {
    href: "/competitors",
    icon: Target,
    label: "Competitor Tracker",
    description: "Monitor competitor pricing, products, and market positioning.",
    color: "text-amber-600",
    bg: "bg-amber-100",
    badge: "Analysis",
  },
]

export function MarketingOverview() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl border border-border/50 bg-card/60 p-6 backdrop-blur-sm sm:p-8 animate-in">
        <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-violet-500/5 blur-3xl" />
        <div className="absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-primary/5 blur-2xl" />

        <div className="relative z-10 flex flex-col gap-4">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-violet-600 dark:text-violet-400">
              <Megaphone className="size-3" />
              Marketing
            </span>
            <h1 className="hero-title">Marketing Suite</h1>
            <p className="max-w-lg text-sm leading-relaxed text-muted-foreground/70">
              Drive sales with targeted campaigns, trend insights, and competitive intelligence.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Overview */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Active Campaigns", value: 7, icon: Megaphone, color: "bg-primary/10 text-primary" },
          { label: "Monthly Spend", value: "$1.2k", icon: BarChart3, color: "bg-emerald-500/10 text-emerald-600" },
          { label: "Avg. ROAS", value: "3.8x", icon: TrendingUp, color: "bg-amber-500/10 text-amber-600" },
          { label: "Conversions", value: "142", icon: Target, color: "bg-indigo-500/10 text-indigo-600" },
        ].map(({ label, value, icon: Icon, color }, i) => (
          <div key={label} className={`stat-card card-interactive animate-in delay-${Math.min(i % 8 + 1, 8)}`}>
            <div className={cn("flex size-9 items-center justify-center rounded-lg", color)}>
              <Icon className="size-4" />
            </div>
            <div>
              <p className="text-xl font-bold">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Marketing Tools Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Marketing Tools</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MARKETING_TOOLS.map((tool) => {
            const Icon = tool.icon
            return (
              <Link
                key={tool.href}
                href={tool.href}
                className="group relative overflow-hidden rounded-2xl border bg-card/60 p-5 backdrop-blur-sm transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={cn("flex size-9 items-center justify-center rounded-xl", tool.bg, tool.color)}>
                      <Icon className="size-4" />
                    </div>
                    <Badge variant="secondary" className="text-[9px] font-bold uppercase tracking-wide">
                      {tool.badge}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">{tool.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                      {tool.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-medium text-primary/80 group-hover:text-primary transition-colors">
                    Open Tool <Zap className="size-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}