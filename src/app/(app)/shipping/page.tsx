import Link from "next/link"
import { Truck, Package, Clock, Zap, ArrowRight, BarChart3 } from "lucide-react"
import CarrierHub from "@/components/shipping/carrier-hub"
import ZoneEditor from "@/components/shipping/zone-editor"
import ManifestPrinter from "@/components/shipping/manifest-printer"
import RmaManager from "@/components/shipping/rma-manager"
import RateCardManager from "@/components/shipping/rate-card"
import WebhookManager from "@/components/shipping/webhook-manager"
import ShippingAnalytics from "@/components/shipping/analytics"
import MultiPackageManager from "@/components/shipping/multi-package"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

const RELATED_TOOLS = [
  {
    href: "/orders",
    icon: Package,
    label: "Orders",
    description: "View and manage shipments",
    color: "from-blue-500/10 to-cyan-500/10 border-blue-500/20 hover:border-blue-500/50",
    iconBg: "bg-blue-500/10 text-blue-600",
    badge: "Fulfillment",
  },
  {
    href: "/returns",
    icon: Truck,
    label: "Returns",
    description: "Handle return shipments",
    color: "from-violet-500/10 to-purple-500/10 border-violet-500/20 hover:border-violet-500/50",
    iconBg: "bg-violet-500/10 text-violet-600",
    badge: "Support",
  },
  {
    href: "/analytics",
    icon: BarChart3,
    label: "Analytics",
    description: "View shipping metrics",
    color: "from-emerald-500/10 to-teal-500/10 border-emerald-500/20 hover:border-emerald-500/50",
    iconBg: "bg-emerald-500/10 text-emerald-600",
    badge: "Insights",
  },
  {
    href: "/automation",
    icon: Clock,
    label: "Automation",
    description: "Automate shipping rules",
    color: "from-amber-500/10 to-orange-500/10 border-amber-500/20 hover:border-amber-500/50",
    iconBg: "bg-amber-500/10 text-amber-600",
    badge: "Workflow",
  },
]

export const metadata = { title: "Shipping - DropEase" }

export default function ShippingPage() {
  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl border border-border/50 bg-card/60 p-6 backdrop-blur-sm sm:p-8 animate-in">
        <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-violet-500/5 blur-3xl" />
        <div className="absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-primary/5 blur-2xl" />
        <div className="relative z-10 flex flex-col gap-4">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-violet-600 dark:text-violet-400">
              <Truck className="size-3" />
              Shipping
            </span>
            <h1 className="hero-title">Shipping & Carriers Hub</h1>
            <p className="max-w-lg text-sm leading-relaxed text-muted-foreground/70">
              Manage carriers, zones, rates, and fulfillment from one dashboard.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Overview */}
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { label: "Active Carriers", value: 4, icon: Truck, color: "bg-primary/10 text-primary" },
          { label: "Shipping Zones", value: 12, icon: Package, color: "bg-emerald-500/10 text-emerald-600" },
          { label: "Avg Delivery", value: "3.2d", icon: Clock, color: "bg-amber-500/10 text-amber-600" },
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <CarrierHub />
          <ManifestPrinter />
        </div>
        <div className="space-y-6">
          <ZoneEditor />
          <RateCardManager />
          <RmaManager />
          <WebhookManager />
          <MultiPackageManager />
          <ShippingAnalytics />
        </div>
      </div>

      {/* Related Tools */}
      <section className="space-y-4 animate-in delay-3">
        <div className="flex items-center gap-2">
          <Zap className="size-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">Related Tools</h2>
          <span className="text-xs text-muted-foreground">— streamline your fulfillment</span>
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
