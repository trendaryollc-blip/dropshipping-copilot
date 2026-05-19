import type { ShippingRate, ShipmentTracking } from "@/types"

const STORAGE_KEY = "dropease_carriers_v1"

export interface CarrierConfig {
  id: string
  provider: string
  accountName: string
  connected: boolean
  createdAt: string
}

export function loadCarriersFromLocal(): CarrierConfig[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as CarrierConfig[]
  } catch (e) {
    console.error("Failed to load carriers", e)
    return []
  }
}

export function saveCarriersToLocal(carriers: CarrierConfig[]) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(carriers))
  } catch (e) {
    console.error("Failed to save carriers", e)
  }
}

export function generateMockCarriers(): CarrierConfig[] {
  const now = new Date().toISOString()
  return [
    { id: "carrier_ups", provider: "UPS", accountName: "UPS Account", connected: true, createdAt: now },
    { id: "carrier_dhl", provider: "DHL", accountName: "DHL Account", connected: true, createdAt: now },
    { id: "carrier_fedex", provider: "FedEx", accountName: "FedEx Account", connected: false, createdAt: now },
  ]
}

export function getRatesForShipment({ origin, destination, weight }: { origin: string; destination: string; weight: number }): ShippingRate[] {
  // Mocked rate comparison logic
  const base = Math.max(3, Math.round(weight * 2 + Math.random() * 10))
  return [
    { provider: "UPS", service: "Ground", cost: Number((base * 0.9).toFixed(2)), estimatedDelivery: "3-5 days", insured: false },
    { provider: "DHL", service: "Express", cost: Number((base * 1.2).toFixed(2)), estimatedDelivery: "1-3 days", insured: true },
    { provider: "FedEx", service: "Economy", cost: Number((base * 0.8).toFixed(2)), estimatedDelivery: "4-6 days", insured: false },
  ]
}

// --- Rate caching ---
const RATES_CACHE_KEY = 'dropease_rates_cache_v1'

export function cacheRates(key: string, rates: ShippingRate[], ttlSeconds = 300) {
  try {
    if (typeof window === 'undefined') return
    const storeRaw = localStorage.getItem(RATES_CACHE_KEY)
    const store = storeRaw ? JSON.parse(storeRaw) : {}
    store[key] = { rates, expiresAt: Date.now() + ttlSeconds * 1000 }
    localStorage.setItem(RATES_CACHE_KEY, JSON.stringify(store))
  } catch (e) { console.warn('cacheRates failed', e) }
}

export function getCachedRates(key: string): ShippingRate[] | null {
  try {
    if (typeof window === 'undefined') return null
    const raw = localStorage.getItem(RATES_CACHE_KEY)
    if (!raw) return null
    const store = JSON.parse(raw)
    const entry = store[key]
    if (!entry) return null
    if (Date.now() > entry.expiresAt) {
      delete store[key]
      localStorage.setItem(RATES_CACHE_KEY, JSON.stringify(store))
      return null
    }
    return entry.rates as ShippingRate[]
  } catch (e) { return null }
}

export function generateCustomsCSV(items: { id: string; hsCode?: string; description: string; quantity: number; value: number; originCountry?: string }[]) {
  const header = ['id','hsCode','description','quantity','value','originCountry']
  const rows = items.map(i => [i.id, i.hsCode || '', i.description.replace(/"/g,'""'), String(i.quantity), String(i.value), i.originCountry || ''])
  const csv = [header, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  return URL.createObjectURL(blob)
}

export function generateShippingLabel(rate: ShippingRate, shipmentInfo: { to: string; from: string; weight: number }): string | null {
  if (typeof window === "undefined") return null
  const labelText = `Carrier: ${rate.provider}\nService: ${rate.service}\nCost: $${rate.cost}\nFrom: ${shipmentInfo.from}\nTo: ${shipmentInfo.to}\nWeight: ${shipmentInfo.weight}kg\nGenerated: ${new Date().toISOString()}`
  const blob = new Blob([labelText], { type: "text/plain" })
  const url = URL.createObjectURL(blob)
  return url
}

export function trackShipmentMock(trackingNumber: string): ShipmentTracking {
  return {
    provider: "MockCarrier",
    trackingNumber,
    status: "in_transit",
    delivered: false,
    events: [
      { timestamp: new Date().toISOString(), description: "Shipment created" },
      { timestamp: new Date().toISOString(), description: "Picked up by carrier" },
    ],
  }
}

export function generateHTMLLabel(rate: ShippingRate, shipmentInfo: { to: string; from: string; weight: number }) {
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>Label</title><style>body{font-family:Arial,sans-serif;padding:12px} .box{border:1px solid #222;padding:12px;width:420px}</style></head><body><div class="box"><h2>Shipping Label</h2><div><strong>Carrier:</strong> ${rate.provider}</div><div><strong>Service:</strong> ${rate.service}</div><div><strong>Cost:</strong> $${rate.cost}</div><div><strong>From:</strong> ${shipmentInfo.from}</div><div><strong>To:</strong> ${shipmentInfo.to}</div><div><strong>Weight:</strong> ${shipmentInfo.weight} kg</div><div style="margin-top:8px;font-size:12px;color:#666">Generated: ${new Date().toISOString()}</div></div></body></html>`
  const blob = new Blob([html], { type: "text/html" })
  return URL.createObjectURL(blob)
}

export function generateManifestCSV(shipments: { id: string; to: string; from: string; weight: number; carrier?: string }[]) {
  const header = ["id", "to", "from", "weight", "carrier"]
  const rows = shipments.map(s => [s.id, s.to, s.from, String(s.weight), s.carrier || ""]) 
  const csv = [header, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n")
  const blob = new Blob([csv], { type: "text/csv" })
  return URL.createObjectURL(blob)
}

export function exportRateCardCSV(rateCard: { provider: string; service: string; cost: number }[]) {
  const header = ["provider","service","cost"]
  const rows = rateCard.map(r => [r.provider, r.service, String(r.cost)])
  const csv = [header, ...rows].map(r => r.join(",")).join("\n")
  const blob = new Blob([csv], { type: "text/csv" })
  return URL.createObjectURL(blob)
}

export async function importRateCardFromCSV(file: File) {
  const text = await file.text()
  const lines = text.split(/\r?\n/).filter(Boolean)
  const items: { provider: string; service: string; cost: number }[] = []
  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(",").map(p => p.trim())
    if (parts.length >= 3) items.push({ provider: parts[0], service: parts[1], cost: Number(parts[2]) })
  }
  return items
}

export function createReturnRMA(orderId: string) {
  return { rmaId: `RMA-${Math.random().toString(36).slice(2,9).toUpperCase()}`, orderId, createdAt: new Date().toISOString() }
}

export function simulateWebhookEvent(event: string, payload: any, callback?: (p: any) => void) {
  // simple mock: call callback after a short delay
  setTimeout(() => {
    const envelope = { event, payload, receivedAt: new Date().toISOString() }
    if (callback) callback(envelope)
    // attempt delivery to registered endpoints
    deliverWebhookToRegisteredEndpoints(envelope).catch(() => {})
  }, 800)
}

export async function deliverWebhookToRegisteredEndpoints(envelope: any) {
  if (typeof window === "undefined") return
  try {
    const raw = localStorage.getItem("dropease_shipping_webhooks_v1")
    if (!raw) return
    const endpoints: string[] = JSON.parse(raw)
    for (const url of endpoints) {
      try {
        // best-effort POST; CORS may block in browser contexts for external endpoints
        await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(envelope) })
      } catch (e) {
        console.warn("Webhook delivery failed for", url, e)
      }
    }
  } catch (e) {
    console.error("deliverWebhookToRegisteredEndpoints error", e)
  }
}

export function exportShippingAnalyticsCSV(shipments: { id: string; to: string; from: string; weight: number; carrier?: string; status?: string }[]) {
  const header = ["id","to","from","weight","carrier","status"]
  const rows = shipments.map(s => [s.id, s.to, s.from, String(s.weight), s.carrier || "", s.status || ""])
  const csv = [header, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n")
  const blob = new Blob([csv], { type: "text/csv" })
  return URL.createObjectURL(blob)
}

export function generatePDFLabel(rate: ShippingRate, shipmentInfo: { to: string; from: string; weight: number }) {
  // Placeholder PDF generator - creates a minimal PDF-like blob
  const content = `Shipping Label\nCarrier: ${rate.provider}\nService: ${rate.service}\nCost: $${rate.cost}\nFrom: ${shipmentInfo.from}\nTo: ${shipmentInfo.to}\nWeight: ${shipmentInfo.weight}kg\nGenerated: ${new Date().toISOString()}`
  const blob = new Blob([content], { type: "application/pdf" })
  return URL.createObjectURL(blob)
}

export function calculateInsuranceCost(value: number, insured: boolean) {
  if (!insured) return 0
  // simple placeholder: 1.5% of declared value, min $1
  const cost = Math.max(1, Math.round((value * 0.015) * 100) / 100)
  return cost
}
