"use client"
import React, { useState } from "react"
import { useShipmentStore } from "@/store/useShipmentStore"

export default function RmaManager() {
  const rmas = useShipmentStore(s => s.rmas)
  const createRMA = useShipmentStore(s => s.createRMA)
  const [orderId, setOrderId] = useState("")
  const [reason, setReason] = useState("")

  return (
    <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
      <h3 className="font-semibold">Returns / RMA</h3>
      <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2">
        <input placeholder="Order ID" value={orderId} onChange={(e) => setOrderId(e.target.value)} className="border rounded p-2" />
        <input placeholder="Reason" value={reason} onChange={(e) => setReason(e.target.value)} className="border rounded p-2" />
        <button onClick={() => { if (orderId) { createRMA(orderId, reason); setOrderId(""); setReason("") } }} className="px-3 py-1 bg-green-600 text-white rounded">Create RMA</button>
      </div>

      <div className="mt-4">
        <h4 className="font-medium">Open RMAs</h4>
        <ul className="mt-2 space-y-2">
          {rmas.map(r => (
            <li key={r.rmaId} className="p-2 border rounded">
              <div className="font-medium">{r.rmaId} • {r.orderId}</div>
              <div className="text-xs text-gray-500">{r.reason} • {r.createdAt} • {r.status}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
