"use client";

import { useState, useEffect, useRef } from "react";
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

interface NavItem {
  href: string;
  label: string;
  icon: string;
  color: string;
}

interface NavCategory {
  label: string;
  icon: string;
  items: NavItem[];
}

const NAV_CATEGORIES: NavCategory[] = [
  {
    label: "Dashboard",
    icon: "◉",
    items: [
      { href: "/", label: "Overview", icon: "◉", color: "violet" },
      { href: "/pipeline", label: "Autopilot", icon: "⚡", color: "violet" },
    ],
  },
  {
    label: "Products",
    icon: "🔍",
    items: [
      { href: "/research", label: "Product Research", icon: "🔍", color: "cyan" },
      { href: "/products", label: "Product Library", icon: "📚", color: "cyan" },
      { href: "/copy", label: "Copywriting", icon: "✍️", color: "purple" },
    ],
  },
  {
    label: "Operations",
    icon: "📦",
    items: [
      { href: "/orders", label: "Orders", icon: "🚚", color: "pink" },
      { href: "/suppliers", label: "Suppliers", icon: "📦", color: "blue" },
    ],
  },
  {
    label: "Automation",
    icon: "⚙️",
    items: [
      { href: "/workflows", label: "Workflows", icon: "◇", color: "violet" },
      { href: "/webhooks", label: "Webhooks", icon: "◎", color: "red" },
      { href: "/schedules", label: "Schedules", icon: "🕐", color: "orange" },
      { href: "/history", label: "Run History", icon: "📋", color: "slate" },
    ],
  },
  {
    label: "Insights",
    icon: "◈",
    items: [
      { href: "/analytics", label: "Analytics", icon: "◈", color: "rose" },
      { href: "/audit", label: "Audit Log", icon: "📝", color: "neutral" },
    ],
  },
  {
    label: "Team",
    icon: "◌",
    items: [
      { href: "/team", label: "Team Members", icon: "◌", color: "teal" },
      { href: "/templates", label: "Templates", icon: "✏️", color: "stone" },
    ],
  },
  {
    label: "Settings",
    icon: "⚙️",
    items: [
      { href: "/account", label: "Account", icon: "👤", color: "sky" },
      { href: "/settings", label: "Settings", icon: "⚙️", color: "gray" },
      { href: "/notifications", label: "Notifications", icon: "◆", color: "amber" },
    ],
  },
];

const ALL_NAV_ITEMS = NAV_CATEGORIES.flatMap((cat) => cat.items);

const COLOR_MAP: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  violet: { bg: "hover:bg-violet-500/20", border: "hover:border-violet-500/50", text: "text-violet-400", glow: "shadow-violet-500/30" },
  cyan: { bg: "hover:bg-cyan-500/20", border: "hover:border-cyan-500/50", text: "text-cyan-400", glow: "shadow-cyan-500/30" },
  blue: { bg: "hover:bg-blue-500/20", border: "hover:border-blue-500/50", text: "text-blue-400", glow: "shadow-blue-500/30" },
  purple: { bg: "hover:bg-purple-500/20", border: "hover:border-purple-500/50", text: "text-purple-400", glow: "shadow-purple-500/30" },
  pink: { bg: "hover:bg-pink-500/20", border: "hover:border-pink-500/50", text: "text-pink-400", glow: "shadow-pink-500/30" },
  rose: { bg: "hover:bg-rose-500/20", border: "hover:border-rose-500/50", text: "text-rose-400", glow: "shadow-rose-500/30" },
  red: { bg: "hover:bg-red-500/20", border: "hover:border-red-500/50", text: "text-red-400", glow: "shadow-red-500/30" },
  orange: { bg: "hover:bg-orange-500/20", border: "hover:border-orange-500/50", text: "text-orange-400", glow: "shadow-orange-500/30" },
  amber: { bg: "hover:bg-amber-500/20", border: "hover:border-amber-500/50", text: "text-amber-400", glow: "shadow-amber-500/30" },
  teal: { bg: "hover:bg-teal-500/20", border: "hover:border-teal-500/50", text: "text-teal-400", glow: "shadow-teal-500/30" },
  slate: { bg: "hover:bg-slate-500/20", border: "hover:border-slate-500/50", text: "text-slate-400", glow: "shadow-slate-500/30" },
  neutral: { bg: "hover:bg-neutral-500/20", border: "hover:border-neutral-500/50", text: "text-neutral-400", glow: "shadow-neutral-500/30" },
  stone: { bg: "hover:bg-stone-500/20", border: "hover:border-stone-500/50", text: "text-stone-400", glow: "shadow-stone-500/30" },
  sky: { bg: "hover:bg-sky-500/20", border: "hover:border-sky-500/50", text: "text-sky-400", glow: "shadow-sky-500/30" },
  gray: { bg: "hover:bg-gray-500/20", border: "hover:border-gray-500/50", text: "text-gray-400", glow: "shadow-gray-500/30" },
};

export function SiteHeader() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { user, signOut } = useAuth();
  const [headerVisible, setHeaderVisible] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setHeaderVisible(true);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const isItemActive = (item: NavItem) => isActive(item.href);

  async function handleSignOut() {
    setSigningOut(true);
    try {
      await signOut();
    } catch {}
    setSigningOut(false);
  }

  const findActiveCategory = () => {
    for (const cat of NAV_CATEGORIES) {
      if (cat.items.some((item) => isActive(item.href))) {
        return cat.label;
      }
    }
    return null;
  };

  const activeCategory = findActiveCategory();

  return (
    <>
      <style>{`
        @keyframes headerSlideDown {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes logoGlow {
          0%, 100% { box-shadow: 0 0 25px rgba(139, 92, 246, 0.5), 0 0 50px rgba(139, 92, 246, 0.25); }
          50% { box-shadow: 0 0 35px rgba(139, 92, 246, 0.7), 0 0 70px rgba(139, 92, 246, 0.35); }
        }
        @keyframes ringPulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.1); opacity: 0.2; }
        }
        @keyframes dropdownReveal {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes signInGlow {
          0%, 100% { box-shadow: 0 4px 20px rgba(139, 92, 246, 0.4), 0 0 30px rgba(139, 92, 246, 0.2); }
          50% { box-shadow: 0 4px 30px rgba(139, 92, 246, 0.6), 0 0 50px rgba(139, 92, 246, 0.3); }
        }
        .header-slide { animation: headerSlideDown 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .logo-glow-anim { animation: logoGlow 3s ease-in-out infinite; }
        .ring-pulse { animation: ringPulse 2.5s ease-in-out infinite; }
        .dropdown-reveal { animation: dropdownReveal 0.2s ease-out forwards; }
        .sign-in-btn { animation: signInGlow 3s ease-in-out infinite; }
        .dropdown-item:hover .dropdown-icon { transform: scale(1.1); filter: drop-shadow(0 0 6px currentColor); }
      `}</style>

      {/* Desktop Header */}
      <header
        ref={headerRef}
        className={`sticky top-0 z-50 hidden md:block ${headerVisible ? "header-slide" : "opacity-0"}`}
      >
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-indigo-950/80 to-zinc-950 backdrop-blur-xl" />
          <div className="absolute inset-0 bg-gradient-to-b from-violet-500/5 to-transparent" />
          <div className="absolute inset-0 border-b border-violet-500/20" />

          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/60 to-transparent" />

          <div className="relative flex items-stretch">
            {/* Logo Section */}
            <div className="flex w-64 shrink-0 items-center border-r border-violet-500/10 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="logo-glow-anim flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 via-purple-600 to-blue-600 text-lg font-black text-white">
                    T
                  </div>
                  <div className="absolute -inset-1 rounded-xl border border-violet-500/30 ring-pulse" />
                  <div className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-zinc-950">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-white" />
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-violet-400/80">Trendaryo</p>
                  <p className="text-base font-bold text-white">Autopilot</p>
                </div>
              </div>
            </div>

            {/* Nav Categories with Dropdowns */}
            <nav className="flex items-center px-2">
              {NAV_CATEGORIES.map((category) => {
                const isActiveCat = activeCategory === category.label;
                const isHovered = activeDropdown === category.label;
                const hasActiveItem = category.items.some((item) => isActive(item.href));

                return (
                  <div
                    key={category.label}
                    className="relative"
                    onMouseEnter={() => setActiveDropdown(category.label)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <button
                      className={`
                        flex items-center gap-2 px-4 py-4 text-sm font-medium transition-all duration-200
                        ${isHovered || isActiveCat ? "text-violet-400 bg-violet-500/10" : "text-zinc-400 hover:text-zinc-200"}
                        ${hasActiveItem && !isHovered ? "text-violet-400" : ""}
                      `}
                    >
                      <span className="text-base">{category.icon}</span>
                      <span>{category.label}</span>
                      <span className={`text-[10px] transition-transform ${isHovered ? "rotate-180" : ""}`}>▼</span>
                    </button>

                    {/* Dropdown Menu */}
                    {isHovered && (
                      <div className="dropdown-reveal absolute left-0 top-full mt-1 min-w-56 rounded-xl border border-violet-500/20 bg-zinc-900/98 p-2 shadow-2xl backdrop-blur-md">
                        {category.items.map((item) => {
                          const active = isActive(item.href);
                          const colors = COLOR_MAP[item.color] || COLOR_MAP.gray;
                          const itemHovered = hoveredItem === item.href;

                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              onMouseEnter={() => setHoveredItem(item.href)}
                              onMouseLeave={() => setHoveredItem(null)}
                              className={`
                                dropdown-item flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all
                                ${active ? "bg-violet-500/20 text-violet-400" : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"}
                              `}
                            >
                              <span className={`dropdown-icon text-base transition-all ${itemHovered ? "scale-110" : ""}`} style={itemHovered && !active ? { filter: `drop-shadow(0 0 6px ${colors.text.replace('text-', '')}400)` } : {}}>
                                {item.icon}
                              </span>
                              <span className="font-medium">{item.label}</span>
                              {active && <span className="ml-auto text-[10px] text-violet-400">●</span>}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Right Section */}
            <div className="ml-auto flex items-center gap-3 border-l border-violet-500/10 px-5">
              {/* Theme Picker */}
              <div className="relative">
                <button
                  onClick={() => setThemeOpen(!themeOpen)}
                  onMouseEnter={() => setThemeOpen(true)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-violet-500/20 bg-violet-500/10 text-sm transition-all hover:border-violet-500/50 hover:bg-violet-500/20 hover:shadow-lg hover:shadow-violet-500/20"
                >
                  🎨
                </button>
                {themeOpen && (
                  <div
                    className="dropdown-reveal absolute right-0 top-full mt-2 w-44 rounded-xl border border-violet-500/20 bg-zinc-900/98 p-3 shadow-2xl backdrop-blur-md"
                    onMouseLeave={() => setThemeOpen(false)}
                  >
                    <p className="mb-2 px-2 text-xs text-zinc-500">Theme</p>
                    <div className="flex flex-wrap gap-2">
                      {THEMES.map((t) => (
                        <button
                          key={t.id}
                          onClick={() => { setTheme(t.id); setThemeOpen(false); }}
                          className="h-8 w-8 rounded-lg text-xs font-bold uppercase transition-all hover:scale-110"
                          style={{
                            backgroundColor: theme === t.id ? t.color + "40" : "transparent",
                            color: t.color,
                            border: `1px solid ${theme === t.id ? t.color + "80" : t.color + "30"}`,
                            boxShadow: theme === t.id ? `0 0 12px ${t.color}40` : "none",
                          }}
                        >
                          {t.label.charAt(0)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Billing quick link */}
              <Link href="/billing" className="hidden text-sm text-zinc-400 transition-colors hover:text-violet-400 lg:block">
                Billing
              </Link>

              {/* User Menu */}
              {!user ? (
                <Link href="/login" className="sign-in-btn flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-4 py-2 text-sm font-semibold text-white">
                  Sign in
                </Link>
              ) : (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    onMouseEnter={() => setUserMenuOpen(true)}
                    className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition-all hover:bg-violet-500/10"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500/40 to-blue-500/40 text-sm font-semibold text-violet-300 ring-1 ring-violet-500/30" style={{ boxShadow: "0 0 12px rgba(139, 92, 246, 0.25)" }}>
                      {(user.displayName || user.email || "?")[0]?.toUpperCase()}
                    </div>
                    <span className="text-sm text-zinc-200 hidden lg:block">{user.displayName || "Account"}</span>
                    <span className={`text-zinc-400 text-xs transition-transform ${userMenuOpen ? "rotate-180" : ""}`}>▼</span>
                  </button>
                  {userMenuOpen && (
                    <div
                      className="dropdown-reveal absolute right-0 top-full mt-2 w-52 rounded-xl border border-violet-500/20 bg-zinc-900/98 p-2 shadow-2xl backdrop-blur-md"
                      onMouseLeave={() => setUserMenuOpen(false)}
                    >
                      <div className="mb-1 border-b border-violet-500/10 px-3 py-2">
                        <p className="text-xs text-zinc-400">{user.email}</p>
                      </div>
                      <Link href="/account" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-300 transition-all hover:bg-violet-500/10 hover:text-violet-300">
                        👤 Account
                      </Link>
                      <Link href="/settings" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-300 transition-all hover:bg-violet-500/10 hover:text-violet-300">
                        ⚙️ Settings
                      </Link>
                      <button onClick={handleSignOut} disabled={signingOut} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-400 transition-all hover:bg-red-500/10 hover:text-red-400">
                        🚪 {signingOut ? "Signing out..." : "Sign out"}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />
        </div>
      </header>

      {/* Mobile Header */}
      <header className={`sticky top-0 z-50 border-b border-violet-500/20 md:hidden ${headerVisible ? "header-slide" : "opacity-0"}`}>
        <div className="relative bg-gradient-to-r from-zinc-950 via-indigo-950/80 to-zinc-950 backdrop-blur-xl">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/60 to-transparent" />
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="logo-glow-anim flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 via-purple-600 to-blue-600 text-base font-black text-white">
                  T
                </div>
                <div className="absolute -inset-1 rounded-xl border border-violet-500/20 ring-pulse" />
              </div>
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-widest text-violet-400/80">Trendaryo</p>
                <p className="text-sm font-bold text-white">Autopilot</p>
              </div>
            </div>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/10 text-lg text-violet-300 transition-all hover:bg-violet-500/20">
              {mobileMenuOpen ? "✕" : "☰"}
            </button>
          </div>
          {mobileMenuOpen && (
            <nav className="border-t border-violet-500/10 bg-zinc-950/98 p-3">
              {NAV_CATEGORIES.map((cat) => (
                <div key={cat.label} className="mb-3">
                  <p className="mb-2 px-2 text-xs font-semibold text-violet-400">{cat.label}</p>
                  <div className="grid grid-cols-2 gap-1">
                    {cat.items.map((item) => {
                      const active = isActive(item.href);
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm ${active ? "bg-violet-500/20 text-violet-400" : "text-zinc-400"}`}
                        >
                          <span>{item.icon}</span>
                          <span>{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>
          )}
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />
        </div>
      </header>

      <IntegrationStatusBanner />
    </>
  );
}
