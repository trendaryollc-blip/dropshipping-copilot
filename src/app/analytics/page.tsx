"use client"

import dynamic from "next/dynamic"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

// Lazy-load the analytics dashboard
const AnalyticsDashboard = dynamic(
  () => import("@/components/dashboard/AIInsightsPanel").then((m) => m.AIInsightsPanel),
  {
    loading: () => (
      <div className="h-96 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    ),
    ssr: false,
  }
)

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* ═══ Hero Section ═══ */}
      <section className="relative overflow-hidden rounded-3xl border border-border/50 bg-card/60 p-6 backdrop-blur-sm sm:p-8 animate-in">
        <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-violet-500/5 blur-3xl" />
        <div className="absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-primary/5 blur-2xl" />

        <div className="relative z-10 flex flex-col gap-4">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-violet-600 dark:text-violet-400">
              <svg className="size-3" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
              Analytics
            </span>
            <h1 className="hero-title">Analytics Dashboard</h1>
            <p className="max-w-lg text-sm leading-relaxed text-muted-foreground/70">
              Monitor your store performance, customer insights, and sales trends.
            </p>
          </div>
        </div>
      </section>

      {/* Dashboard */}
      <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/60 p-5 backdrop-blur-sm animate-in delay-1">
        <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-primary/5 blur-xl transition-all duration-500 group-hover:scale-[2] group-hover:bg-primary/10" />
        <AnalyticsDashboard />
      </div>
    </div>
  )
}