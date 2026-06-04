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
  { href: "/products", label: "Find Products", desc: "Discover winning items with strong margins.", icon: <Search className="size-5" />, accent: "bg-emerald-400" },
  { href: "/suppliers", label: "Find Suppliers", desc: "Connect with reliable suppliers fast.", icon: <Users className="size-5" />, accent: "bg-cyan-400" },
  { href: "/description", label: "Generate Description", desc: "Create product copy with AI in seconds.", icon: <FileText className="size-5" />, accent: "bg-violet-400" },
  { href: "/orders", label: "Track Orders", desc: "Monitor shipments and fulfillment status.", icon: <Truck className="size-5" />, accent: "bg-fuchsia-400" },
]

const activityAccent = {
  import: "bg-emerald-400",
  order: "bg-cyan-400",
  supplier: "bg-violet-400",
  description: "bg-fuchsia-400",
  automation: "bg-amber-400",
  return: "bg-rose-400",
}

const activityIconMap: Record<ActivityItem["type"], React.ReactNode> = {
  import: <Package2 className="size-5" />,
  order: <ShoppingCart className="size-5" />,
  supplier: <Users className="size-5" />,
  description: <FileText className="size-5" />,
  automation: <Bot className="size-5" />,
  return: <RotateCcw className="size-5" />,
}

export default function DashboardPage() {
  const stats = dashboardStats

  return (
    <div className="space-y-8">
      <section className="space-y-6">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-primary/80">Dashboard</p>
          <h1 className="page-header">Modern dropshipping command center</h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
            Monitor revenue, suppliers, automation, and market momentum from one elegant dashboard.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <DashboardCard
            title="Revenue"
            value={`$${stats.monthlyRevenue.toLocaleString()}`}
            subtitle="Monthly sales total"
            trend="+18% vs last month"
            icon={<DollarSign className="size-6" />}
            gradient="from-primary via-accent to-foreground"
          />
          <DashboardCard
            title="Orders pending"
            value={stats.ordersPending}
            subtitle="Active order queue"
            trend={`+${stats.ordersChange}% order flow`}
            icon={<ShoppingCart className="size-6" />}
            gradient="from-accent via-primary to-foreground"
          />
          <DashboardCard
            title="Suppliers"
            value={stats.suppliersConnected}
            subtitle="Verified partners"
            trend={`+${stats.suppliersChange}% network growth`}
            icon={<Users className="size-6" />}
            gradient="from-info via-accent to-foreground"
          />
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">Quick Actions</p>
              <h2 className="mt-2 text-2xl font-semibold text-foreground">Triggers for speed and focus</h2>
            </div>
            <p className="text-sm text-muted-foreground">Use the most important actions whenever you need a boost.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {quickActions.map((action) => (
              <QuickActionTile key={action.href} href={action.href} label={action.label} desc={action.desc} icon={action.icon} accent={action.accent} />
            ))}
          </div>

          <InsightsFooter />
        </div>

        <div className="space-y-6">
          <AIInsightsPanel />

          <div className="rounded-[2rem] border border-border bg-gradient-to-br from-card-solid via-card-solid to-card-solid p-5 shadow-[0_20px_60px_-24px_rgba(212,168,83,0.22)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-primary/80">Recent activity</p>
                <h2 className="mt-2 text-xl font-semibold text-foreground">Timeline updates</h2>
              </div>
              <span className="rounded-full bg-primary-light/50 px-3 py-1 text-xs uppercase tracking-[0.24em] text-primary">Live</span>
            </div>

            <div className="mt-5 space-y-4">
            {recentActivity.map((item) =>
                <ActivityFeedItem
                  key={item.id}
                  icon={activityIconMap[item.type]}
                  title={item.message}
                  time={item.time}
                  accent={activityAccent[item.type]}
                  badgeTextColor="text-muted-foreground"
                />
              )}
            </div>

            <div className="mt-5 flex justify-center">
              <Link href="/activity" className="rounded-full border border-border bg-muted/70 px-5 py-2 text-sm text-primary transition hover:bg-primary-light/70">
                Load more
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
