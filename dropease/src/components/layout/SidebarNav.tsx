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
    <Sidebar collapsible="icon" className="bg-slate-950/95 text-slate-100 shadow-2xl shadow-slate-950/40 border-r border-white/10">
      <SidebarHeader className="px-4 py-5">
        <Link href="/" className="flex items-center gap-3 rounded-3xl border border-white/10 bg-slate-900/80 p-3 shadow-[0_30px_60px_-45px_rgba(0,255,186,0.65)] transition hover:border-emerald-300/50">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-400 text-slate-950 shadow-xl shadow-teal-500/20">
            <Zap className="size-5" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">DropEase</p>
              <p className="truncate text-[11px] text-slate-400">Modern dropshipping hub</p>
            </div>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2">
        {navGroups.map((group) => (
          <SidebarGroup key={group.label}>
            {!collapsed && (
              <SidebarGroupLabel className="px-3 pb-1 text-[10px] uppercase tracking-[0.3em] text-slate-500">
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
                      <SidebarMenuButton
                        isActive={isActive}
                        tooltip={collapsed ? item.label : undefined}
                        className={cn(
                          "group flex h-11 w-full items-center gap-3 rounded-3xl px-3 text-sm font-medium transition hover:bg-white/10 hover:text-white",
                          isActive ? "bg-gradient-to-r from-emerald-400/15 to-cyan-400/10 text-white shadow-[0_20px_80px_-60px_rgba(0,255,186,0.5)]" : "text-slate-300"
                        )}
                        render={
                          <Link href={item.href} className="flex w-full items-center gap-3">
                            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/5 text-slate-200 transition group-hover:bg-white/10 group-hover:text-white">
                              <Icon className="size-4" />
                            </span>
                            {!collapsed && <span>{item.label}</span>}
                          </Link>
                        }
                      />
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="px-3 py-4">
        <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-3 text-slate-300 shadow-lg shadow-slate-950/30">
          <div className="flex items-center justify-between gap-3">
            {!collapsed ? (
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Compact mode</p>
                <p className="mt-1 text-[11px] text-slate-400">Use a smaller sidebar for focus.</p>
              </div>
            ) : (
              <p className="text-[11px] text-slate-400">Compact layout</p>
            )}
            <Button variant="ghost" className="rounded-full border border-white/10 bg-white/5 p-2 text-slate-200 hover:bg-white/10" onClick={toggleSidebar}>
              {collapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
            </Button>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
