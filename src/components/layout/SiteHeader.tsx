"use client";

import { useState, useEffect } from "react";
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
  { href: "/", label: "Overview", icon: "◉", color: "violet" },
  { href: "/pipeline", label: "Autopilot", icon: "⚡", color: "violet" },
  { href: "/research", label: "Products", icon: "🔍", color: "cyan" },
  { href: "/products", label: "Library", icon: "📚", color: "cyan" },
  { href: "/suppliers", label: "Suppliers", icon: "📦", color: "blue" },
  { href: "/copy", label: "Copy", icon: "✍️", color: "purple" },
  { href: "/orders", label: "Orders", icon: "🚚", color: "pink" },
  { href: "/analytics", label: "Analytics", icon: "◈", color: "rose" },
  { href: "/notifications", label: "Alerts", icon: "◆", color: "amber" },
  { href: "/workflows", label: "Workflows", icon: "◇", color: "violet" },
  { href: "/webhooks", label: "Webhooks", icon: "◎", color: "red" },
  { href: "/team", label: "Team", icon: "◌", color: "teal" },
  { href: "/billing", label: "Billing", icon: "$", color: "green" },
  { href: "/schedules", label: "Schedules", icon: "🕐", color: "orange" },
  { href: "/history", label: "History", icon: "📋", color: "slate" },
  { href: "/audit", label: "Audit", icon: "📝", color: "neutral" },
  { href: "/templates", label: "Templates", icon: "✏️", color: "stone" },
  { href: "/account", label: "Account", icon: "👤", color: "sky" },
  { href: "/settings", label: "Settings", icon: "⚙️", color: "gray" },
];

const COLOR_MAP: Record<string, { bg: string; border: string; text: string; glow: string; gradient: string }> = {
  violet: { bg: "hover:bg-violet-500/20", border: "hover:border-violet-500/50", text: "text-violet-400", glow: "hover:shadow-violet-500/30", gradient: "from-violet-500 to-purple-500" },
  cyan: { bg: "hover:bg-cyan-500/20", border: "hover:border-cyan-500/50", text: "text-cyan-400", glow: "hover:shadow-cyan-500/30", gradient: "from-cyan-500 to-blue-500" },
  blue: { bg: "hover:bg-blue-500/20", border: "hover:border-blue-500/50", text: "text-blue-400", glow: "hover:shadow-blue-500/30", gradient: "from-blue-500 to-indigo-500" },
  purple: { bg: "hover:bg-purple-500/20", border: "hover:border-purple-500/50", text: "text-purple-400", glow: "hover:shadow-purple-500/30", gradient: "from-purple-500 to-pink-500" },
  pink: { bg: "hover:bg-pink-500/20", border: "hover:border-pink-500/50", text: "text-pink-400", glow: "hover:shadow-pink-500/30", gradient: "from-pink-500 to-rose-500" },
  rose: { bg: "hover:bg-rose-500/20", border: "hover:border-rose-500/50", text: "text-rose-400", glow: "hover:shadow-rose-500/30", gradient: "from-rose-500 to-red-500" },
  red: { bg: "hover:bg-red-500/20", border: "hover:border-red-500/50", text: "text-red-400", glow: "hover:shadow-red-500/30", gradient: "from-red-500 to-orange-500" },
  orange: { bg: "hover:bg-orange-500/20", border: "hover:border-orange-500/50", text: "text-orange-400", glow: "hover:shadow-orange-500/30", gradient: "from-orange-500 to-amber-500" },
  amber: { bg: "hover:bg-amber-500/20", border: "hover:border-amber-500/50", text: "text-amber-400", glow: "hover:shadow-amber-500/30", gradient: "from-amber-500 to-yellow-500" },
  teal: { bg: "hover:bg-teal-500/20", border: "hover:border-teal-500/50", text: "text-teal-400", glow: "hover:shadow-teal-500/30", gradient: "from-teal-500 to-emerald-500" },
  green: { bg: "hover:bg-green-500/20", border: "hover:border-green-500/50", text: "text-green-400", glow: "hover:shadow-green-500/30", gradient: "from-green-500 to-emerald-500" },
  emerald: { bg: "hover:bg-emerald-500/20", border: "hover:border-emerald-500/50", text: "text-emerald-400", glow: "hover:shadow-emerald-500/30", gradient: "from-emerald-500 to-teal-500" },
  slate: { bg: "hover:bg-slate-500/20", border: "hover:border-slate-500/50", text: "text-slate-400", glow: "hover:shadow-slate-500/30", gradient: "from-slate-500 to-gray-500" },
  neutral: { bg: "hover:bg-neutral-500/20", border: "hover:border-neutral-500/50", text: "text-neutral-400", glow: "hover:shadow-neutral-500/30", gradient: "from-neutral-500 to-stone-500" },
  stone: { bg: "hover:bg-stone-500/20", border: "hover:border-stone-500/50", text: "text-stone-400", glow: "hover:shadow-stone-500/30", gradient: "from-stone-500 to-zinc-500" },
  sky: { bg: "hover:bg-sky-500/20", border: "hover:border-sky-500/50", text: "text-sky-400", glow: "hover:shadow-sky-500/30", gradient: "from-sky-500 to-blue-500" },
  gray: { bg: "hover:bg-gray-500/20", border: "hover:border-gray-500/50", text: "text-gray-400", glow: "hover:shadow-gray-500/30", gradient: "from-gray-500 to-zinc-500" },
};

export function SiteHeader() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { user, loading, demoMode, authConfigured, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [signingOut, setSigningOut] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    setHeaderVisible(true);
  }, []);

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
      <style>{`
        @keyframes headerSlideDown {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes logoGlow {
          0%, 100% { box-shadow: 0 0 25px rgba(139, 92, 246, 0.5), 0 0 50px rgba(139, 92, 246, 0.25), inset 0 0 20px rgba(139, 92, 246, 0.1); }
          50% { box-shadow: 0 0 35px rgba(139, 92, 246, 0.7), 0 0 70px rgba(139, 92, 246, 0.35), inset 0 0 25px rgba(139, 92, 246, 0.15); }
        }
        @keyframes ringPulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.08); opacity: 0.3; }
        }
        @keyframes navUnderline {
          from { width: 0; }
          to { width: 100%; }
        }
        @keyframes navDot {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }
        @keyframes dropdownIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes signInGlow {
          0%, 100% { box-shadow: 0 4px 20px rgba(139, 92, 246, 0.4), 0 0 30px rgba(139, 92, 246, 0.2); }
          50% { box-shadow: 0 4px 30px rgba(139, 92, 246, 0.6), 0 0 50px rgba(139, 92, 246, 0.3); }
        }
        .header-slide { animation: headerSlideDown 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .logo-glow-anim { animation: logoGlow 3s ease-in-out infinite; }
        .ring-pulse { animation: ringPulse 2.5s ease-in-out infinite; }
        .nav-hover-line::after { content: ''; position: absolute; bottom: 6px; left: 50%; transform: translateX(-50%); height: 2px; background: linear-gradient(90deg, #8b5cf6, #3b82f6); border-radius: 1px; transition: width 0.3s ease; width: 0; }
        .nav-hover-line:hover::after { animation: navUnderline 0.3s ease forwards; }
        .nav-active-dot { animation: navDot 2s ease-in-out infinite; }
        .dropdown-enter { animation: dropdownIn 0.25s ease-out forwards; }
        .sign-in-btn { animation: signInGlow 3s ease-in-out infinite; }
      `}</style>

      {/* Desktop Header */}
      <header className={`sticky top-0 z-50 hidden md:block ${headerVisible ? "header-slide" : "opacity-0"}`}>
        {/* Glassmorphism bg with gradient */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-indigo-950/80 to-zinc-950 backdrop-blur-xl" />
          <div className="absolute inset-0 bg-gradient-to-b from-violet-500/5 to-transparent" />
          <div className="absolute inset-0 border-b border-violet-500/20" style={{ backdropFilter: 'blur(20px)' }} />

          {/* Top gradient line */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/60 to-transparent" />

          <div className="relative flex items-stretch">
            {/* Logo Section */}
            <div className="flex w-72 shrink-0 items-center border-r border-violet-500/10 px-6 py-5">
              <div className="flex items-center gap-4">
                {/* Logo with glow */}
                <div className="relative">
                  <div
                    className="logo-glow-anim flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 via-purple-600 to-blue-600 text-xl font-black text-white"
                  >
                    T
                  </div>
                  {/* Outer ring */}
                  <div className="absolute -inset-2 rounded-2xl border border-violet-500/40 ring-pulse" />
                  {/* Online dot */}
                  <div className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-zinc-950">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-white" />
                  </div>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-violet-400/80">Trendaryo</p>
                  <h1 className="text-lg font-bold leading-tight text-white">Autopilot</h1>
                </div>
              </div>
            </div>

            {/* Nav Links */}
            <nav className="flex flex-1 items-center overflow-x-auto px-2 scrollbar-thin">
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
                      nav-hover-line group relative flex shrink-0 items-center gap-2.5 px-4 py-5 text-sm font-medium
                      transition-all duration-200 ease-out
                      ${active ? "text-violet-400" : colors.text}
                      ${hovered ? `${colors.bg} ${colors.border}` : "text-zinc-400 hover:text-zinc-200"}
                    `}
                  >
                    {active && (
                      <span className="nav-active-dot absolute bottom-3 left-1/2 -translate-x-1/2 text-[6px] text-violet-400">●</span>
                    )}
                    <span
                      className={`text-xl transition-all duration-200 ${hovered ? "scale-110" : ""}`}
                      style={hovered && !active ? { filter: `drop-shadow(0 0 8px ${colors.text.replace('text-', '')}400)` } : {}}
                    >
                      {item.icon}
                    </span>
                    <span className="relative">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Right Section */}
            <div className="flex items-center gap-4 border-l border-violet-500/10 px-6">
              {/* Theme Picker */}
              <div className="relative">
                <button
                  onClick={() => setThemeOpen(!themeOpen)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/10 text-base transition-all hover:border-violet-500/50 hover:bg-violet-500/20 hover:shadow-lg hover:shadow-violet-500/20"
                >
                  🎨
                </button>
                {themeOpen && (
                  <div className="dropdown-enter absolute right-0 top-full mt-3 w-48 rounded-2xl border border-violet-500/20 bg-zinc-900/95 p-3 shadow-2xl backdrop-blur-md">
                    <p className="mb-2 px-3 text-xs text-zinc-500">Theme</p>
                    <div className="flex flex-wrap gap-2">
                      {THEMES.map((t) => (
                        <button
                          key={t.id}
                          onClick={() => { setTheme(t.id); setThemeOpen(false); }}
                          className="h-9 w-9 rounded-xl text-xs font-bold uppercase transition-all hover:scale-110"
                          style={{
                            backgroundColor: theme === t.id ? t.color + "40" : "transparent",
                            color: t.color,
                            border: `1px solid ${theme === t.id ? t.color + "80" : t.color + "30"}`,
                            boxShadow: theme === t.id ? `0 0 15px ${t.color}40` : "none",
                          }}
                        >
                          {t.label.charAt(0)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* User Menu */}
              {loading ? (
                <div className="h-10 w-10 animate-pulse rounded-full bg-violet-500/20" />
              ) : demoMode || !authConfigured ? (
                <Link
                  href="/login"
                  className="sign-in-btn flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white"
                >
                  Sign in
                </Link>
              ) : user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-3 rounded-xl px-3 py-2 transition-all hover:bg-violet-500/10"
                  >
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-500/40 to-blue-500/40 text-base font-semibold text-violet-300 ring-2 ring-violet-500/30"
                      style={{ boxShadow: "0 0 15px rgba(139, 92, 246, 0.3)" }}
                    >
                      {(user.displayName || user.email || "?")[0]?.toUpperCase()}
                    </div>
                    <span className="text-base font-medium text-zinc-200">{user.displayName || "Account"}</span>
                    <span className={`text-zinc-400 transition-transform duration-200 ${userMenuOpen ? "rotate-180" : ""}`}>▼</span>
                  </button>
                  {userMenuOpen && (
                    <div className="dropdown-enter absolute right-0 top-full mt-3 w-56 rounded-2xl border border-violet-500/20 bg-zinc-900/95 p-3 shadow-2xl backdrop-blur-md">
                      <div className="mb-2 border-b border-violet-500/10 px-4 py-3">
                        <p className="text-sm text-zinc-400">{user.email}</p>
                      </div>
                      <div className="space-y-1">
                        <Link href="/account" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm text-zinc-300 transition-all hover:bg-violet-500/10 hover:text-violet-300">
                          👤 Account
                        </Link>
                        <Link href="/settings" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm text-zinc-300 transition-all hover:bg-violet-500/10 hover:text-violet-300">
                          ⚙️ Settings
                        </Link>
                        <button onClick={handleSignOut} disabled={signingOut} className="flex w-full items-center gap-2 rounded-xl px-4 py-2.5 text-sm text-zinc-400 transition-all hover:bg-red-500/10 hover:text-red-400">
                          🚪 {signingOut ? "Signing out..." : "Sign out"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link href="/login" className="sign-in-btn flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white">
                  Sign in
                </Link>
              )}
            </div>
          </div>

          {/* Bottom gradient line */}
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />
        </div>
      </header>

      {/* Mobile Header */}
      <header className={`sticky top-0 z-50 border-b border-violet-500/20 md:hidden ${headerVisible ? "header-slide" : "opacity-0"}`}>
        <div className="relative bg-gradient-to-r from-zinc-950 via-indigo-950/80 to-zinc-950 backdrop-blur-xl">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/60 to-transparent" />
          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="logo-glow-anim flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 via-purple-600 to-blue-600 text-base font-black text-white">
                  T
                </div>
                <div className="absolute -inset-1 rounded-2xl border border-violet-500/20 ring-pulse" />
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-violet-400/80">Trendaryo</p>
                <p className="text-sm font-bold text-white">Autopilot</p>
              </div>
            </div>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="flex h-11 w-11 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/10 text-lg text-violet-300 transition-all hover:bg-violet-500/20">
              {mobileMenuOpen ? "✕" : "☰"}
            </button>
          </div>
          {mobileMenuOpen && (
            <nav className="max-h-96 overflow-y-auto border-t border-violet-500/10 bg-zinc-950/98 p-4">
              <div className="grid grid-cols-3 gap-3">
                {NAV_ITEMS.map((item) => {
                  const active = isActive(item.href);
                  const colors = COLOR_MAP[item.color] || COLOR_MAP.gray;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex flex-col items-center gap-2 rounded-2xl px-4 py-4 text-center transition-all ${active ? "bg-gradient-to-br from-violet-500/20 to-blue-500/20 text-violet-400 border border-violet-500/30" : "text-zinc-400 hover:bg-violet-500/10"}`}
                    >
                      <span className="text-2xl">{item.icon}</span>
                      <span className="text-xs font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </nav>
          )}
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />
        </div>
      </header>

      <IntegrationStatusBanner />
    </>
  );
}