"use client"

import type { ReactNode } from "react"

interface ActivityFeedItemProps {
  icon: ReactNode
  title: string
  time: string
  accent: string
}

export function ActivityFeedItem({ icon, title, time, accent }: ActivityFeedItemProps) {
  return (
    <div className="group flex gap-4 rounded-[28px] border border-white/10 bg-slate-900/95 p-4 shadow-[0_20px_70px_-45px_rgba(0,0,0,0.45)] transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-slate-800/90">
      <div className={`flex h-12 w-12 items-center justify-center rounded-3xl ${accent} text-white shadow-lg shadow-slate-950/30 transition duration-300 group-hover:scale-105`}>
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-white">{title}</p>
        <p className="mt-2 text-xs text-slate-400">{time}</p>
      </div>
    </div>
  )
}
