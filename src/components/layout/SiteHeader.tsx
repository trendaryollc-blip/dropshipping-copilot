"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme, type Theme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { IntegrationStatusBanner } from "@/components/IntegrationStatus";

const THEMES: { id: Theme; label: string; color: string }[] = [
  { id: "dark", label: "Cyber", color: "#10b981" },
  { id: "synthwave", label: "Synth", color: "#e815e4" },
  { id: "forest", label: "Forest", color: "#22c55e" },
  { id: "ocean", label: "Ocean", color: "#0ea5e9" },
  { id: "midnight", label: "Night", color: "#52525b" },
];

const NAV_ITEMS = [
  { href: "/", label: "Overview", icon: "◉", color: "emerald" },
  { href: "/pipeline", label: "Autopilot", icon: "⚡", color: "emerald" },
  { href: "/research", label: "Products", icon: "🔍", color: "cyan" },
  { href: "/products", label: "Library", icon: "📚", color: "cyan" },
  { href: "/suppliers", label: "Suppliers", icon: "📦", color: "blue" },
  { href: "/copy", label: "Copy", icon: "✍️", color: "purple" },
  { href: "/orders", label: "Orders", icon: "🚚", color: "orange" },
  { href: "/analytics", label: "Analytics", icon: "◈", color: "pink" },
  { href: "/notifications", label: "Alerts", icon: "◆", color: "yellow" },
  { href: "/workflows", label: "Workflows", icon: "◇", color: "violet" },
  { href: "/webhooks", label: "Webhooks", icon: "◎", color: "rose" },
  { href: "/team", label: "Team", icon: "◌", color: "teal" },
  { href: "/billing", label: "Billing", icon: "$", color: "green" },
  { href: "/schedules", label: "Schedules", icon: "🕐", color: "amber" },
  { href: "/history", label: "History", icon: "📋", color: "slate" },
  { href: "/audit", label: "Audit", icon: "📝", color: "neutral" },
  { href: "/templates", label: "Templates", icon: "✏️", color: "stone" },
  { href: "/account", label: "Account", icon: "👤", color: "sky" },
  { href: "/settings", label: "Settings", icon: "⚙️", color: "gray" },
];

const COLOR_MAP: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  emerald: { bg: "hover:bg-emerald-500/20", border: "hover:border-emerald-500/50", text: "text-emerald-400", glow: "hover:shadow-emerald-500/20" },
  cyan: { bg: "hover:bg-cyan-500/20", border: "hover:border-cyan-500/50", text: "text-cyan-400", glow: "hover:shadow-cyan-500/20" },
  blue: { bg: "hover:bg-blue-500/20", border: "hover:border-blue-500/50", text: "text-blue-400", glow: "hover:shadow-blue-500/20" },
  purple: { bg: "hover:bg-purple-500/20", border: "hover:border-purple-500/50", text: "text-purple-400", glow: "hover:shadow-purple-500/20" },
  orange: { bg: "hover:bg-orange-500/20", border: "hover:border-orange-500/50", text: "text-orange-400", glow: "hover:shadow-orange-500/20" },
  pink: { bg: "hover:bg-pink-500/20", border: "hover:border-pink-500/50", text: "text-pink-400", glow: "hover:shadow-pink-500/20" },
  yellow: { bg: "hover:bg-yellow-500/20", border: "hover:border-yellow-500/50", text: "text-yellow-400", glow: "hover:shadow-yellow-500/20" },
  violet: { bg: "hover:bg-violet-500/20", border: "hover:border-violet-500/50", text: "text-violet-400", glow: "hover:shadow-violet-500/20" },
  rose: { bg: "hover:bg-rose-500/20", border: "hover:border-rose-500/50", text: "text-rose-400", glow: "hover:shadow-rose-500/20" },
  teal: { bg: "hover:bg-teal-500/20", border: "hover:border-teal-500/50", text: "text-teal-400", glow: "hover:shadow-teal-500/20" },
  amber: { bg: "hover:bg-amber-500/20", border: "hover:border-amber-500/50", text: "text-amber-400", glow: "hover:shadow-amber-500/20" },
  slate: { bg: "hover:bg-slate-500/20", border: "hover:border-slate-500/50", text: "text-slate-400", glow: "hover:shadow-slate-500/20" },
  neutral: { bg: "hover:bg-neutral-500/20", border: "hover:border-neutral-500/50", text: "text-neutral-400", glow: "hover:shadow-neutral-500/20" },
  stone: { bg: "hover:bg-stone-500/20", border: "hover:border-stone-500/50", text: "text-stone-400", glow: "hover:shadow-stone-500/20" },
  sky: { bg: "hover:bg-sky-500/20", border: "hover:border-sky-500/50", text: "text-sky-400", glow: "hover:shadow-sky-500/20" },
  gray: { bg: "hover:bg-gray-500/20", border: "hover:border-gray-500/50", text: "text-gray-400", glow: "hover:shadow-gray-500/20" },
  green: { bg: "hover:bg-green-500/20", border: "hover:border-green-500/50", text: "text-green-400", glow: "hover:shadow-green-500/20" },
};

export function SiteHeader() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { user, loading, demoMode, authConfigured, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [signingOut, setSigningOut] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  async function handleSignOut() {
    setSigningOut(true);
    try {
      await signOut();
    } catch {}
    setSigningOut(false);
  }

  return (
    <>
      {/* Desktop Header */}
      <header className="sticky top-0 z-50 hidden border-b border-zinc-800/80 bg-zinc-950/95 backdrop-blur-md md:block">
        <div className="flex items-stretch">
          {/* Logo Section */}
          <div className="flex w-72 shrink-0 items-center border-r border-zinc-800/80 px-6 py-5">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 text-xl font-bold text-zinc-950 shadow-xl shadow-emerald-500/30">
                  D
                </div>
                <div className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ring-zinc-950" />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-emerald-400/80">Dropship</p>
                <h1 className="text-lg font-bold leading-tight text-zinc-100">Autopilot</h1>
              </div>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="flex flex-1 items-center overflow-x-auto px-3 scrollbar-thin">
            {NAV_ITEMS.map((item, index) => {
              const active = isActive(item.href);
              const hovered = hoveredIndex === index;
              const colors = COLOR_MAP[item.color] || COLOR_MAP.gray;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={`
                    group relative flex shrink-0 items-center gap-2.5 px-4 py-5 text-sm font-medium
                    transition-all duration-200 ease-out
                    ${active ? "text-emerald-400" : colors.text}
                    ${hovered ? `${colors.bg} ${colors.border}` : "text-zinc-400 hover:text-zinc-200"}
                  `}
                >
                  {/* Active indicator */}
                  {active && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500" />
                  )}
                  {/* Hover glow */}
                  {hovered && !active && (
                    <div className={`absolute inset-0 rounded-lg ${colors.glow.replace("hover:", "")} opacity-10`} />
                  )}
                  <span className="text-xl transition-transform duration-200 group-hover:scale-110">
                    {item.icon}
                  </span>
                  <span className="relative">
                    {item.label}
                    {hovered && !active && (
                      <span className={`absolute -bottom-0.5 left-0 h-0.5 w-full rounded-full ${colors.text.replace("text-", "bg-")} opacity-60`} />
                    )}
                  </span>
                  {/* Tooltip for truncated labels */}
                  <div className="absolute left-1/2 top-full mt-2 -translate-x-1/2 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity">
                    <div className="rounded-lg bg-zinc-800 px-2 py-1 text-[10px] text-zinc-300 shadow-xl">
                      {item.label}
                    </div>
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-4 border-l border-zinc-800/80 px-6">
            {/* Theme Picker */}
            <div className="relative group">
              <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-700/50 bg-zinc-900/50 text-sm transition-all hover:border-emerald-500/50 hover:bg-zinc-800">
                🎨
              </button>
              <div className="absolute right-0 top-full mt-3 hidden group-hover:block">
                <div className="flex gap-2 rounded-2xl border border-zinc-700/50 bg-zinc-900/95 p-3 shadow-2xl backdrop-blur-md">
                  {THEMES.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTheme(t.id)}
                      title={t.label}
                      className="h-9 w-9 rounded-xl text-xs font-bold uppercase transition-all hover:scale-110"
                      style={{
                        backgroundColor: theme === t.id ? t.color + "30" : "transparent",
                        color: t.color,
                        border: `1px solid ${theme === t.id ? t.color + "80" : t.color + "30"}`,
                      }}
                    >
                      {t.label.charAt(0)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* User Menu */}
            {loading ? (
              <div className="h-10 w-10 animate-pulse rounded-full bg-zinc-800" />
            ) : demoMode || !authConfigured ? (
              <Link
                href="/login"
                className="flex items-center gap-2 rounded-xl bg-emerald-500/20 px-4 py-2.5 text-sm font-semibold text-emerald-400 transition-all hover:bg-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/10"
              >
                Sign in
              </Link>
            ) : user ? (
              <div className="relative group">
                <button className="flex items-center gap-3 rounded-xl px-3 py-2 transition-all hover:bg-zinc-800/50">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500/30 to-cyan-500/30 text-base font-semibold text-emerald-300 ring-1 ring-emerald-500/30">
                    {(user.displayName || user.email || "?")[0]?.toUpperCase()}
                  </span>
                  <span className="text-base font-medium text-zinc-200">{user.displayName || "Account"}</span>
                </button>
                <div className="absolute right-0 top-full mt-3 hidden group-hover:block">
                  <div className="w-56 rounded-2xl border border-zinc-700/50 bg-zinc-900/95 p-3 shadow-2xl backdrop-blur-md">
                    <div className="border-b border-zinc-800/50 px-4 py-3">
                      <p className="text-sm text-zinc-400">{user.email}</p>
                    </div>
                    <button
                      onClick={handleSignOut}
                      disabled={signingOut}
                      className="w-full rounded-xl px-4 py-3 text-left text-sm text-zinc-400 transition-all hover:bg-zinc-800 hover:text-red-400"
                    >
                      {signingOut ? "Signing out..." : "Sign out"}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 rounded-xl bg-emerald-500/20 px-4 py-2.5 text-sm font-semibold text-emerald-400 transition-all hover:bg-emerald-500/30"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="sticky top-0 z-50 border-b border-zinc-800/80 bg-zinc-950/95 backdrop-blur-md md:hidden">
        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 text-base font-bold text-zinc-950">
              D
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-emerald-400/80">Dropship</p>
              <p className="text-sm font-bold text-zinc-100">Autopilot</p>
            </div>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-700/50 bg-zinc-900/50 text-lg transition-all hover:bg-zinc-800"
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="max-h-96 overflow-y-auto border-t border-zinc-800/50 bg-zinc-950/98 p-4">
            <div className="grid grid-cols-3 gap-3">
              {NAV_ITEMS.map((item) => {
                const active = isActive(item.href);
                const colors = COLOR_MAP[item.color] || COLOR_MAP.gray;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`
                      flex flex-col items-center gap-2 rounded-2xl px-4 py-4 text-center transition-all
                      ${active ? "bg-emerald-500/20 text-emerald-400" : "text-zinc-400 hover:bg-zinc-800/50"}
                    `}
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <span className="text-xs font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </nav>
        )}
      </header>

      {/* Integration Status Banner */}
      <IntegrationStatusBanner />
    </>
  );
}