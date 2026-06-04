"use client"

import type { ReactNode } from "react"

interface ActivityFeedItemProps {
  icon: ReactNode
  title: string
  time: string
  accent: string
  badgeTextColor?: string
}

export function ActivityFeedItem({ icon, title, time, accent, badgeTextColor = "text-muted-foreground" }: ActivityFeedItemProps) {
  return (
    <div className="group flex gap-4 rounded-[28px] border border-muted bg-card-bg p-4 shadow-[0_8px_36px_-20px_rgba(13,124,102,0.15)] transition duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-[0_12px_44px_-20px_rgba(13,124,102,0.22)]">
      <div className={`flex h-12 w-12 items-center justify-center rounded-3xl ${accent} text-white shadow-lg transition duration-300 group-hover:scale-105`}>
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-text-primary">{title}</p>
        <p className={`mt-2 text-xs ${badgeTextColor}`}>{time}</p>
      </div>
    </div>
  )
}
