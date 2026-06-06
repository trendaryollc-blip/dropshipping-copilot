"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
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
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Contact,
  Truck,
  Star,
  DollarSign,
  Plug,
  PenLine,
  Megaphone,
  Activity,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navGroups = [
  {
    label: "Main",
    items: [
      { href: "/", label: "Dashboard", icon: LayoutDashboard },
      { href: "/products", label: "Product Research", icon: Search },
      { href: "/suppliers", label: "Supplier Finder", icon: Users },
      { href: "/my-products", label: "My Products", icon: Package },
      { href: "/activity", label: "Activity Feed", icon: Activity },
    ],
  },
  {
    label: "Tools",
    items: [
      { href: "/calculator", label: "Profit Calculator", icon: Calculator },
      { href: "/description", label: "Description AI", icon: FileText },
      { href: "/seo", label: "SEO Tools", icon: Tag },
      { href: "/bulk-edit", label: "Bulk Edit", icon: PenLine },
    ],
  },
  {
    label: "Orders & Fulfillment",
    items: [
      { href: "/orders", label: "Order Tracker", icon: ShoppingCart },
      { href: "/returns", label: "Returns & Refunds", icon: RotateCcw },
      { href: "/customers", label: "CRM", icon: Contact },
      { href: "/shipping", label: "Shipping Hub", icon: Truck },
      { href: "/reviews", label: "Reviews", icon: Star },
    ],
  },
  {
    label: "Marketing",
    items: [
      { href: "/campaigns", label: "Ad Campaigns", icon: Megaphone },
      { href: "/trends", label: "Niche Trends", icon: TrendingUp },
      { href: "/competitors", label: "Competitor Tracker", icon: Target },
    ],
  },
  {
    label: "Analytics & Automation",
    items: [
      { href: "/analytics", label: "Analytics", icon: BarChart3 },
      { href: "/automation", label: "Automation", icon: Zap },
      { href: "/business", label: "Business Ops", icon: Settings },
    ],
  },
  {
    label: "Settings",
    items: [
      { href: "/finance/pnl", label: "Profit & Loss", icon: DollarSign },
      { href: "/integrations", label: "Integrations", icon: Plug },
      { href: "/multi-store", label: "Multi-Store", icon: Store },
      { href: "/mobile", label: "Mobile App", icon: Smartphone },
      { href: "/admin/billing", label: "Billing", icon: DollarSign },
      { href: "/admin/branding", label: "Branding", icon: Settings },
      { href: "/admin/reports", label: "Reports", icon: FileText },
      { href: "/search", label: "Advanced Search", icon: Filter },
      { href: "/learn", label: "Learning Hub", icon: BookOpen },
    ],
  },
]

// Determine which group contains the active route
function findActiveGroup(pathname: string): string | null {
    for (const group of navGroups) {
        if (group.items.some((item) => pathname === item.href || pathname.startsWith(item.href + "/"))) {
            return group.label
        }
    }
    return null
}

export function SidebarNav() {
    const pathname = usePathname()
    const { state, toggleSidebar } = useSidebar()
    const collapsed = state === "collapsed"

    // Auto-expand the group containing the active route
    const activeGroup = findActiveGroup(pathname)
    const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
        () => new Set(activeGroup ? [activeGroup] : [])
    )

    // When pathname changes, ensure its group is expanded
    useEffect(() => {
        const group = findActiveGroup(pathname)
        if (group) {
            setExpandedGroups((prev) => new Set([...prev, group]))
        }
    }, [pathname])

    const toggleGroup = (label: string) => {
        setExpandedGroups((prev) => {
            const next = new Set(prev)
            if (next.has(label)) {
                next.delete(label)
            } else {
                next.add(label)
            }
            return next
        })
    }

    return (
        <Sidebar collapsible="icon" className="glass-strong border-r-0">
            <SidebarHeader className="px-3 py-4">
                <Link href="/" className="flex items-center gap-3 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-3 transition-all duration-300 hover:from-primary/15 hover:via-primary/10">
                    <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 text-white shadow-lg shadow-primary/25">
                        <Zap className="size-5" />
                        <div className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full border-2 border-background bg-emerald-400" />
                    </div>
                    {!collapsed && (
                        <div className="min-w-0">
                            <p className="truncate text-sm font-bold tracking-tight text-foreground">DropEase</p>
                            <p className="truncate text-[10px] font-medium text-muted-foreground">Dropshipping HQ</p>
                        </div>
                    )}
                </Link>
            </SidebarHeader>

            <SidebarContent className="px-2.5">
                {navGroups.map((group) => {
                    const isExpanded = expandedGroups.has(group.label)
                    const hasActiveItem = group.items.some(
                        (item) => pathname === item.href || pathname.startsWith(item.href + "/")
                    )
                    return (
                        <SidebarGroup key={group.label} className="mb-1">
                            {!collapsed && (
                                <button
                                    onClick={() => toggleGroup(group.label)}
                                    className={cn(
                                        "flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] transition-colors duration-200",
                                        hasActiveItem
                                            ? "text-primary/80 hover:text-primary"
                                            : "text-muted-foreground/60 hover:text-muted-foreground hover:bg-card/50"
                                    )}
                                >
                                    <span>{group.label}</span>
                                    <ChevronDown
                                        className={cn(
                                            "size-3 transition-transform duration-200",
                                            isExpanded ? "rotate-0" : "-rotate-90"
                                        )}
                                    />
                                </button>
                            )}
                            <div
                                className={cn(
                                    "overflow-hidden transition-all duration-200",
                                    collapsed || isExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                                )}
                            >
                                <SidebarGroupContent>
                                    <SidebarMenu>
                                        {group.items.map((item) => {
                                            const Icon = item.icon
                                            const isActive = pathname === item.href
                                            return (
                                                <SidebarMenuItem key={item.href}>
                                                    <Link
                                                        href={item.href}
                                                        className={cn(
                                                            "group relative flex h-9 w-full items-center gap-2.5 rounded-xl px-3 text-[12px] font-medium transition-all duration-200",
                                                            isActive
                                                                ? "bg-primary/10 text-primary shadow-sm"
                                                                : "text-muted-foreground hover:bg-card/50 hover:text-foreground"
                                                        )}
                                                    >
                                                        {isActive && (
                                                            <div className="absolute left-0 top-1/2 h-4 w-[3px] -translate-y-1/2 rounded-r-full bg-primary" />
                                                        )}
                                                        <span className={cn(
                                                            "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all duration-200",
                                                            isActive
                                                                ? "bg-primary/15 text-primary"
                                                                : "bg-card/50 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary/70"
                                                        )}>
                                                            <Icon className="size-[13px]" />
                                                        </span>
                                                        {!collapsed && <span className="truncate">{item.label}</span>}
                                                    </Link>
                                                </SidebarMenuItem>
                                            )
                                        })}
                                    </SidebarMenu>
                                </SidebarGroupContent>
                            </div>
                        </SidebarGroup>
                    )
                })}
            </SidebarContent>

            <SidebarFooter className="px-3 pb-3 pt-2">
                <div className="rounded-2xl border border-border/30 bg-gradient-to-br from-primary/5 to-transparent p-3">
                    <div className="flex items-center gap-3">
                        {!collapsed && (
                            <div className="flex-1 min-w-0">
                                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-primary/80">Compact Mode</p>
                                <p className="mt-0.5 text-[10px] text-muted-foreground">Minimize for focus</p>
                            </div>
                        )}
                        <Button
                            variant="ghost"
                            className="h-8 w-8 shrink-0 rounded-xl border border-border/50 bg-card/50 p-0 transition-all duration-300 hover:border-primary/30 hover:bg-primary/10 hover:text-primary"
                            onClick={toggleSidebar}
                        >
                            {collapsed ? <ChevronRight className="size-3.5" /> : <ChevronLeft className="size-3.5" />}
                        </Button>
                    </div>
                </div>
            </SidebarFooter>
        </Sidebar>
    )
}