import type { ShippingAdapter } from "@/lib/shipping-adapters"
import type { ShippingRate, ShipmentTracking } from "@/types"
import { getRatesForShipment, generateHTMLLabel, trackShipmentMock } from "@/lib/shipping-service"

export default function createFedexAdapter(): ShippingAdapter {
  return {
    id: "fedex_adapter",
    provider: "FedEx",
    async connect() {
      return true
    },
    async getRates(params: { origin: string; destination: string; weight: number }): Promise<ShippingRate[]> {
      const rates = getRatesForShipment(params)
      return rates.map(r => ({ ...r, provider: "FedEx" }))
    },
    async createLabel(rate: ShippingRate, shipmentInfo: { to: string; from: string; weight: number }): Promise<string | null> {
      return generateHTMLLabel({ ...rate, provider: "FedEx" }, shipmentInfo)
    },
    async track(trackingNumber: string): Promise<ShipmentTracking> {
      return trackShipmentMock(trackingNumber)
    },
  }
}
