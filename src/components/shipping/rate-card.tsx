"use client"
import React, { useState } from "react"
import { exportRateCardCSV, importRateCardFromCSV } from "@/lib/shipping-service"

export default function RateCardManager() {
  const [rateCard, setRateCard] = useState<{ provider: string; service: string; cost: number }[]>([])

  return (
    <div className="bg-white shadow rounded p-4">
      <h3 className="font-semibold">Rate Card</h3>
      <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2">
        <button onClick={() => {
          const url = exportRateCardCSV(rateCard)
          const a = document.createElement('a')
          a.href = url
          a.download = `ratecard_${Date.now()}.csv`
          document.body.appendChild(a)
          a.click()
          a.remove()
        }} className="px-3 py-1 bg-indigo-600 text-white rounded">Export Rate Card</button>

        <div>
          <label className="text-sm">Import Rate Card (CSV)</label>
          <input type="file" accept="text/csv" onChange={async (e) => {
            const f = e.target.files?.[0]
            if (!f) return
            const imported = await importRateCardFromCSV(f)
            setRateCard(imported)
          }} className="mt-1" />
        </div>
      </div>

      <div className="mt-3">
        <ul className="space-y-2">
          {rateCard.map((r, i) => (
            <li key={i} className="text-sm">{r.provider} • {r.service} • ${r.cost}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
