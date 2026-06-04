"use client"
import React, { useState } from "react"
import { nanoid } from "nanoid"
import { useShipmentStore } from "@/store/useShipmentStore"
import { generatePDFLabel, calculateInsuranceCost } from "@/lib/shipping-service"
import type { ShippingRate } from "@/types"

export default function MultiPackageManager() {
  const addShipment = useShipmentStore(s => s.addShipment)
  const [to, setTo] = useState("")
  const [from, setFrom] = useState("")
  const [packages, setPackages] = useState<{ id: string; weight: number }[]>([])
  const [w, setW] = useState("")
  const [declaredValue, setDeclaredValue] = useState("")
  const [insured, setInsured] = useState(false)

  function addPackage() {
    const weight = parseFloat(w)
    if (isNaN(weight) || weight <= 0) return
    setPackages(p => [{ id: nanoid(), weight }, ...p])
    setW("")
  }

  function submit() {
    const totalWeight = packages.reduce((s, p) => s + p.weight, 0)
    addShipment({ to, from, weight: totalWeight, carrier: undefined, trackingNumber: undefined })
    // insurance calc example
    const value = parseFloat(declaredValue) || 0
    const insuranceCost = calculateInsuranceCost(value, insured)
    alert(`Shipment created — total weight: ${totalWeight}kg — insurance: $${insuranceCost}`)
    setTo(""); setFrom(""); setPackages([]); setDeclaredValue(""); setInsured(false)
  }

  return (
    <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
      <h3 className="font-semibold">Multi-Package Shipment</h3>
      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
        <input placeholder="From" value={from} onChange={(e) => setFrom(e.target.value)} className="border rounded p-2" />
        <input placeholder="To" value={to} onChange={(e) => setTo(e.target.value)} className="border rounded p-2" />
      </div>
      <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-2">
        <input placeholder="Package weight (kg)" value={w} onChange={(e) => setW(e.target.value)} className="border rounded p-2" />
        <button onClick={addPackage} className="px-3 py-1 bg-blue-600 text-white rounded">Add Package</button>
        <div className="flex items-center gap-2">
          <input type="checkbox" checked={insured} onChange={(e) => setInsured(e.target.checked)} /> <div className="text-sm">Add insurance</div>
        </div>
      </div>

      <div className="mt-3">
        <h4 className="font-medium">Packages</h4>
        <ul className="mt-2 space-y-1">
          {packages.map(p => (<li key={p.id} className="text-sm">{p.id} • {p.weight} kg</li>))}
        </ul>
      </div>

      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
        <input placeholder="Declared value (for insurance)" value={declaredValue} onChange={(e) => setDeclaredValue(e.target.value)} className="border rounded p-2" />
        <button onClick={submit} className="px-3 py-1 bg-green-600 text-white rounded">Create Shipment</button>
      </div>
    </div>
  )
}
