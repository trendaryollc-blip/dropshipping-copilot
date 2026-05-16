import type { ShippingAdapter } from "@/lib/shipping-adapters"
import type { ShippingRate, ShipmentTracking } from "@/types"
import { getRatesForShipment, generateHTMLLabel, trackShipmentMock } from "@/lib/shipping-service"

export default function createUpsAdapter(): ShippingAdapter {
  return {
    id: "ups_adapter",
    provider: "UPS",
    async connect() {
      // mock connect
      return true
    },
    async getRates(params: { origin: string; destination: string; weight: number }): Promise<ShippingRate[]> {
      // add UPS-specific modifier
      const rates = getRatesForShipment(params)
      return rates.map(r => ({ ...r, provider: "UPS" }))
    },
    async createLabel(rate: ShippingRate, shipmentInfo: { to: string; from: string; weight: number }): Promise<string | null> {
      return generateHTMLLabel({ ...rate, provider: "UPS" }, shipmentInfo)
    },
    async track(trackingNumber: string): Promise<ShipmentTracking> {
      return trackShipmentMock(trackingNumber)
    },
  }
}
