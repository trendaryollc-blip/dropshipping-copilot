import { Truck } from "lucide-react"
import CarrierHub from "@/components/shipping/carrier-hub"
import ZoneEditor from "@/components/shipping/zone-editor"
import ManifestPrinter from "@/components/shipping/manifest-printer"
import RmaManager from "@/components/shipping/rma-manager"
import RateCardManager from "@/components/shipping/rate-card"
import WebhookManager from "@/components/shipping/webhook-manager"
import ShippingAnalytics from "@/components/shipping/analytics"
import MultiPackageManager from "@/components/shipping/multi-package"

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
    </div>
  )
}
