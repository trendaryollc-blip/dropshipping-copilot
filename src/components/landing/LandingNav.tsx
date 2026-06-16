"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { ArrowRight, Menu, X, Zap } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

const links = [
  { href: "#discovery", label: "Discovery" },
  { href: "#workflow", label: "Workflow" },
  { href: "#features", label: "Features" },
  { href: "#proof", label: "Proof" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
]

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? "border-b border-white/10 bg-white/70 shadow-[0_8px_40px_rgba(15,23,42,0.08)] backdrop-blur-2xl dark:bg-slate-950/60 dark:border-white/5 dark:shadow-none" : "border-b border-transparent bg-transparent"}`}>
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-3" onClick={() => setOpen(false)}>
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 via-fuchsia-500 to-amber-400 text-white shadow-lg shadow-fuchsia-500/25 transition-transform duration-300 group-hover:scale-105">
            <Zap className="size-5" />
          </div>
          <span className="text-lg font-black tracking-tight text-slate-950 dark:text-white">DropEase</span>
        </Link>

        <nav className="hidden items-center gap-1 rounded-full border border-white/40 bg-white/40 px-2 py-2 backdrop-blur-xl dark:border-white/10 dark:bg-white/5 md:flex">
          {links.map(link => (
            <a key={link.href} href={link.href} className="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-950/5 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          <Link href="/auth/login" className="rounded-full px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-950/5 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white">
            Sign in
          </Link>
          <Link href="/auth/register" className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-slate-950/15 transition-all hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-xl dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200">
            Start free
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <button type="button" onClick={() => setOpen(!open)} className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-white/40 text-slate-900 backdrop-blur-xl transition-colors hover:bg-white/70 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10 md:hidden" aria-label="Toggle menu">
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="border-y border-white/40 bg-white/90 px-4 py-4 shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/95 md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-2">
            {links.map(link => (
              <a key={link.href} href={link.href} onClick={() => setOpen(false)} className="rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/5">
                {link.label}
              </a>
            ))}
            <div className="mt-3 grid gap-3">
              <Link href="/auth/login" onClick={() => setOpen(false)} className="rounded-2xl border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/5">
                Sign in
              </Link>
              <Link href="/auth/register" onClick={() => setOpen(false)} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-amber-400 px-4 py-3 text-center text-sm font-bold text-white shadow-lg shadow-fuchsia-500/20">
                Start free
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
