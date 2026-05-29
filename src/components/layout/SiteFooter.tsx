"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const FOOTER_LINKS = [
  { href: "/settings", label: "Settings" },
  { href: "/account", label: "Account" },
  { href: "/templates", label: "Templates" },
  { href: "/workflows", label: "Workflows" },
];

const QUICK_LINKS = [
  { href: "/research", label: "Product Research" },
  { href: "/orders", label: "Order Management" },
  { href: "/analytics", label: "Analytics" },
  { href: "/billing", label: "Billing" },
];

export function SiteFooter() {
  const pathname = usePathname();

  return (
    <footer className="border-t border-zinc-800/80 bg-zinc-950/50 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        {/* Main Footer Content */}
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 text-xs font-bold text-emerald-400 ring-1 ring-emerald-500/20">
              D
            </div>
            <div>
              <p className="text-xs font-medium text-zinc-400">Dropship Autopilot</p>
              <p className="text-[10px] text-zinc-600">Automate your store operations</p>
            </div>
          </div>

          {/* Quick Links */}
          <nav className="flex flex-wrap items-center justify-center gap-4">
            {QUICK_LINKS.map((link) => {
              const active = pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    text-xs transition-colors
                    ${active ? "text-emerald-400" : "text-zinc-500 hover:text-zinc-300"}
                  `}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Settings Links */}
          <nav className="flex items-center gap-4">
            {FOOTER_LINKS.map((link) => {
              const active = pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    text-xs transition-colors
                    ${active ? "text-emerald-400" : "text-zinc-500 hover:text-zinc-300"}
                  `}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Divider */}
        <div className="mt-4 h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />

        {/* Bottom Bar */}
        <div className="mt-4 flex flex-col items-center justify-between gap-2 md:flex-row">
          <p className="text-[10px] text-zinc-600">
            © 2026 Dropship Autopilot. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-[10px] text-zinc-600">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              All systems operational
            </span>
            <span className="text-[10px] text-zinc-600">
              Version 1.0.0
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}