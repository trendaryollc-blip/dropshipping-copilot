"use client"
import { create } from "zustand"
import { nanoid } from "nanoid"
import { loadCarriersFromLocal, saveCarriersToLocal, generateMockCarriers, getRatesForShipment } from "@/lib/shipping-service"
import { getAdapterForProvider } from "@/lib/shipping-adapters/registry"
import type { ShippingRate } from "@/types"

interface CarrierConfig {
  id: string
  provider: string
  accountName: string
  connected: boolean
  createdAt: string
}

interface ShippingState {
  carriers: CarrierConfig[]
  load: () => void
  addCarrier: (c: { provider: string; accountName: string }) => void
  removeCarrier: (id: string) => void
  compareRates: (payload: { origin: string; destination: string; weight: number }) => ShippingRate[]
}

export const useShippingStore = create<ShippingState>((set) => ({
  carriers: [],
  load: () => {
    const fromStorage = loadCarriersFromLocal()
    const initial = fromStorage.length ? fromStorage : generateMockCarriers()
    set({ carriers: initial })
  },
  addCarrier: (c) =>
    set((state) => {
      const carrier: CarrierConfig = { id: nanoid(), provider: c.provider, accountName: c.accountName, connected: false, createdAt: new Date().toISOString() }
      const carriers = [carrier, ...state.carriers]
      saveCarriersToLocal(carriers)
      return { carriers }
    }),
  removeCarrier: (id) =>
    set((state) => {
      const carriers = state.carriers.filter((c) => c.id !== id)
      saveCarriersToLocal(carriers)
      return { carriers }
    }),
  compareRates: (payload) => {
    // Try adapters for connected carriers first
    try {
      const fromStorage = loadCarriersFromLocal()
      const connected = fromStorage.filter(c => c.connected)
      for (const c of connected) {
        const adapter = getAdapterForProvider(c.provider)
            if (adapter) {
              // call adapter implementation (may be sync mock)
              try {
                const rates = adapter.getRates(payload)
                // if adapter returns rates, prefer them
                return rates as ShippingRate[]
              } catch (e) {
                console.warn("Adapter getRates failed for", c.provider, e)
              }
            }
      }
    } catch (e) {
      console.warn("compareRates adapter path failed", e)
    }
    // fallback to local mock rates
    return getRatesForShipment(payload)
  },
}))
