type Provider = string

interface WebhookSubscription {
  id: string
  provider: Provider
  url: string
  active: boolean
  createdAt: string
  lastEventAt?: string
}

const subscriptions: WebhookSubscription[] = []

export function listSubscriptions() {
  return [...subscriptions]
}

export function addSubscription(provider: Provider, url: string) {
  const sub: WebhookSubscription = { id: crypto.randomUUID(), provider, url, active: true, createdAt: new Date().toISOString() }
  subscriptions.push(sub)
  return sub
}

export function getSubscriptionsByProvider(provider: Provider) {
  return subscriptions.filter(s => s.provider === provider && s.active)
}

export function touchSubscription(id: string) {
  const s = subscriptions.find(x => x.id === id)
  if (!s) return null
  s.lastEventAt = new Date().toISOString()
  return s
}

export async function deliverWebhookToProvider(provider: Provider, event: string, payload: unknown) {
  const subs = getSubscriptionsByProvider(provider)
  const results: Array<{ id: string; url: string; ok: boolean; status?: number }> = []
  for (const s of subs) {
    try {
      const res = await fetch(s.url, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ event, payload, deliveredAt: new Date().toISOString() }) })
      s.lastEventAt = new Date().toISOString()
      results.push({ id: s.id, url: s.url, ok: res.ok, status: res.status })
    } catch (e) {
      results.push({ id: s.id, url: s.url, ok: false })
    }
  }
  return results
}

export default { listSubscriptions, addSubscription, getSubscriptionsByProvider, touchSubscription, deliverWebhookToProvider }
