import type { PaymentGatewayConfig, PaymentTransaction, AdPlatformConfig, AdSpendData } from '@/types'

const PAYMENT_STORAGE_KEY = 'dropease_payment_connectors_v1'
const AD_STORAGE_KEY = 'dropease_ad_platforms_v1'

export function loadPaymentConnectors(): PaymentGatewayConfig[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(PAYMENT_STORAGE_KEY)
    return raw ? JSON.parse(raw) as PaymentGatewayConfig[] : []
  } catch (error) {
    console.error('Failed to load payment connectors', error)
    return []
  }
}

export function savePaymentConnectors(connectors: PaymentGatewayConfig[]) {
  if (typeof window === 'undefined') return
  try { localStorage.setItem(PAYMENT_STORAGE_KEY, JSON.stringify(connectors)) } catch (error) { console.error(error) }
}

export async function connectPaymentGateway(provider: 'stripe' | 'paypal', apiKey: string): Promise<PaymentGatewayConfig> {
  await new Promise((resolve) => setTimeout(resolve, 400))
  const result: PaymentGatewayConfig = {
    provider,
    accountName: provider === 'stripe' ? 'Stripe Account' : 'PayPal Account',
    connected: !!apiKey,
    lastSync: new Date().toISOString(),
    fees: provider === 'stripe' ? { percentage: 2.9, fixed: 0.3 } : { percentage: 2.7, fixed: 0.35 },
  }
  const connectors = loadPaymentConnectors().filter((item) => item.provider !== provider)
  savePaymentConnectors([result, ...connectors])
  return result
}

export async function getPaymentTransactions(): Promise<PaymentTransaction[]> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return [
    { id: 'txn_2026_01', orderId: 'ORD-9001', customerName: 'Nina Brooks', amount: 129.99, gateway: 'stripe', status: 'completed', createdAt: new Date().toISOString() },
    { id: 'txn_2026_02', orderId: 'ORD-9002', customerName: 'Mason Reed', amount: 54.2, gateway: 'paypal', status: 'completed', createdAt: new Date().toISOString() },
  ]
}

export async function reconcilePaymentGateway(provider: 'stripe' | 'paypal'): Promise<{ reconciled: boolean; missingTransactions: number; updatedAt: string }> {
  await new Promise((resolve) => setTimeout(resolve, 400))
  return {
    reconciled: true,
    missingTransactions: 0,
    updatedAt: new Date().toISOString(),
  }
}

export function loadAdPlatforms(): AdPlatformConfig[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(AD_STORAGE_KEY)
    return raw ? JSON.parse(raw) as AdPlatformConfig[] : []
  } catch (error) {
    console.error('Failed to load ad platforms', error)
    return []
  }
}

export function saveAdPlatforms(platforms: AdPlatformConfig[]) {
  if (typeof window === 'undefined') return
  try { localStorage.setItem(AD_STORAGE_KEY, JSON.stringify(platforms)) } catch (error) { console.error(error) }
}

export async function connectAdPlatform(provider: 'google_ads' | 'facebook_ads', apiKey: string): Promise<AdPlatformConfig> {
  await new Promise((resolve) => setTimeout(resolve, 400))
  const result: AdPlatformConfig = {
    provider,
    accountName: provider === 'google_ads' ? 'Google Ads' : 'Facebook Ads',
    connected: !!apiKey,
    lastSync: new Date().toISOString(),
    spendThisPeriod: 0,
    campaigns: 0,
  }
  const platforms = loadAdPlatforms().filter((item) => item.provider !== provider)
  saveAdPlatforms([result, ...platforms])
  return result
}

export async function fetchAdSpendData(provider: 'google_ads' | 'facebook_ads'): Promise<AdSpendData> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  const data: Record<string, AdSpendData> = {
    google_ads: { provider: 'google_ads', spend: 3294.7, clicks: 870, conversions: 29 },
    facebook_ads: { provider: 'facebook_ads', spend: 1785.4, clicks: 540, conversions: 18 },
  }
  return data[provider]
}
