"use client"

import { useState } from "react"
import Link from "next/link"
import { Users, Search, ShoppingCart, Tag, MessageSquare, Heart, DollarSign, Zap, ArrowRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AIActionButton } from "@/components/AIActionButton"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const RELATED_TOOLS = [
  {
    href: "/orders",
    icon: ShoppingCart,
    label: "Orders",
    description: "View and manage customer orders",
    color: "from-blue-500/10 to-cyan-500/10 border-blue-500/20 hover:border-blue-500/50",
    iconBg: "bg-blue-500/10 text-blue-600",
    badge: "Fulfillment",
  },
  {
    href: "/returns",
    icon: Tag,
    label: "Returns",
    description: "Handle return requests",
    color: "from-violet-500/10 to-purple-500/10 border-violet-500/20 hover:border-violet-500/50",
    iconBg: "bg-violet-500/10 text-violet-600",
    badge: "Support",
  },
  {
    href: "/automation",
    icon: MessageSquare,
    label: "CRM Messages",
    description: "Automate customer outreach",
    color: "from-emerald-500/10 to-teal-500/10 border-emerald-500/20 hover:border-emerald-500/50",
    iconBg: "bg-emerald-500/10 text-emerald-600",
    badge: "Engagement",
  },
  {
    href: "/analytics",
    icon: Heart,
    label: "Analytics",
    description: "Analyze customer behavior",
    color: "from-amber-500/10 to-orange-500/10 border-amber-500/20 hover:border-amber-500/50",
    iconBg: "bg-amber-500/10 text-amber-600",
    badge: "Insights",
  },
]

const CUSTOMERS = [
    { id: "CUST-001", name: "Emily Chen", email: "emily@example.com", orders: 12, spent: 245.99, lastOrder: "2024-01-15" },
    { id: "CUST-002", name: "James Cooper", email: "james@example.com", orders: 8, spent: 189.50, lastOrder: "2024-01-12" },
    { id: "CUST-003", name: "Priya Sharma", email: "priya@example.com", orders: 15, spent: 312.45, lastOrder: "2024-01-10" },
    { id: "CUST-004", name: "Luca Romano", email: "luca@example.com", orders: 5, spent: 98.75, lastOrder: "2024-01-08" },
    { id: "CUST-005", name: "Aisha Khan", email: "aisha@example.com", orders: 22, spent: 456.30, lastOrder: "2024-01-16" },
  ]

export default function CustomersPage() {
  const [search, setSearch] = useState("")
  const stats = {
    total: CUSTOMERS.length,
    totalRevenue: CUSTOMERS.reduce((sum, c) => sum + c.spent, 0),
    avgOrders: Math.round(CUSTOMERS.reduce((sum, c) => sum + c.orders, 0) / CUSTOMERS.length),
  }
  return (
    <div className="space-y-6">
      {/* ═══ Hero Section ═══ */}
      <section className="relative overflow-hidden rounded-3xl border border-border/50 bg-card/60 p-6 backdrop-blur-sm sm:p-8 animate-in">
        <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-violet-500/5 blur-3xl" />
        <div className="absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-primary/5 blur-2xl" />

        <div className="relative z-10 flex flex-col gap-4">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-violet-600 dark:text-violet-400">
              <Users className="size-3" />
              Customers
            </span>
            <h1 className="hero-title">Customer Management</h1>
            <p className="max-w-lg text-sm leading-relaxed text-muted-foreground/70">
              View, segment, and engage with your customers.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Overview */}
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { label: "Total Customers", value: stats.total, icon: Users, color: "bg-primary/10 text-primary" },
          { label: "$ Customer Revenue", value: `$${stats.totalRevenue.toFixed(2)}`, icon: Heart, color: "bg-emerald-500/10 text-emerald-600" },
          { label: "Avg Orders", value: stats.avgOrders.toString(), icon: ShoppingCart, color: "bg-amber-500/10 text-amber-600" },
        ].map(({ label, value, icon: Icon, color }, i) => (
          <div key={label} className={`stat-card card-interactive animate-in delay-${Math.min(i % 8 + 1, 8)}`}>
            <div className={`flex size-9 items-center justify-center rounded-lg ${color}`}>
              <Icon className="size-4" />
            </div>
            <div>
              <p className="text-xl font-bold">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search & AI */}
      <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/60 p-5 backdrop-blur-sm animate-in delay-1">
        <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-primary/5 blur-xl transition-all duration-500 group-hover:scale-[2] group-hover:bg-primary/10" />
        <div className="relative z-10 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Search className="size-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Search Customers</h3>
          </div>
          <Input placeholder="Search by name, email, or ID" className="h-9" />
          <Button className="w-full rounded-xl">Search</Button>

          <AIActionButton
            task="seo_optimization"
            input={{ productName: "Customer retention campaign", niche: "CRM", targetKeywords: ["customer retention", "loyalty", "repeat buyers"] }}
            label="AI Insights"
            onSuccess={() => {
              toast.success("AI customer insights ready")
            }}
          />
        </div>
      </div>

      {/* Customer List */}
      <div className="grid gap-3">
        {CUSTOMERS.map((customer) => (
          <div key={customer.id} className="relative overflow-hidden rounded-xl border border-border/50 bg-card/60 p-4 backdrop-blur-sm hover:shadow-sm transition-all duration-300 animate-in">
            <div className="absolute -right-6 -top-6 h-12 w-12 rounded-full bg-primary/5 blur-xl" />
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground">{customer.name}</p>
                <p className="text-xs text-muted-foreground">{customer.email}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-foreground">{customer.orders} orders</p>
                <p className="text-xs text-muted-foreground">${customer.spent.toFixed(2)} spent</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Related Tools */}
      <section className="space-y-4 animate-in delay-2">
        <div className="flex items-center gap-2">
          <Zap className="size-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">Related Tools</h2>
          <span className="text-xs text-muted-foreground">— streamline your workflow</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {RELATED_TOOLS.map((tool) => {
            const Icon = tool.icon
            return (
              <Link
                key={tool.href}
                href={tool.href}
                className={cn(
                  "group relative overflow-hidden rounded-2xl border bg-gradient-to-br p-5 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg",
                  tool.color
                )}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={cn("flex size-9 items-center justify-center rounded-xl", tool.iconBg)}>
                      <Icon className="size-4" />
                    </div>
                    <Badge variant="secondary" className="text-[9px] font-bold uppercase tracking-wide">{tool.badge}</Badge>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">{tool.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{tool.description}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-medium text-primary/80 group-hover:text-primary transition-colors">
                    Open Tool <ArrowRight className="size-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}
