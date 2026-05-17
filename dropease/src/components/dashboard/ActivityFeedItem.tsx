"use client"

import type { ReactNode } from "react"

interface ActivityFeedItemProps {
  icon: ReactNode
  title: string
  time: string
  accent: string
  badgeTextColor?: string
}

export function ActivityFeedItem({ icon, title, time, accent, badgeTextColor = "text-white" }: ActivityFeedItemProps) {
  return (
    <div className="group flex gap-4 rounded-[28px] border border-[#DDE6EE] bg-white p-4 shadow-[0_8px_36px_-20px_rgba(13,124,102,0.15)] transition duration-300 hover:-translate-y-1 hover:border-[#0D7C66]/25 hover:shadow-[0_12px_44px_-20px_rgba(13,124,102,0.22)]">
      <div className={`flex h-12 w-12 items-center justify-center rounded-3xl ${accent} text-white shadow-lg shadow-[rgba(0,0,0,0.10)] transition duration-300 group-hover:scale-105`}>
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-[#171D28]">{title}</p>
        <p className={`mt-2 text-xs ${badgeTextColor}`}>{time}</p>
      </div>
    </div>
  )
}


