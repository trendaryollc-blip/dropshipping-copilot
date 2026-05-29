"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IntegrationStatusBanner } from "@/components/IntegrationStatus";
import { useTheme, type Theme } from "@/contexts/ThemeContext";

const THEMES: { id: Theme; label: string; color: string }[] = [
  { id: "dark", label: "Cyber", color: "#10b981" },
  { id: "synthwave", label: "Synth", color: "#e815e4" },
  { id: "forest", label: "Forest", color: "#22c55e" },
  { id: "ocean", label: "Ocean", color: "#0ea5e9" },
  { id: "midnight", label: "Night", color: "#52525b" },
];

const nav = [
  { href: "/", label: "Overview", icon: "◉" },
  { href: "/pipeline", label: "Full Autopilot", icon: "⚡" },
  { href: "/research", label: "Winning Products", icon: "🔍" },
  { href: "/products", label: "Product Library", icon: "📚" },
  { href: "/suppliers", label: "Suppliers", icon: "📦" },
  { href: "/copy", label: "Product Copy", icon: "✍️" },
  { href: "/orders", label: "Orders", icon: "🚚" },
  { href: "/analytics", label: "Analytics", icon: "◈" },
  { href: "/notifications", label: "Notifications", icon: "◆" },
  { href: "/workflows", label: "Workflows", icon: "◇" },
  { href: "/webhooks", label: "Webhooks", icon: "◎" },
  { href: "/team", label: "Team", icon: "◌" },
  { href: "/billing", label: "Billing", icon: "$" },
  { href: "/schedules", label: "Schedules", icon: "🕐" },
  { href: "/history", label: "Run History", icon: "📋" },
  { href: "/audit", label: "Audit Log", icon: "📝" },
  { href: "/templates", label: "Templates", icon: "✏️" },
  { href: "/account", label: "Account", icon: "👤" },
  { href: "/settings", label: "Settings", icon: "⚙️" },
];

export function Sidebar({ footer }: { footer?: ReactNode }) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-zinc-800 bg-zinc-950 text-zinc-100 md:h-screen md:w-64 md:border-b-0 md:border-r md:sticky md:top-0 z-10">
      <div className="border-b border-zinc-800 px-5 py-6">
        <p className="text-xs font-medium uppercase tracking-widest text-emerald-400">
          Dropship
        </p>
        <h1 className="mt-1 text-lg font-semibold tracking-tight">
          Autopilot
        </h1>
        <p className="mt-1 text-xs text-zinc-500">
          Automate your store operations
        </p>
      </div>
      <nav className="flex flex-1 gap-1 overflow-x-auto p-3 md:flex-col md:overflow-x-visible">
        {nav.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                active
                  ? "bg-emerald-500/15 text-emerald-300"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
              }`}
            >
              <span className="text-base" aria-hidden>
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-zinc-800 p-4 space-y-3">
        {/* Theme picker */}
        <div className="space-y-1.5">
          <p className="text-[10px] font-medium uppercase tracking-widest text-zinc-600">Theme</p>
          <div className="flex gap-1.5">
            {THEMES.map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                title={t.label}
                className="flex-1 h-7 rounded-md text-[9px] font-bold uppercase tracking-wide transition-all"
                style={{
                  backgroundColor: theme === t.id ? t.color + "30" : "transparent",
                  color: t.color,
                  border: `1px solid ${theme === t.id ? t.color + "80" : t.color + "30"}`,
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
        {footer}
        <IntegrationStatusBanner />
      </div>
    </aside>
  );
}
