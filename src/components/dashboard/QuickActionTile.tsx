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
    <Link href={href} className="group relative block overflow-hidden rounded-3xl border border-border/50 bg-card/60 p-5 backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:border-primary/20 hover:bg-card/80 animate-in card-interactive">
      {/* Hover gradient fill */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      
      {/* Top-right accent glow */}
      <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-primary/5 blur-xl transition-all duration-500 group-hover:scale-[2] group-hover:bg-primary/10" />

      <div className="relative z-10">
        <div className="flex items-start justify-between gap-3">
          <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${accent} text-white shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl`}>
            {icon}
          </div>
          <span className="inline-flex items-center gap-1 rounded-full border border-primary/10 bg-primary/5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-primary/70 transition-all duration-300 group-hover:border-primary/20 group-hover:bg-primary/10 group-hover:text-primary">
            <svg className="size-2.5" viewBox="0 0 10 10" fill="currentColor"><circle cx="5" cy="5" r="2"/></svg>
            Launch
          </span>
        </div>
        <div className="mt-4 space-y-1.5">
          <h3 className="text-sm font-bold text-foreground transition-colors duration-300 group-hover:text-primary">{label}</h3>
          <p className="text-xs leading-relaxed text-muted-foreground/70">{desc}</p>
        </div>
        
        {/* Bottom arrow indicator */}
        <div className="mt-3 flex items-center gap-1 text-[11px] font-medium text-primary/50 transition-all duration-300 group-hover:gap-2 group-hover:text-primary">
          <span>Explore</span>
          <svg className="size-3 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 12 12" fill="none"><path d="M2.5 6h7M6.5 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
      </div>
    </Link>
  )
}