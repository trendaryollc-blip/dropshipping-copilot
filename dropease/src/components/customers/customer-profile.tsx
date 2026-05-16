"use client"
import React, { useMemo, useState } from "react"
import { useCustomerStore } from "@/store/useCustomerStore"

export default function CustomerProfile({ id, onClose }: { id: string; onClose?: () => void }) {
  const customer = useCustomerStore((s) => s.customers.find((c) => c.id === id))
  const addNote = useCustomerStore((s) => s.addNote)
  const addPurchase = useCustomerStore((s) => s.addPurchase)
  const calculateLTV = useCustomerStore((s) => s.calculateLTV)

  const [note, setNote] = useState("")
  const [orderTotal, setOrderTotal] = useState("")
  const [orderItems, setOrderItems] = useState("")

  if (!customer) return <div>Customer not found</div>

  const ltv = useMemo(() => calculateLTV(id), [calculateLTV, id])

  return (
    <div>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold">{customer.name}</h3>
          <div className="text-sm text-gray-500">{customer.email}</div>
          <div className="text-xs text-gray-400">Segment: {customer.segment} • Status: {customer.status}</div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">LTV</div>
          <div className="text-lg font-medium">${ltv}</div>
        </div>
      </div>

      <hr className="my-4" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium">Add Note</h4>
          <textarea value={note} onChange={(e) => setNote(e.target.value)} className="w-full border rounded p-2 mt-2" rows={4} />
          <div className="flex gap-2 mt-2">
            <button onClick={() => { if (note.trim()) { addNote(id, note.trim()); setNote("") } }} className="px-3 py-1 bg-blue-600 text-white rounded">Save Note</button>
            <button onClick={() => onClose && onClose()} className="px-3 py-1 border rounded">Close</button>
          </div>

          <div className="mt-4">
            <h4 className="font-medium">Notes</h4>
            <ul className="mt-2 space-y-2">
              {(customer.notes || []).map((n) => (
                <li key={n.id} className="text-sm text-gray-700">{n.text} <span className="text-xs text-gray-400">· {new Date(n.createdAt).toLocaleString()}</span></li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <h4 className="font-medium">Record Purchase</h4>
          <input placeholder="Total (e.g. 29.99)" value={orderTotal} onChange={(e) => setOrderTotal(e.target.value)} className="w-full border rounded p-2 mt-2" />
          <textarea placeholder="Items (name x qty, one per line)" value={orderItems} onChange={(e) => setOrderItems(e.target.value)} className="w-full border rounded p-2 mt-2" rows={4} />
          <div className="flex gap-2 mt-2">
            <button onClick={() => {
              const total = parseFloat(orderTotal)
              if (isNaN(total)) return
              const items = orderItems.split("\n").map((line) => {
                const [name, qtyRaw] = line.split("x").map(s => s?.trim())
                const qty = qtyRaw ? parseInt(qtyRaw, 10) : 1
                return { productName: name || "Item", quantity: isNaN(qty) ? 1 : qty }
              })
              addPurchase(id, { total, items })
              setOrderTotal("")
              setOrderItems("")
            }} className="px-3 py-1 bg-green-600 text-white rounded">Add Purchase</button>
          </div>

          <div className="mt-4">
            <h4 className="font-medium">Purchase History</h4>
            <ul className="mt-2 space-y-2">
              {(customer.purchases || []).map((p) => (
                <li key={p.id} className="text-sm">
                  <div className="font-medium">{p.date} • ${p.total}</div>
                  <div className="text-xs text-gray-500">{p.items.map(i => `${i.productName} x${i.quantity}`).join(', ')}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
