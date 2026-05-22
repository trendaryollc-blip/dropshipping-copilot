"use client"
import React, { useState, useEffect } from "react"
import { nanoid } from "nanoid"
import type { ShippingRate } from "@/types"

export default function ZoneEditor() {
  const [zones, setZones] = useState<{ id: string; name: string; countries: string[] }[]>([])
  const [name, setName] = useState("")
  const [countries, setCountries] = useState("")

  useEffect(() => {
    try {
      const raw = localStorage.getItem('dropease_shipping_zones_v1')
      if (raw) setZones(JSON.parse(raw))
    } catch (e) { /* ignore */ }
  }, [])

  function save(zs: { id: string; name: string; countries: string[] }[]) {
    setZones(zs)
    try { localStorage.setItem('dropease_shipping_zones_v1', JSON.stringify(zs)) } catch (e) { }
  }

  return (
    <div className="bg-white shadow rounded p-4">
      <h3 className="font-semibold">Shipping Zones</h3>
      <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2">
        <input placeholder="Zone name" value={name} onChange={(e) => setName(e.target.value)} className="border rounded p-2" />
        <input placeholder="Countries (comma separated)" value={countries} onChange={(e) => setCountries(e.target.value)} className="border rounded p-2" />
        <div className="flex gap-2">
          <button onClick={() => {
            if (!name) return
            const z = { id: nanoid(), name, countries: countries.split(',').map(s=>s.trim()).filter(Boolean) }
            save([z, ...zones])
            setName('')
            setCountries('')
          }} className="px-3 py-1 bg-blue-600 text-white rounded">Add Zone</button>
        </div>
      </div>

      <div className="mt-4">
        <ul className="space-y-2">
          {zones.map(z => (
            <li key={z.id} className="p-2 border rounded flex justify-between items-center">
              <div>
                <div className="font-medium">{z.name}</div>
                <div className="text-xs text-gray-500">{z.countries.join(', ')}</div>
              </div>
              <div>
                <button onClick={() => save(zones.filter(zz => zz.id !== z.id))} className="px-2 py-1 border rounded text-sm">Remove</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
