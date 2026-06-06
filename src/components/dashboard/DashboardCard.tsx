"use client"

import type { ReactNode } from "react"

interface DashboardCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: ReactNode
  gradient: string
  trend: string
}

export function DashboardCard({ title, value, subtitle, icon, gradient, trend }: DashboardCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-border/50 bg-card/60 p-6 backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:border-primary/20 hover:bg-card/80 animate-in card-interactive">
      {/* Gradient overlay on hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-[0.04]`} />
      
      {/* Top accent line */}
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      
      {/* Decorative glow */}
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/5 blur-2xl transition-all duration-500 group-hover:scale-150 group-hover:bg-primary/10" />

      <div className="relative z-10">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground/70">{title}</p>
            <p className="text-3xl font-bold tracking-tight text-foreground font-mono">{value}</p>
            {subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}
          </div>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 text-primary transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/10">
            {icon}
          </div>
        </div>
        
        <div className="mt-4 flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
            <svg className="size-3" viewBox="0 0 12 12" fill="none"><path d="M6 2v8M3 5l3-3 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            {trend}
          </span>
        </div>
      </div>
    </div>
  )
}