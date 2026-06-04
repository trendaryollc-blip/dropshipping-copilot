"use client"
import React, { useEffect, useState } from "react"
import { useShippingStore } from "@/store/useShippingStore"
import { generateShippingLabel } from "@/lib/shipping-service"
import type { ShippingRate } from "@/types"

export default function CarrierHub() {
  const carriers = useShippingStore((s) => s.carriers)
  const load = useShippingStore((s) => s.load)
  const addCarrier = useShippingStore((s) => s.addCarrier)
  const removeCarrier = useShippingStore((s) => s.removeCarrier)
  const compareRates = useShippingStore((s) => s.compareRates)

  const [provider, setProvider] = useState("")
  const [accountName, setAccountName] = useState("")
  const [origin, setOrigin] = useState("")
  const [destination, setDestination] = useState("")
  const [weight, setWeight] = useState("1")
  const [rates, setRates] = useState<ShippingRate[]>([])

  useEffect(() => { load() }, [load])

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
        <h3 className="font-semibold">Carrier Accounts</h3>
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
          {carriers.map((c) => (
            <div key={c.id} className="flex items-center justify-between p-2 border rounded">
              <div>
                <div className="font-medium">{c.provider}</div>
                <div className="text-sm text-gray-500">{c.accountName} • {c.connected ? "Connected" : "Disconnected"}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => removeCarrier(c.id)} className="px-2 py-1 border rounded text-sm">Remove</button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <h4 className="font-medium">Add Carrier (mock)</h4>
          <div className="flex gap-2 mt-2">
            <input placeholder="Provider (UPS/DHL/FedEx)" value={provider} onChange={(e) => setProvider(e.target.value)} className="border rounded p-2 flex-1" />
            <input placeholder="Account name" value={accountName} onChange={(e) => setAccountName(e.target.value)} className="border rounded p-2 flex-1" />
            <button onClick={() => { if (provider && accountName) { addCarrier({ provider, accountName }); setProvider(""); setAccountName("") } }} className="px-3 py-1 bg-blue-600 text-white rounded">Add</button>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
        <h3 className="font-semibold">Rate Comparison</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mt-3">
          <input placeholder="Origin country (e.g. CN)" value={origin} onChange={(e) => setOrigin(e.target.value)} className="border rounded p-2" />
          <input placeholder="Destination country (e.g. US)" value={destination} onChange={(e) => setDestination(e.target.value)} className="border rounded p-2" />
          <input placeholder="Weight (kg)" value={weight} onChange={(e) => setWeight(e.target.value)} className="border rounded p-2" />
          <button onClick={() => setRates(compareRates({ origin, destination, weight: Number(weight) }))} className="px-3 py-1 bg-indigo-600 text-white rounded">Compare</button>
        </div>

        {rates.length > 0 && (
          <div className="mt-4">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-sm text-gray-600"><th>Provider</th><th>Service</th><th>Cost</th><th>ETA</th><th></th></tr>
              </thead>
              <tbody>
                {rates.map((r, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="py-2">{r.provider}</td>
                    <td className="py-2">{r.service}</td>
                    <td className="py-2">${r.cost}</td>
                    <td className="py-2">{r.estimatedDelivery}</td>
                    <td className="py-2"><button onClick={() => {
                      const url = generateShippingLabel(r, { to: destination || "Unknown", from: origin || "Unknown", weight: Number(weight) })
                      if (url) {
                        const a = document.createElement('a')
                        a.href = url
                        a.download = `${r.provider}_${Date.now()}.txt`
                        document.body.appendChild(a)
                        a.click()
                        a.remove()
                      }
                    }} className="px-2 py-1 bg-green-600 text-white rounded text-sm">Generate Label</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
