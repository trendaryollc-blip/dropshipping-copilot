import {
  Package2,
  Users,
  ShoppingCart,
  DollarSign,
  Search,
  FileText,
  Truck,
  Bot,
  RotateCcw,
  ArrowRight,
  Sparkles,
} from "lucide-react"
import Link from "next/link"
import { dashboardStats, recentActivity } from "@/lib/mock-data"
import type { ActivityItem } from "@/types"
import { DashboardCard } from "@/components/dashboard/DashboardCard"
import { QuickActionTile } from "@/components/dashboard/QuickActionTile"
import { ActivityFeedItem } from "@/components/dashboard/ActivityFeedItem"
import { AIInsightsPanel } from "@/components/dashboard/AIInsightsPanel"
import { InsightsFooter } from "@/components/dashboard/InsightsFooter"

const quickActions = [
  { href: "/products", label: "Find Products", desc: "Discover winning items with strong margins.", icon: <Search className="size-5" />, accent: "bg-gradient-to-br from-emerald-400 to-teal-500" },
  { href: "/suppliers", label: "Find Suppliers", desc: "Connect with reliable suppliers fast.", icon: <Users className="size-5" />, accent: "bg-gradient-to-br from-cyan-400 to-blue-500" },
  { href: "/description", label: "Generate Description", desc: "Create product copy with AI in seconds.", icon: <FileText className="size-5" />, accent: "bg-gradient-to-br from-violet-400 to-purple-500" },
  { href: "/orders", label: "Track Orders", desc: "Monitor shipments and fulfillment status.", icon: <Truck className="size-5" />, accent: "bg-gradient-to-br from-fuchsia-400 to-pink-500" },
]

const activityAccent = {
  import: "bg-gradient-to-br from-emerald-400 to-teal-500",
  order: "bg-gradient-to-br from-cyan-400 to-blue-500",
  supplier: "bg-gradient-to-br from-violet-400 to-purple-500",
  description: "bg-gradient-to-br from-fuchsia-400 to-pink-500",
  automation: "bg-gradient-to-br from-amber-400 to-orange-500",
  return: "bg-gradient-to-br from-rose-400 to-red-500",
}

const activityIconMap: Record<ActivityItem["type"], React.ReactNode> = {
  import: <Package2 className="size-4" />,
  order: <ShoppingCart className="size-4" />,
  supplier: <Users className="size-4" />,
  description: <FileText className="size-4" />,
  automation: <Bot className="size-4" />,
  return: <RotateCcw className="size-4" />,
}

export default function DashboardPage() {
  const stats = dashboardStats

  return (
    <div className="space-y-8">
      {/* ═══ Hero Section ═══ */}
      <section className="relative overflow-hidden rounded-3xl border border-border/50 bg-card/60 p-6 backdrop-blur-sm sm:p-8 animate-in">
        {/* Decorative elements */}
        <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-accent/5 blur-2xl" />
        <div className="absolute right-1/4 top-1/2 h-20 w-20 -translate-y-1/2 rounded-full bg-info/5 blur-xl" />
        
        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                <Sparkles className="size-3" />
                Command Center
              </span>
            </div>
            <h1 className="hero-title">
              Welcome to your<br />dropshipping HQ
            </h1>
            <p className="max-w-lg text-sm leading-relaxed text-muted-foreground/70">
              Monitor revenue, suppliers, automation, and market momentum from one elegant dashboard.
            </p>
          </div>
          
          <Link href="/products" className="group inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-primary to-primary-medium px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02]">
            Start Research
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      {/* ═══ Stats Cards ═══ */}
      <section>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <div className="delay-1">
            <DashboardCard
              title="Revenue"
              value={`$${stats.monthlyRevenue.toLocaleString()}`}
              subtitle="Monthly sales total"
              trend="+18% vs last month"
              icon={<DollarSign className="size-5" />}
              gradient="from-primary via-accent to-foreground"
              href="/analytics"
            />
          </div>
          <div className="delay-2">
            <DashboardCard
              title="Orders pending"
              value={stats.ordersPending}
              subtitle="Active order queue"
              trend={`+${stats.ordersChange}% order flow`}
              icon={<ShoppingCart className="size-5" />}
              gradient="from-accent via-primary to-foreground"
              href="/orders"
            />
          </div>
          <div className="delay-3">
            <DashboardCard
              title="Suppliers"
              value={stats.suppliersConnected}
              subtitle="Verified partners"
              trend={`+${stats.suppliersChange}% network growth`}
              icon={<Users className="size-5" />}
              gradient="from-info via-accent to-foreground"
              href="/suppliers"
            />
          </div>
        </div>
      </section>

      {/* ═══ Main Content Grid ═══ */}
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_400px]">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Quick Actions Header */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="section-label">Quick Actions</p>
              <h2 className="mt-2 text-xl font-bold text-foreground">Triggers for speed</h2>
            </div>
            <Link href="/products" className="group hidden items-center gap-1.5 text-xs font-medium text-primary/60 transition-colors hover:text-primary sm:inline-flex">
              View all
              <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Quick Actions Grid */}
          <div className="grid gap-3 sm:grid-cols-2">
            {quickActions.map((action, i) => (
              <div key={action.href} className={`delay-${i + 2}`}>
                <QuickActionTile {...action} />
              </div>
            ))}
          </div>

          {/* Insights */}
          <InsightsFooter />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* AI Insights */}
          <AIInsightsPanel />

          {/* Recent Activity */}
          <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-card/60 p-5 backdrop-blur-sm">
            <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-accent/5 blur-2xl" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-emerald-600 dark:text-emerald-400">
                      <span className="relative flex size-1.5">
                        <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
                      </span>
                      Live
                    </span>
                  </div>
                  <h2 className="mt-3 text-lg font-bold text-foreground">Recent activity</h2>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                {recentActivity.map((item) => (
                  <ActivityFeedItem
                    key={item.id}
                    icon={activityIconMap[item.type]}
                    title={item.message}
                    time={item.time}
                    accent={activityAccent[item.type]}
                    href="/activity"
                  />
                ))}
              </div>

              <div className="mt-4 flex justify-center">
                <Link href="/activity" className="group inline-flex items-center gap-1.5 rounded-xl border border-border/50 bg-card/40 px-4 py-2 text-xs font-medium text-muted-foreground/70 transition-all duration-300 hover:border-primary/20 hover:bg-card/60 hover:text-foreground">
                  Load more
                  <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}