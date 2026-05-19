import type { ShippingRate, ShipmentTracking } from "@/types"

export interface ShippingAdapterConfig {
  apiKey?: string
  accountNumber?: string
  username?: string
  password?: string
}

export interface ShippingAdapter {
  id: string
  provider: string
  connect: (config: ShippingAdapterConfig) => Promise<boolean>
  getRates: (params: { origin: string; destination: string; weight: number }) => Promise<ShippingRate[]>
  createLabel: (rate: ShippingRate, shipmentInfo: { to: string; from: string; weight: number }) => Promise<string | null>
  track: (trackingNumber: string) => Promise<ShipmentTracking>
}

export type AdapterFactory = (opts?: any) => ShippingAdapter
