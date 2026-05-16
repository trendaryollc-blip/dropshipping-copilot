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
    <div className={`group relative overflow-hidden rounded-[28px] border border-white/10 bg-slate-900/95 p-6 shadow-[0_30px_80px_-50px_rgba(0,255,186,0.35)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_90px_-40px_rgba(0,255,186,0.45)] ${gradient}`}>
      <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-white/5 to-transparent opacity-70 blur-3xl" />
      <div className="relative z-10 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-400">{title}</p>
          <p className="mt-4 text-3xl font-semibold tracking-tight text-white">{value}</p>
          {subtitle ? <p className="mt-2 text-sm text-slate-400">{subtitle}</p> : null}
        </div>
        <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-white/10 text-emerald-300 shadow-xl shadow-emerald-500/10 transition group-hover:scale-105">
          {icon}
        </div>
      </div>
      <div className="mt-5 text-sm text-emerald-300">{trend}</div>
    </div>
  )
}
