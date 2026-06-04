"use client"
import React, { useEffect, useState } from "react"
import { useCustomerStore } from "@/store/useCustomerStore"
import CustomerProfile from "@/components/customers/customer-profile"

export default function CustomerList() {
  const customers = useCustomerStore((s) => s.customers)
  const load = useCustomerStore((s) => s.load)
  const [selected, setSelected] = useState<string | null>(null)

  useEffect(() => {
    load()
  }, [load])

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
        <h2 className="text-lg font-semibold mb-2">Customers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {customers.map((c) => (
            <button key={c.id} onClick={() => setSelected(c.id)} className="text-left p-3 border rounded hover:bg-gray-50">
              <div className="font-medium">{c.name}</div>
              <div className="text-sm text-gray-500">{c.email}</div>
              <div className="text-xs text-gray-400 mt-1">Segment: {c.segment} • Orders: {c.orders}</div>
            </button>
          ))}
        </div>
      </div>

      {selected && (
        <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
          <CustomerProfile id={selected} onClose={() => setSelected(null)} />
        </div>
      )}
    </div>
  )
}
