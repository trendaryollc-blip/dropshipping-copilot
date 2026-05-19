import type { Product } from "@/types"

const STORAGE_KEY = "dropease_finance_v1"

export interface ProductCost {
  productId: string
  cogs: number
  shipping: number
  otherCost: number
}

export interface FinanceState {
  productCosts: ProductCost[]
}

export function loadFinanceFromLocal(): FinanceState {
  if (typeof window === "undefined") return { productCosts: [] }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { productCosts: [] }
    return JSON.parse(raw) as FinanceState
  } catch (e) {
    console.error("Failed to load finance", e)
    return { productCosts: [] }
  }
}

export function saveFinanceToLocal(state: FinanceState) {
  if (typeof window === "undefined") return
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)) } catch (e) { console.error(e) }
}

export function defaultPlatformFees(platform: string, price: number) {
  // simple presets
  switch (platform) {
    case 'shopify':
      return { percentage: 2.9, fixed: 0.3 }
    case 'amazon':
      return { percentage: 15, fixed: 0 }
    case 'ebay':
      return { percentage: 10, fixed: 0 }
    default:
      return { percentage: 3, fixed: 0.3 }
  }
}

export function calculatePnLForProduct(price: number, qty: number, cost: ProductCost | undefined, platformFees = { percentage: 3, fixed: 0.3 }, adSpend = 0) {
  const revenue = price * qty
  const cogs = (cost?.cogs || 0) * qty
  const shipping = (cost?.shipping || 0) * qty
  const other = (cost?.otherCost || 0) * qty
  const fees = revenue * (platformFees.percentage / 100) + platformFees.fixed * qty
  const net = revenue - (cogs + shipping + other + fees + adSpend)
  return { revenue, cogs, shipping, other, fees, adSpend, net }
}

export function exportPnLCsv(rows: { productId: string; productName: string; revenue: number; net: number }[]) {
  const header = ['productId','productName','revenue','net']
  const csv = [header, ...rows.map(r => [r.productId, r.productName, String(r.revenue), String(r.net)])].map(r => r.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  return URL.createObjectURL(blob)
}
