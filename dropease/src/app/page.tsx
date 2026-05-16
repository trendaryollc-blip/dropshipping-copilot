import {
  Package2,
  Users,
  ShoppingCart,
  DollarSign,
  Search,
  FileText,
  Truck,
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
  import: "bg-emerald-400/15 text-emerald-300",
  order: "bg-cyan-400/15 text-cyan-300",
  supplier: "bg-violet-400/15 text-violet-300",
  description: "bg-fuchsia-400/15 text-fuchsia-300",
}

const activityIconMap: Record<ActivityItem["type"], React.ReactNode> = {
  import: <Package2 className="size-5" />,
  order: <ShoppingCart className="size-5" />,
  supplier: <Users className="size-5" />,
  description: <FileText className="size-5" />,
}

export default function DashboardPage() {
  const stats = dashboardStats

  return (
    <div className="space-y-8">
      <section className="space-y-6">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-emerald-300/80">Dashboard</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Modern dropshipping command center
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
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
            gradient="from-emerald-500 via-cyan-500 to-slate-900"
          />
          <DashboardCard
            title="Orders pending"
            value={stats.ordersPending}
            subtitle="Active order queue"
            trend={`+${stats.ordersChange}% order flow`}
            icon={<ShoppingCart className="size-6" />}
            gradient="from-violet-500 via-fuchsia-500 to-slate-900"
          />
          <DashboardCard
            title="Suppliers"
            value={stats.suppliersConnected}
            subtitle="Verified partners"
            trend={`+${stats.suppliersChange}% network growth`}
            icon={<Users className="size-6" />}
            gradient="from-cyan-400 via-teal-400 to-slate-900"
          />
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Quick Actions</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Triggers for speed and focus</h2>
            </div>
            <p className="text-sm text-slate-400">Use the most important actions whenever you need a boost.</p>
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

          <div className="rounded-[2rem] border border-white/10 bg-slate-950/95 p-5 shadow-[0_35px_90px_-50px_rgba(0,0,0,0.55)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-emerald-300/80">Recent activity</p>
                <h2 className="mt-2 text-xl font-semibold text-white">Timeline updates</h2>
              </div>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-300">Live</span>
            </div>

            <div className="mt-5 space-y-4">
            {recentActivity.map((item) => (
                <ActivityFeedItem
                  key={item.id}
                  icon={activityIconMap[item.type]}
                  title={item.message}
                  time={item.time}
                  accent={activityAccent[item.type]}
                />
              ))}
            </div>

            <div className="mt-5 flex justify-center">
              <Link href="/activity" className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm text-white transition hover:bg-white/10">
                Load more
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
