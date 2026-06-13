"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Menu,
  X,
  LayoutDashboard,
  Search,
  Users,
  Package,
  FileText,
  ShoppingCart,
  BookOpen,
  Zap,
  BarChart3,
  Smartphone,
  Filter,
  Store,
  Settings,
  Calculator,
  Tag,
  TrendingUp,
  Target,
  RotateCcw,
  Contact,
  Truck,
  Star,
  DollarSign,
  Plug,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navGroups = [
  {
    label: "Main",
    items: [
      { href: "/", label: "Dashboard", icon: LayoutDashboard },
      { href: "/products", label: "Products", icon: Search },
      { href: "/suppliers", label: "Suppliers", icon: Users },
      { href: "/my-products", label: "My Products", icon: Package },
    ],
  },
  {
    label: "Tools",
    items: [
      { href: "/calculator", label: "Calculator", icon: Calculator },
      { href: "/description", label: "Description AI", icon: FileText },
      { href: "/seo", label: "SEO Tools", icon: Tag },
    ],
  },
  {
    label: "Orders",
    items: [
      { href: "/orders", label: "Orders", icon: ShoppingCart },
      { href: "/returns", label: "Returns", icon: RotateCcw },
      { href: "/customers", label: "CRM", icon: Contact },
      { href: "/shipping", label: "Shipping", icon: Truck },
      { href: "/reviews", label: "Reviews", icon: Star },
    ],
  },
  {
    label: "Finance",
    items: [
      { href: "/finance/pnl", label: "P&L", icon: DollarSign },
      { href: "/integrations", label: "Integrations", icon: Plug },
    ],
  },
  {
    label: "Growth",
    items: [
      { href: "/trends", label: "Trends", icon: TrendingUp },
      { href: "/competitors", label: "Competitors", icon: Target },
      { href: "/analytics", label: "Analytics", icon: BarChart3 },
      { href: "/automation", label: "Automation", icon: Zap },
      { href: "/business-opportunities", label: "Opportunities", icon: Target },
    ],
  },
  {
    label: "Settings",
    items: [
      { href: "/multi-store", label: "Multi-Store", icon: Store },
      { href: "/mobile", label: "Mobile App", icon: Smartphone },
      { href: "/admin/billing", label: "Billing", icon: DollarSign },
      { href: "/admin/branding", label: "Branding", icon: Settings },
      { href: "/admin/reports", label: "Reports", icon: FileText },
      { href: "/learn", label: "Learning", icon: BookOpen },
    ],
  },
]

export function MobileSidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [isOpen])

  return (
    <>
      {/* Hamburger button — only visible on small screens */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed left-4 top-3 z-50 flex size-9 items-center justify-center rounded-xl border border-border/50 bg-card/80 backdrop-blur-sm text-muted-foreground transition-all duration-300 hover:border-primary/30 hover:text-primary lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="size-4" />
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar panel */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 transform bg-background/95 backdrop-blur-xl border-r border-border/50 transition-transform duration-300 ease-out lg:hidden",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 text-white shadow-lg shadow-primary/25">
              <Zap className="size-4" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">DropEase</p>
              <p className="text-[10px] text-muted-foreground">Dropshipping HQ</p>
            </div>
          </Link>
          <button
            onClick={() => setIsOpen(false)}
            className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground"
            aria-label="Close menu"
          >
            <X className="size-4" />
          </button>
        </div>

        <nav className="overflow-y-auto px-3 pb-6" style={{ maxHeight: "calc(100vh - 72px)" }}>
          {navGroups.map((group) => (
            <div key={group.label} className="mb-3">
              <p className="px-3 pb-1 pt-2 text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
                {group.label}
              </p>
              {group.items.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-card/50 hover:text-foreground"
                    )}
                  >
                    <Icon className="size-4" />
                    {item.label}
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>
      </div>
    </>
  )
}