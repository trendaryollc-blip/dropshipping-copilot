"use client"
import React, { useEffect, useState } from "react"
import { useAppStore } from "@/store/useAppStore"
import { useFinanceStore } from "@/store/useFinanceStore"
import { defaultPlatformFees, calculatePnLForProduct, exportPnLCsv } from "@/lib/finance-service"

export default function PnlDashboard() {
  const products = useAppStore((s) => s.products)
  const { productCosts, load, setCost } = useFinanceStore()
  const [adSpendPerProduct, setAdSpendPerProduct] = useState<Record<string, number>>({})

  useEffect(() => { load() }, [load])

  function updateCost(productId: string, field: 'cogs' | 'shipping' | 'otherCost', value: number) {
    const existing = productCosts.find(p => p.productId === productId)
    const next = { productId, cogs: existing?.cogs || 0, shipping: existing?.shipping || 0, otherCost: existing?.otherCost || 0 }
    next[field] = value
    setCost(next)
  }

  const rows = products.map(p => {
    const cost = productCosts.find(c => c.productId === p.id)
    const price = (p.priceRange.min + p.priceRange.max) / 2
    const pnl = calculatePnLForProduct(price, 1, cost, defaultPlatformFees('shopify', price), adSpendPerProduct[p.id] || 0)
    return { productId: p.id, productName: p.name, pnl }
  })

  // basic carrying cost snapshot: 0.5% of revenue per month placeholder
  const carryingCosts = rows.map(r => ({ productId: r.productId, carrying: r.pnl.revenue * 0.005 }))

  return (
    <div className="space-y-4">
      <div className="bg-white shadow rounded p-4">
        <h3 className="font-semibold">Product Costs</h3>
        <div className="mt-3 space-y-2">
          {products.map(p => (
            <div key={p.id} className="p-2 border rounded grid grid-cols-1 md:grid-cols-4 gap-2 items-center">
              <div className="font-medium">{p.name}</div>
              <input placeholder="COGS" type="number" defaultValue={productCosts.find(c=>c.productId===p.id)?.cogs || ''} onBlur={(e)=> updateCost(p.id, 'cogs', Number(e.target.value))} className="border rounded p-2" />
              <input placeholder="Shipping" type="number" defaultValue={productCosts.find(c=>c.productId===p.id)?.shipping || ''} onBlur={(e)=> updateCost(p.id, 'shipping', Number(e.target.value))} className="border rounded p-2" />
              <input placeholder="Ad spend" type="number" defaultValue={adSpendPerProduct[p.id] || ''} onBlur={(e)=> setAdSpendPerProduct(prev => ({ ...prev, [p.id]: Number(e.target.value) }))} className="border rounded p-2" />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white shadow rounded p-4">
        <h3 className="font-semibold">P&L Overview</h3>
        <div className="mt-3">
          <table className="w-full text-left text-sm">
            <thead><tr className="text-gray-600"><th>Product</th><th>Revenue</th><th>Net</th></tr></thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.productId} className="border-t"><td>{r.productName}</td><td>${r.pnl.revenue.toFixed(2)}</td><td>${r.pnl.net.toFixed(2)}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3">
          <button onClick={() => {
            const url = exportPnLCsv(rows.map(r => ({ productId: r.productId, productName: r.productName, revenue: r.pnl.revenue, net: r.pnl.net })))
            if (url) { const a = document.createElement('a'); a.href = url; a.download = `pnl_${Date.now()}.csv`; document.body.appendChild(a); a.click(); a.remove(); }
          }} className="px-3 py-1 bg-indigo-600 text-white rounded">Export P&L CSV</button>
        </div>
      </div>
    </div>
  )
}
