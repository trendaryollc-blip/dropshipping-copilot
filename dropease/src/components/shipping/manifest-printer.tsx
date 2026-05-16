"use client"
import React, { useState, useEffect } from "react"
import { useShipmentStore } from "@/store/useShipmentStore"

export default function ManifestPrinter() {
  const shipments = useShipmentStore((s) => s.shipments)
  const exportManifest = useShipmentStore((s) => s.exportManifest)
  const [selected, setSelected] = useState<string[]>([])

  useEffect(() => { if (shipments.length && selected.length === 0) setSelected(shipments.slice(0,3).map(s=>s.id)) }, [shipments])

  return (
    <div className="bg-white shadow rounded p-4">
      <h3 className="font-semibold">Manifest Printer</h3>
      <div className="text-sm text-gray-500">Select shipments and export manifests or generate customs CSV</div>
      <div className="mt-3">
        <ul className="space-y-2">
          {shipments.map(s=> (
            <li key={s.id} className="flex items-center gap-2">
              <input type="checkbox" checked={selected.includes(s.id)} onChange={(e)=> setSelected(prev => e.target.checked ? [...prev, s.id] : prev.filter(id=>id!==s.id))} />
              <div className="flex-1">{s.id} • {s.to} • {s.weight}kg • {s.carrier || '—'}</div>
            </li>
          ))}
        </ul>
        <div className="mt-3">
          <button onClick={()=>{
            const url = exportManifest(selected)
            if (url) {
              const a = document.createElement('a')
              a.href = url
              a.download = `manifest_${Date.now()}.csv`
              document.body.appendChild(a)
              a.click()
              a.remove()
            }
          }} className="px-3 py-1 bg-indigo-600 text-white rounded">Export Manifest</button>
          <button onClick={()=>{
            const items = shipments.filter(s => selected.includes(s.id)).map(s => ({ id: s.id, hsCode: '', description: `Shipment to ${s.to}`, quantity: 1, value: 0, originCountry: s.from }))
            const { generateCustomsCSV } = require("@/lib/shipping-service")
            const url = generateCustomsCSV(items)
            if (url) { const a = document.createElement('a'); a.href = url; a.download = `customs_${Date.now()}.csv`; document.body.appendChild(a); a.click(); a.remove(); }
          }} className="px-3 py-1 border rounded ml-2">Export Customs CSV</button>
        </div>
      </div>
    </div>
  )
}
