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
    <div className={`group relative overflow-hidden rounded-[28px] border border-border bg-card-solid p-6 shadow-[0_12px_44px_-24px_rgba(212,168,83,0.22)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_52px_-20px_rgba(212,168,83,0.30)] ${gradient}`}>
      <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-muted to-transparent opacity-50 blur-3xl" />
      <div className="relative z-10 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-muted-foreground">{title}</p>
          <p className="mt-4 text-3xl font-semibold tracking-tight text-foreground">{value}</p>
          {subtitle ? <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p> : null}
        </div>
        <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-muted text-primary shadow-lg shadow-[rgba(212,168,83,0.10)] transition group-hover:scale-105">
          {icon}
        </div>
      </div>
      <div className="mt-5 text-sm text-primary font-medium">{trend}</div>
    </div>
  )
}
