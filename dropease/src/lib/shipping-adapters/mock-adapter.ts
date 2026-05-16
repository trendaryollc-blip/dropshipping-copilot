import type { ShippingAdapter } from "@/lib/shipping-adapters"
import type { ShippingRate, ShipmentTracking } from "@/types"
import { getRatesForShipment, generateHTMLLabel, trackShipmentMock } from "@/lib/shipping-service"

export default function createMockAdapter(): ShippingAdapter {
  return {
    id: "mock_adapter",
    provider: "MockCarrier",
    async connect() {
      return true
    },
    async getRates(params: { origin: string; destination: string; weight: number }) {
      // reuse existing mock logic
      return getRatesForShipment(params)
    },
    async createLabel(rate: ShippingRate, shipmentInfo: { to: string; from: string; weight: number }) {
      return generateHTMLLabel(rate, shipmentInfo)
    },
    async track(trackingNumber: string) {
      return trackShipmentMock(trackingNumber)
    },
  }
}
