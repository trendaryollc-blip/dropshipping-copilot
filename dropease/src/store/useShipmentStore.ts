"use client"
import { create } from "zustand"
import type { ShipmentTracking } from "@/types"
import { trackShipmentMock, generateManifestCSV } from "@/lib/shipping-service"

interface ShipmentRecord {
  id: string
  orderId?: string
  to: string
  from: string
  weight: number
  carrier?: string
  trackingNumber?: string
  status: string
}

interface RMARecord {
  rmaId: string
  orderId: string
  reason?: string
  createdAt: string
  status: string
}

interface ShipmentState {
  shipments: ShipmentRecord[]
  rmas: RMARecord[]
  addShipment: (s: Omit<ShipmentRecord, "id" | "status">) => void
  track: (trackingNumber: string) => ShipmentTracking
  exportManifest: (ids: string[]) => string | null
  createRMA: (orderId: string, reason?: string) => void
}

export const useShipmentStore = create<ShipmentState>((set, get) => ({
  shipments: [],
  rmas: [],
  addShipment: (s) => {
    const rec = { ...s, id: crypto.randomUUID(), status: "created" }
    set((state) => ({ shipments: [rec, ...state.shipments] }))
  },
  track: (trackingNumber) => trackShipmentMock(trackingNumber),
  exportManifest: (ids) => {
    const state = get()
    const items = state.shipments.filter(s => ids.includes(s.id))
    if (!items.length) return null
    return generateManifestCSV(items.map(i => ({ id: i.id, to: i.to, from: i.from, weight: i.weight, carrier: i.carrier })))
  },
  createRMA: (orderId, reason) => {
    const rma = { rmaId: `RMA-${Math.random().toString(36).slice(2,9).toUpperCase()}`, orderId, reason, createdAt: new Date().toISOString(), status: "pending" }
    set((state) => ({ rmas: [rma, ...state.rmas] }))
  },
}))
