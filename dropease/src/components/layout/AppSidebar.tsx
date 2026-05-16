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
  ChevronRight,
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

export function AppSidebar() {
  const pathname = usePathname()
  const { state } = useSidebar()
  const collapsed = state === "collapsed"

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarHeader className="px-4 py-5">
        <Link href="/" className="flex items-center gap-2.5 min-w-0">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/20">
            <Zap className="size-4 text-white" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-base font-bold tracking-tight text-white">DropEase</p>
              <p className="truncate text-[11px] text-white/60">Dropshipping Assistant</p>
            </div>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {navGroups.map((group) => (
          <SidebarGroup key={group.label}>
            {!collapsed && (
              <SidebarGroupLabel className="text-white/40 text-[10px] uppercase tracking-widest mb-1 px-3">
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
                        tooltip={item.label}
                        className={cn(
                          "h-9 rounded-lg px-3 text-white/70 transition-all",
                          "hover:bg-white/10 hover:text-white",
                          isActive && "bg-white/15 text-white font-medium"
                        )}
                        render={
                          <Link href={item.href} className="flex items-center gap-2.5">
                            <Icon className="size-4 shrink-0" />
                            <span className="text-sm">{item.label}</span>
                            {isActive && !collapsed && (
                              <ChevronRight className="ml-auto size-3 text-white/40" />
                            )}
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

      <SidebarFooter className="px-4 py-4">
        {!collapsed && (
          <div className="rounded-xl bg-white/10 p-3">
            <p className="text-xs font-semibold text-white">💡 New!</p>
            <p className="mt-1 text-[11px] leading-relaxed text-white/60">
              Try the Profit Calculator to find your ideal selling price.
            </p>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
