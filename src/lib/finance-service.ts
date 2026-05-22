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

// ─── Multi-currency & FX ─────────────────────────────────────────────────────

const FX_RATES: Record<string, number> = { USD: 1, EUR: 0.92, GBP: 0.79, INR: 83.2, CAD: 1.36, AUD: 1.52 }

export function convertCurrency(amount: number, from: string, to: string) {
  const fromRate = FX_RATES[from] ?? 1
  const toRate = FX_RATES[to] ?? 1
  return Math.round((amount / fromRate) * toRate * 100) / 100
}

export function formatMoney(amount: number, currency = 'USD', locale = 'en-US') {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount)
}

// ─── Ad spend integrations ───────────────────────────────────────────────────

export interface AdSpendEntry {
  provider: 'facebook' | 'google' | 'tiktok' | 'other'
  campaignId: string
  spend: number
  period: string
  productId?: string
}

const AD_SPEND_KEY = 'dropease_ad_spend_v1'

export function loadAdSpend(): AdSpendEntry[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(AD_SPEND_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

export function saveAdSpend(entries: AdSpendEntry[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(AD_SPEND_KEY, JSON.stringify(entries))
}

export function getAdSpendForProduct(productId: string, period?: string) {
  return loadAdSpend()
    .filter((e) => (!productId || e.productId === productId) && (!period || e.period === period))
    .reduce((s, e) => s + e.spend, 0)
}

// ─── Per-product profit over time ────────────────────────────────────────────

export interface ProfitHistoryPoint {
  date: string
  revenue: number
  net: number
}

export function generateProfitHistory(price: number, cost: ProductCost | undefined, months = 6): ProfitHistoryPoint[] {
  const points: ProfitHistoryPoint[] = []
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date()
    d.setMonth(d.getMonth() - i)
    const qty = 10 + Math.floor(Math.random() * 20)
    const pnl = calculatePnLForProduct(price, qty, cost)
    points.push({ date: d.toISOString().slice(0, 7), revenue: pnl.revenue, net: pnl.net })
  }
  return points
}

// ─── Inventory carrying cost & returns impact ────────────────────────────────

export function calculateCarryingCost(units: number, unitCost: number, monthsHeld: number, rate = 0.02) {
  return Math.round(units * unitCost * rate * monthsHeld * 100) / 100
}

export function applyReturnsImpact(net: number, returnRate = 0.05) {
  return Math.round(net * (1 - returnRate) * 100) / 100
}

// ─── Cost attribution presets ────────────────────────────────────────────────

export const COST_ATTRIBUTION_PRESETS = {
  standard: { cogsWeight: 0.6, shippingWeight: 0.2, adsWeight: 0.15, otherWeight: 0.05 },
  lean: { cogsWeight: 0.75, shippingWeight: 0.15, adsWeight: 0.05, otherWeight: 0.05 },
  growth: { cogsWeight: 0.45, shippingWeight: 0.15, adsWeight: 0.35, otherWeight: 0.05 },
}

// ─── Forecasted P&L ────────────────────────────────────────────────────────────

export async function fetchPnLForecast(): Promise<Array<{ month: string; revenue: number; net: number }>> {
  try {
    const res = await fetch('/api/finance?action=forecast')
    if (res.ok) {
      const data = await res.json()
      return data.forecast || []
    }
  } catch { /* fallback */ }
  return [
    { month: 'Jun', revenue: 1200, net: 280 },
    { month: 'Jul', revenue: 1450, net: 340 },
    { month: 'Aug', revenue: 1380, net: 310 },
  ]
}

// ─── Payment gateway reconciliation (mock) ─────────────────────────────────

export interface ReconciliationEntry {
  orderId: string
  gatewayAmount: number
  recordedAmount: number
  matched: boolean
  gateway: string
}

export function reconcilePayments(
  orders: Array<{ id: string; total: number }>,
  gatewayTx: Array<{ orderId: string; amount: number; gateway: string }>
): ReconciliationEntry[] {
  return orders.map((o) => {
    const tx = gatewayTx.find((t) => t.orderId === o.id)
    const gatewayAmount = tx?.amount ?? 0
    return {
      orderId: o.id,
      gatewayAmount,
      recordedAmount: o.total,
      matched: Math.abs(gatewayAmount - o.total) < 0.01,
      gateway: tx?.gateway || 'unknown',
    }
  })
}
