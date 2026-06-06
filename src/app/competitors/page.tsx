"use client"

import { Search, ShieldCheck } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { AIActionButton } from "@/components/AIActionButton"
import { toast } from "sonner"

export default function CompetitorsPage() {
  return (
    <div className="space-y-6">
      {/* ═══ Hero Section ═══ */}
      <section className="relative overflow-hidden rounded-3xl border border-border/50 bg-card/60 p-6 backdrop-blur-sm sm:p-8 animate-in">
        <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-violet-500/5 blur-3xl" />
        <div className="absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-primary/5 blur-2xl" />

        <div className="relative z-10 flex flex-col gap-4">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-violet-600 dark:text-violet-400">
              <ShieldCheck className="size-3" />
              Competitors
            </span>
            <h1 className="hero-title">Competitor Analysis</h1>
            <p className="max-w-lg text-sm leading-relaxed text-muted-foreground/70">
              Compare your products against top competitors and uncover opportunities.
            </p>
          </div>
        </div>
      </section>

      {/* Search & AI */}
      <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/60 p-5 backdrop-blur-sm animate-in delay-1">
        <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-primary/5 blur-xl transition-all duration-500 group-hover:scale-[2] group-hover:bg-primary/10" />
        <div className="relative z-10 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Search className="size-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Search Competitors</h3>
          </div>
          <Input placeholder={'e.g. "brand name" or "product category"'} className="h-9" />
          <Button className="w-full rounded-xl">Search</Button>

          <AIActionButton
            task="competitor_analysis"
            input={{ competitors: [] }}
            label="AI Insights"
            onSuccess={() => {
              toast.success("AI competitor insights ready")
            }}
          />
        </div>
      </div>

      {/* Placeholder for competitor cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="relative overflow-hidden rounded-xl border border-border/50 bg-card/60 p-4 backdrop-blur-sm animate-in delay-1">
            <div className="absolute -right-6 -top-6 h-12 w-12 rounded-full bg-primary/5 blur-xl" />
            <h4 className="font-semibold text-foreground mb-2">Competitor #{i}</h4>
            <p className="text-xs text-muted-foreground">Placeholder for competitor data and comparison charts.</p>
          </div>
        ))}
      </div>
    </div>
  )
}
