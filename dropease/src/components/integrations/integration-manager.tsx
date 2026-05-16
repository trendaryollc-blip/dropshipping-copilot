"use client"
import React, { useEffect, useState } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { loadIntegrationConnections, connectIntegration, fetchIntegrationProducts, fetchIntegrationOrders, syncIntegrationData, registerWebhook, loadWebhookSubscriptions, updateWebhookLastEvent } from '@/lib/integrations-service'
import type { IntegrationProvider } from '@/lib/integrations'

const providers: IntegrationProvider[] = ['shopify', 'amazon']

export default function IntegrationManager() {
  const [connections, setConnections] = useState(loadIntegrationConnections())
  const [selected, setSelected] = useState<IntegrationProvider>('shopify')
  const [config, setConfig] = useState({ apiKey: '', shopUrl: '', sellerId: '' })
  const [products, setProducts] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [statusMessage, setStatusMessage] = useState('')
  const [syncResult, setSyncResult] = useState<any | null>(null)
  const [webhookUrl, setWebhookUrl] = useState('')
  const [webhooks, setWebhooks] = useState<any[]>([])
  const localProducts = useAppStore((s) => s.products)
  const localOrders = useAppStore((s) => s.orders)

  useEffect(() => {
    async function init() {
      setConnections(loadIntegrationConnections())
      const subs = await loadWebhookSubscriptions()
      setWebhooks(subs)
    }
    init()
  }, [])

  async function handleConnect(provider: IntegrationProvider) {
    const cfg: Record<string, string> = provider === 'shopify' ? { shopUrl: config.shopUrl, apiKey: config.apiKey } : { sellerId: config.sellerId, apiKey: config.apiKey }
    const result = await connectIntegration(provider, cfg)
    setStatusMessage(`${provider} connected: ${result.connected}`)
    setConnections(loadIntegrationConnections())
  }

  async function handleSync(provider: IntegrationProvider) {
    setStatusMessage('Syncing...')
    try {
      const res = await syncIntegrationData(provider, localProducts, localOrders)
      setSyncResult(res)
      setStatusMessage(`Sync complete: ${res.productsSynced} products, ${res.ordersSynced} orders`)
    } catch (e) {
      setStatusMessage('Sync failed')
    }
  }

  async function handleRegisterWebhook(provider: IntegrationProvider) {
    if (!webhookUrl) { setStatusMessage('Enter a webhook URL'); return }
    const sub = await registerWebhook(provider, webhookUrl)
    const subs = await loadWebhookSubscriptions()
    setWebhooks(subs)
    setStatusMessage(`Webhook registered (${sub.id})`)
  }

  async function handleSendTestWebhook() {
    // mark lastEventAt on all stored webhooks to simulate a delivered event
    const subs = await loadWebhookSubscriptions()
    for (const s of subs) {
      // best-effort
      try { await updateWebhookLastEvent(s.id) } catch (e) { }
    }
    const next = await loadWebhookSubscriptions()
    setWebhooks(next)
    setStatusMessage('Test webhook events simulated')
  }

  async function loadData(provider: IntegrationProvider) {
    const prods = await fetchIntegrationProducts(provider)
    const ords = await fetchIntegrationOrders(provider)
    setProducts(prods)
    setOrders(ords)
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded p-4">
        <h3 className="text-lg font-semibold">Platform Integrations</h3>
        <p className="text-sm text-gray-500 mt-1">Connect Shopify or Amazon and fetch mock products/orders.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
          <select value={selected} onChange={(e) => setSelected(e.target.value as IntegrationProvider)} className="border rounded p-2">
            {providers.map((provider) => (
              <option key={provider} value={provider}>{provider}</option>
            ))}
          </select>
          <input value={config.apiKey} onChange={(e) => setConfig((prev) => ({ ...prev, apiKey: e.target.value }))} placeholder="API Key" className="border rounded p-2" />
          {selected === 'shopify' ? (
            <input value={config.shopUrl} onChange={(e) => setConfig((prev) => ({ ...prev, shopUrl: e.target.value }))} placeholder="Shop URL" className="border rounded p-2" />
          ) : (
            <input value={config.sellerId} onChange={(e) => setConfig((prev) => ({ ...prev, sellerId: e.target.value }))} placeholder="Seller ID" className="border rounded p-2" />
          )}
          <button onClick={() => handleConnect(selected)} className="px-3 py-2 bg-green-600 text-white rounded">Connect</button>
          <button onClick={() => loadData(selected)} className="px-3 py-2 bg-blue-600 text-white rounded">Fetch Data</button>
          <button onClick={() => handleSync(selected)} className="px-3 py-2 bg-indigo-600 text-white rounded">Sync Now</button>
          <input value={webhookUrl} onChange={(e) => setWebhookUrl(e.target.value)} placeholder="Webhook URL (https://...)" className="border rounded p-2" />
          <button onClick={() => handleRegisterWebhook(selected)} className="px-3 py-2 bg-emerald-600 text-white rounded">Register Webhook</button>
          <button onClick={handleSendTestWebhook} className="px-3 py-2 bg-slate-700 text-white rounded">Send Test Webhook</button>
        </div>
        {statusMessage && <div className="mt-3 text-sm text-green-700">{statusMessage}</div>}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded p-4">
          <h4 className="font-semibold">Connected Platforms</h4>
          <ul className="mt-3 space-y-2">
            {connections.map((connection) => (
              <li key={connection.provider} className="border rounded p-2 flex justify-between items-center">
                <div>
                  <div className="font-medium">{connection.provider}</div>
                  <div className="text-sm text-gray-500">{connection.connected ? 'Connected' : 'Disconnected'}</div>
                </div>
                <div className="space-x-2">
                  <button onClick={() => loadData(connection.provider)} className="px-2 py-1 bg-slate-700 text-white rounded text-sm">Load</button>
                  <button onClick={() => handleSync(connection.provider)} className="px-2 py-1 bg-indigo-600 text-white rounded text-sm">Sync</button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white shadow rounded p-4">
          <h4 className="font-semibold">Integration Data</h4>
          <div className="mt-3">
            <div className="font-medium">Products</div>
            <ul className="mt-2 space-y-2 text-sm">
              {products.map((product) => (
                <li key={product.id} className="border p-2 rounded">{product.name || product.productName || 'Product'} • ${product.priceRange?.min ?? product.total ?? 0}</li>
              ))}
            </ul>
          </div>
          <div className="mt-4">
            <div className="font-medium">Orders</div>
            <ul className="mt-2 space-y-2 text-sm">
              {orders.map((order) => (
                <li key={order.id} className="border p-2 rounded">{order.id} • {order.customer || order.productName} • ${order.total}</li>
              ))}
            </ul>
          </div>
          <div className="mt-4">
            <div className="font-medium">Webhooks</div>
            <ul className="mt-2 space-y-2 text-sm">
              {webhooks.map((w) => (
                <li key={w.id} className="border p-2 rounded">{w.provider} • {w.url} • Last event: {w.lastEventAt ?? 'never'}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
