import createMockAdapter from "@/lib/shipping-adapters/mock-adapter"
import createUpsAdapter from "@/lib/shipping-adapters/ups-adapter"
import createFedexAdapter from "@/lib/shipping-adapters/fedex-adapter"
import type { ShippingAdapter } from "@/lib/shipping-adapters"

const factories: Record<string, () => ShippingAdapter> = {
  MockCarrier: createMockAdapter,
  UPS: createUpsAdapter,
  FedEx: createFedexAdapter,
}

export function getAdapterForProvider(provider: string): ShippingAdapter | null {
  const factory = factories[provider]
  if (!factory) return null
  try {
    return factory()
  } catch (e) {
    console.error("Failed to create adapter for", provider, e)
    return null
  }
}
