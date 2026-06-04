"use client"

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
  Contact,
  Truck,
  Star,
  DollarSign,
  Plug,
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
    ],
  },
  {
    label: "Tools",
    items: [
      { href: "/calculator", label: "Profit Calculator", icon: Calculator },
      { href: "/description", label: "Description AI", icon: FileText },
      { href: "/seo", label: "SEO Tools", icon: Tag },
    ],
  },
  {
    label: "Orders",
    items: [
      { href: "/orders", label: "Order Tracker", icon: ShoppingCart },
      { href: "/returns", label: "Returns & Refunds", icon: RotateCcw },
      { href: "/customers", label: "CRM", icon: Contact },
      { href: "/shipping", label: "Shipping Hub", icon: Truck },
      { href: "/reviews", label: "Reviews", icon: Star },
    ],
  },
  {
    label: "Finance",
    items: [
      { href: "/finance/pnl", label: "Profit & Loss", icon: DollarSign },
      { href: "/integrations", label: "Integrations", icon: Plug },
    ],
  },
  {
    label: "Growth",
    items: [
      { href: "/trends", label: "Niche Trends", icon: TrendingUp },
      { href: "/competitors", label: "Competitor Tracker", icon: Target },
      { href: "/analytics", label: "Analytics", icon: BarChart3 },
      { href: "/automation", label: "Automation", icon: Settings },
      { href: "/business", label: "Business Ops", icon: Zap },
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
      { href: "/search", label: "Advanced Search", icon: Filter },
      { href: "/learn", label: "Learning Hub", icon: BookOpen },
    ],
  },
]

export function SidebarNav() {
    const pathname = usePathname()
    const { state, toggleSidebar } = useSidebar()
    const collapsed = state === "collapsed"

    return (
        <Sidebar collapsible="icon" className="bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
            <SidebarHeader className="px-4 py-5">
                <Link href="/" className="flex items-center gap-3 rounded-3xl border border-sidebar-border bg-sidebar-primary/10 p-3 shadow-lg transition hover:border-primary/30">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-600 via-cyan-600 to-blue-600 text-white shadow-xl">
                        <Zap className="size-5" />
                    </div>
                    {!collapsed && (
                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-sidebar-foreground">DropEase</p>
                            <p className="truncate text-[11px] text-muted-foreground">Modern dropshipping hub</p>
                        </div>
                    )}
                </Link>
            </SidebarHeader>

            <SidebarContent className="px-2">
                {navGroups.map((group) => (
                    <SidebarGroup key={group.label}>
                        {!collapsed && (
                            <SidebarGroupLabel className="px-3 pb-1 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                                {group.label}
                            </SidebarGroupLabel>
                        )}
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
                                                    "group flex h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-medium transition hover:bg-accent hover:text-accent-foreground",
                                                    isActive ? "bg-primary/15 text-primary shadow-md" : "text-muted-foreground"
                                                )}
                                            >
                                                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-accent-foreground transition group-hover:bg-primary/20">
                                                    <Icon className="size-4" />
                                                </span>
                                                {!collapsed && <span>{item.label}</span>}
                                            </Link>
                                        </SidebarMenuItem>
                                    )
                                })}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>

            <SidebarFooter className="px-3 py-4">
                <div className="rounded-xl border border-border bg-card p-3 text-muted-foreground">
                    <div className="flex items-center justify-between gap-3">
                        {!collapsed ? (
                            <div>
                                <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Compact mode</p>
                                <p className="mt-1 text-[11px]">Use a smaller sidebar for focus.</p>
                            </div>
                        ) : (
                            <p className="text-[11px]">Compact layout</p>
                        )}
                        <Button variant="ghost" className="rounded-full border border-border bg-accent p-2" onClick={toggleSidebar}>
                            {collapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
                        </Button>
                    </div>
                </div>
            </SidebarFooter>
        </Sidebar>
    )
}
