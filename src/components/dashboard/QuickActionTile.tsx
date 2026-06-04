"use client"

import Link from "next/link"
import type { ReactNode } from "react"

interface QuickActionTileProps {
  href: string
  label: string
  desc: string
  icon: ReactNode
  accent: string
}

export function QuickActionTile({ href, label, desc, icon, accent }: QuickActionTileProps) {
  return (
    <Link href={href} className="group block rounded-[28px] border border-muted bg-card-bg p-5 shadow-[0_12px_40px_-24px_rgba(13,124,102,0.18)] transition duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_16px_48px_-20px_rgba(13,124,102,0.26)]">
      <div className="flex items-center justify-between gap-4">
        <div className={`flex h-12 w-12 items-center justify-center rounded-3xl ${accent} text-white shadow-lg transition duration-300 group-hover:scale-105`}>
          {icon}
        </div>
        <p className="rounded-full bg-primary-light/55 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-primary">Action</p>
      </div>
      <div className="mt-5">
        <h3 className="text-base font-semibold text-text-primary">{label}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
      </div>
    </Link>
  )
}
