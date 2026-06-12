import Link from "next/link"
import { Zap } from "lucide-react"

const footerLinks = [
  { href: "#discovery", label: "Discovery" },
  { href: "#workflow", label: "Workflow" },
  { href: "#features", label: "Features" },
  { href: "#proof", label: "Proof" },
]

export function LandingFooter() {
  return (
    <footer className="border-t border-white/40 bg-white/30 px-4 py-8 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.02] sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 via-fuchsia-500 to-amber-400 text-white shadow-lg shadow-fuchsia-500/20">
            <Zap className="size-4" />
          </div>
          <span className="text-sm font-black text-slate-950 dark:text-white">DropEase</span>
        </Link>

        <div className="flex flex-wrap items-center justify-center gap-5 text-sm font-bold text-slate-600 dark:text-slate-300">
          {footerLinks.map(link => (
            <a key={link.href} href={link.href} className="transition-colors hover:text-violet-500 dark:hover:text-violet-300">
              {link.label}
            </a>
          ))}
        </div>

        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          &copy; {new Date().getFullYear()} DropEase. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
