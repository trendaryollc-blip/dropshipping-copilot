"use client"

import { ReactNode } from "react"
import { TrendingUp, TrendingDown } from "lucide-react"

type InsightPanelProps = {
  title: string
  description: string
  value: string
  trend: string
  icon: ReactNode
  trendColor?: "success" | "destructive" | "neutral"
}

export function InsightPanel({
  title,
  description,
  value,
  trend,
  icon,
  trendColor = "neutral"
}: InsightPanelProps) {
  return (
    <div className="rounded-xl border border-border/50 bg-card/60 p-5 backdrop-blur-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-md">
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-medium text-muted-foreground">{description}</h3>
          <p className="mt-0.5 text-xl font-bold text-foreground">{value}</p>
          <div className="mt-1.5 flex items-center gap-1.5">
            <span className="text-xs leading-relaxed text-muted-foreground/70">{trend}</span>
            {trendColor === "success" && (
              <TrendingUp className="size-3 text-emerald-500" />
            )}
            {trendColor === "destructive" && (
              <TrendingDown className="size-3 text-red-500" />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}