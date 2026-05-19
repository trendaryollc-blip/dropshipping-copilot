import { integrationAdapters, type IntegrationProvider } from '@/lib/integrations'
import type { Product, Order } from '@/types'

const STORAGE_KEY = 'dropease_integrations_v1'
const WEBHOOK_KEY = 'dropease_webhook_subscriptions_v1'

export interface IntegrationConnection {
  provider: IntegrationProvider
  connected: boolean
  config: Record<string, string>
}

export interface WebhookSubscription {
  id: string
  provider: IntegrationProvider
  url: string
  active: boolean
  createdAt: string
  lastEventAt?: string
}

export interface IntegrationSyncResult {
  provider: IntegrationProvider
  productsSynced: number
  ordersSynced: number
  updatedAt: string
  warnings: string[]
}

export function loadIntegrationConnections(): IntegrationConnection[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as IntegrationConnection[]
  } catch (e) {
    console.error('Failed to load integration connections', e)
    return []
  }
}

export function saveIntegrationConnections(connections: IntegrationConnection[]) {
  if (typeof window === 'undefined') return
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(connections)) } catch (e) { console.error('Failed to save integration connections', e) }
}

export async function loadWebhookSubscriptions(): Promise<WebhookSubscription[]> {
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch('/api/webhooks')
      if (res.ok) {
        const json = await res.json()
        return json.subscriptions || []
      }
    } catch (e) {
      // fallback to localStorage
    }
  }
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(WEBHOOK_KEY)
    if (!raw) return []
    return JSON.parse(raw) as WebhookSubscription[]
  } catch (e) {
    console.error('Failed to load webhook subscriptions', e)
    return []
  }
}

export function saveWebhookSubscriptions(subscriptions: WebhookSubscription[]) {
  if (typeof window === 'undefined') return
  try { localStorage.setItem(WEBHOOK_KEY, JSON.stringify(subscriptions)) } catch (e) { console.error('Failed to save webhook subscriptions', e) }
}

export async function connectIntegration(provider: IntegrationProvider, config: Record<string, string>) {
  const adapter = integrationAdapters[provider]
  const result = await adapter.connect(config)
  const connections = loadIntegrationConnections()
  const next = [
    { provider, connected: result.connected ?? true, config },
    ...connections.filter((item) => item.provider !== provider),
  ]
  saveIntegrationConnections(next)
  return result
}

export async function fetchIntegrationProducts(provider: IntegrationProvider): Promise<Product[]> {
  const adapter = integrationAdapters[provider]
  if (adapter && typeof adapter.fetchProducts === 'function') {
    return adapter.fetchProducts()
  }
  return []
}

export async function fetchIntegrationOrders(provider: IntegrationProvider): Promise<Order[]> {
  const adapter = integrationAdapters[provider]
  if (adapter && typeof adapter.fetchOrders === 'function') {
    return adapter.fetchOrders()
  }
  return []
}

export async function pushProductToIntegration(provider: IntegrationProvider, product: Product) {
  const adapter = integrationAdapters[provider] as any
  if (adapter && typeof adapter.pushProduct === 'function') {
    return adapter.pushProduct(product)
  }
  return { ok: false, message: 'pushProduct not supported' }
}

export async function pushOrderToIntegration(provider: IntegrationProvider, order: Order) {
  const adapter = integrationAdapters[provider] as any
  if (adapter && typeof adapter.pushOrder === 'function') {
    return adapter.pushOrder(order)
  }
  return { ok: false, message: 'pushOrder not supported' }
}

export async function syncIntegrationData(provider: IntegrationProvider, localProducts: Product[] = [], localOrders: Order[] = []) {
  const warnings: string[] = []
  let productsSynced = 0
  let ordersSynced = 0
  const adapter = integrationAdapters[provider] as any

  if (!adapter) {
    warnings.push('Unknown provider')
    return { provider, productsSynced, ordersSynced, updatedAt: new Date().toISOString(), warnings }
  }

  const remoteProducts = await fetchIntegrationProducts(provider)
  const remoteOrders = await fetchIntegrationOrders(provider)

  for (const product of localProducts) {
    if (typeof adapter.pushProduct === 'function') {
      await adapter.pushProduct(product)
      productsSynced += 1
    }
  }

  for (const order of localOrders) {
    if (typeof adapter.pushOrder === 'function') {
      await adapter.pushOrder(order)
      ordersSynced += 1
    }
  }

  if (remoteProducts.length === 0) warnings.push('No remote products found')
  if (remoteOrders.length === 0) warnings.push('No remote orders found')

  const result = {
    provider,
    productsSynced,
    ordersSynced,
    updatedAt: new Date().toISOString(),
    warnings,
  }

  // notify server-side webhook subscriptions (fire-and-forget)
  try {
    fetch('/api/webhooks/trigger', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ provider, event: 'integration.sync', payload: { productsSynced, ordersSynced, warnings } }),
    }).catch(() => {})
  } catch (e) {}

  // enqueue a background sync job for server-side processing
  try {
    fetch('/api/queue/enqueue', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ type: 'sync', payload: { provider, productsSynced, ordersSynced } }),
    }).catch(() => {})
  } catch (e) {}

  return result
}

export async function registerWebhook(provider: IntegrationProvider, url: string) {
  // register server-side and fallback to localStorage
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch('/api/webhooks', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ provider, url }) })
      const json = await res.json()
      if (json && json.subscription) return json.subscription
    } catch (e) {
      // fallback to local storage
    }
  }
  const subscriptions = await loadWebhookSubscriptions()
  const subscription: WebhookSubscription = {
    id: crypto.randomUUID(),
    provider,
    url,
    active: true,
    createdAt: new Date().toISOString(),
  }
  saveWebhookSubscriptions([subscription, ...subscriptions])
  return subscription
}

export async function updateWebhookLastEvent(id: string) {
  if (typeof window !== 'undefined') {
    try { await fetch(`/api/webhooks/touch?id=${encodeURIComponent(id)}`, { method: 'POST' }) } catch (e) { }
  }
  const subscriptions = await loadWebhookSubscriptions()
  const next = subscriptions.map((item) => item.id === id ? { ...item, lastEventAt: new Date().toISOString() } : item)
  saveWebhookSubscriptions(next)
  return next
}

export async function getIntegrationStatus() {
  const connections = loadIntegrationConnections()
  return connections.map((connection) => ({
    provider: connection.provider,
    connected: connection.connected,
    lastSync: new Date().toISOString(),
  }))
}
