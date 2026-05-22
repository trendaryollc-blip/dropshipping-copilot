"use client"
import React, { useEffect, useState } from "react"
import { useAppStore } from "@/store/useAppStore"
import { useFinanceStore } from "@/store/useFinanceStore"
import {
  defaultPlatformFees,
  calculatePnLForProduct,
  exportPnLCsv,
  convertCurrency,
  formatMoney,
  fetchPnLForecast,
  generateProfitHistory,
  calculateCarryingCost,
  applyReturnsImpact,
  COST_ATTRIBUTION_PRESETS,
  reconcilePayments,
} from "@/lib/finance-service"

export default function PnlDashboard() {
  const products = useAppStore((s) => s.products)
  const { productCosts, load, setCost } = useFinanceStore()
  const [adSpendPerProduct, setAdSpendPerProduct] = useState<Record<string, number>>({})
  const [currency, setCurrency] = useState("USD")
  const [forecast, setForecast] = useState<Array<{ month: string; revenue: number; net: number }>>([])

  useEffect(() => { load() }, [load])
  useEffect(() => { fetchPnLForecast().then(setForecast) }, [])

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
    const netWithReturns = applyReturnsImpact(pnl.net)
    const convertedNet = convertCurrency(netWithReturns, 'USD', currency)
    return { productId: p.id, productName: p.name, pnl, netWithReturns, convertedNet, history: generateProfitHistory(price, cost) }
  })

  // basic carrying cost snapshot: 0.5% of revenue per month placeholder
  const carryingCosts = rows.map(r => ({ productId: r.productId, carrying: r.pnl.revenue * 0.005 }))

  const reconciliation = reconcilePayments(
    products.slice(0, 3).map((p, i) => ({ id: `ord_${i}`, total: (p.priceRange.min + p.priceRange.max) / 2 })),
    products.slice(0, 3).map((p, i) => ({ orderId: `ord_${i}`, amount: (p.priceRange.min + p.priceRange.max) / 2, gateway: 'stripe' }))
  )

  return (
    <div className="space-y-4">
      <div className="bg-white shadow rounded p-4 flex flex-wrap gap-4 items-center">
        <label className="text-sm">Currency
          <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="ml-2 border rounded px-2 py-1">
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            <option value="INR">INR</option>
          </select>
        </label>
        <span className="text-xs text-gray-500">Attribution: {Object.keys(COST_ATTRIBUTION_PRESETS).join(', ')}</span>
      </div>

      {forecast.length > 0 && (
        <div className="bg-white shadow rounded p-4">
          <h3 className="font-semibold">P&L Forecast</h3>
          <div className="mt-2 flex gap-4 text-sm">
            {forecast.map((f) => (
              <div key={f.month} className="rounded border px-3 py-2">
                <div className="font-medium">{f.month}</div>
                <div>Rev: {formatMoney(f.revenue, currency)}</div>
                <div>Net: {formatMoney(f.net, currency)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

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
            <thead><tr className="text-gray-600"><th>Product</th><th>Revenue</th><th>Net ({currency})</th><th>Carrying</th></tr></thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.productId} className="border-t">
                  <td>{r.productName}</td>
                  <td>{formatMoney(r.pnl.revenue, currency)}</td>
                  <td>{formatMoney(r.convertedNet, currency)}</td>
                  <td>{formatMoney(calculateCarryingCost(10, r.pnl.cogs, 1), currency)}</td>
                </tr>
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

      <div className="bg-white shadow rounded p-4">
        <h3 className="font-semibold">Payment Reconciliation</h3>
        <table className="w-full text-sm mt-2">
          <thead><tr className="text-gray-600"><th>Order</th><th>Recorded</th><th>Gateway</th><th>Matched</th></tr></thead>
          <tbody>
            {reconciliation.map((r) => (
              <tr key={r.orderId} className="border-t">
                <td>{r.orderId}</td>
                <td>{formatMoney(r.recordedAmount, currency)}</td>
                <td>{r.gateway}</td>
                <td>{r.matched ? '✓' : '✗'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
