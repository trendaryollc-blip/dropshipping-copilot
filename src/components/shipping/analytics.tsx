"use client"
import React, { useMemo } from "react"
import { useShipmentStore } from "@/store/useShipmentStore"
import { useShippingStore } from "@/store/useShippingStore"
import { exportShippingAnalyticsCSV } from "@/lib/shipping-service"

export default function ShippingAnalytics() {
  const shipments = useShipmentStore((s) => s.shipments)
  const carriers = useShippingStore((s) => s.carriers)

  const stats = useMemo(() => {
    const byCarrier: Record<string, { count: number; totalWeight: number }> = {}
    for (const s of shipments) {
      const key = s.carrier || 'Unassigned'
      if (!byCarrier[key]) byCarrier[key] = { count: 0, totalWeight: 0 }
      byCarrier[key].count += 1
      byCarrier[key].totalWeight += s.weight
    }
    return { totalShipments: shipments.length, byCarrier }
  }, [shipments])

  return (
    <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
      <h3 className="font-semibold">Shipping Analytics (basic)</h3>
      <div className="mt-2">
        <button onClick={() => {
          const url = exportShippingAnalyticsCSV(shipments.map(s => ({ id: s.id, to: s.to, from: s.from, weight: s.weight, carrier: s.carrier, status: s.status })))
          if (url) {
            const a = document.createElement('a')
            a.href = url
            a.download = `shipping_analytics_${Date.now()}.csv`
            document.body.appendChild(a)
            a.click()
            a.remove()
          }
        }} className="px-3 py-1 bg-gray-800 text-white rounded text-sm">Export CSV</button>
      </div>
      <div className="mt-3 text-sm">
        <div>Total shipments: <strong>{stats.totalShipments}</strong></div>
        <div className="mt-2">
          <h4 className="font-medium">By Carrier</h4>
          <ul className="mt-2 space-y-2">
            {Object.keys(stats.byCarrier).map(k => (
              <li key={k} className="flex justify-between text-sm"><div>{k}</div><div>{stats.byCarrier[k].count} shipments • {stats.byCarrier[k].totalWeight.toFixed(2)} kg</div></li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
