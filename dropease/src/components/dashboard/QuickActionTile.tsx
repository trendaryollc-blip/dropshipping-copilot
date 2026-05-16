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
    <Link href={href} className="group block rounded-[28px] border border-white/10 bg-slate-900/90 p-5 shadow-[0_20px_60px_-40px_rgba(0,0,0,0.45)] transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-slate-800/90">
      <div className="flex items-center justify-between gap-4">
        <div className={`flex h-12 w-12 items-center justify-center rounded-3xl ${accent} text-white shadow-lg shadow-slate-950/30 transition duration-300 group-hover:scale-105`}>
          {icon}
        </div>
        <p className="rounded-full bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-slate-300">Action</p>
      </div>
      <div className="mt-5">
        <h3 className="text-base font-semibold text-white">{label}</h3>
        <p className="mt-2 text-sm text-slate-400">{desc}</p>
      </div>
    </Link>
  )
}
