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
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Shipping & Carriers Hub</h1>
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
    </main>
  )
}
