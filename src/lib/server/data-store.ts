/**
 * Server-side in-memory data store with globalThis persistence
 * (survives warm serverless instances on Vercel).
 */

import type {
  CustomerProfile,
  CrmActivity,
  CustomerSegmentDefinition,
  CrmAutomation,
  CrmAuditEntry,
  GdprRequest,
  ProductReview,
} from '@/types'

export interface ServerDataStore {
  customers: CustomerProfile[]
  activities: CrmActivity[]
  segments: CustomerSegmentDefinition[]
  automations: CrmAutomation[]
  auditLog: CrmAuditEntry[]
  gdprRequests: GdprRequest[]
  reviews: ProductReview[]
  webhooks: Array<{ id: string; provider: string; url: string; active: boolean; createdAt: string; lastEventAt?: string }>
}

const GLOBAL_KEY = '__dropease_data_store__'

function seedStore(): ServerDataStore {
  const now = new Date().toISOString()
  return {
    customers: [
      { id: 'cust_1', name: 'Sarah Mitchell', email: 'sarah@example.com', phone: '+15551234567', segment: 'Loyal', lifetimeValue: 420.5, orders: 5, lastOrderDate: now, status: 'active', lastContacted: now, leadScore: 85, consent: { marketing: true, sms: true, analytics: true, updatedAt: now } },
      { id: 'cust_2', name: 'James Cooper', email: 'james@example.com', segment: 'New', lifetimeValue: 24.99, orders: 1, lastOrderDate: now, status: 'active', lastContacted: now, leadScore: 42 },
      { id: 'cust_3', name: 'Emily Chen', email: 'emily@example.com', segment: 'At-risk', lifetimeValue: 19.99, orders: 2, lastOrderDate: now, status: 'inactive', lastContacted: now, leadScore: 28, unsubscribed: true, consent: { marketing: false, sms: false, analytics: true, updatedAt: now } },
    ],
    activities: [],
    segments: [
      { id: 'seg_loyal', name: 'High Value', rules: [{ id: 'r1', field: 'lifetimeValue', operator: 'gte', value: 200 }], matchMode: 'all', createdAt: now },
      { id: 'seg_atrisk', name: 'At Risk', rules: [{ id: 'r2', field: 'segment', operator: 'eq', value: 'At-risk' }], matchMode: 'all', createdAt: now },
    ],
    automations: [
      { id: 'auto_welcome', name: 'Welcome Email', trigger: 'new_customer', action: 'send_email', enabled: true, templateId: 'welcome' },
      { id: 'auto_winback', name: 'Win-back (30d inactive)', trigger: 'inactive_30d', action: 'send_email', enabled: true, templateId: 'winback' },
    ],
    auditLog: [],
    gdprRequests: [],
    reviews: [],
    webhooks: [],
  }
}

export function getDataStore(): ServerDataStore {
  const g = globalThis as typeof globalThis & { [GLOBAL_KEY]?: ServerDataStore }
  if (!g[GLOBAL_KEY]) {
    g[GLOBAL_KEY] = seedStore()
  }
  return g[GLOBAL_KEY]!
}

export function resetDataStore() {
  const g = globalThis as typeof globalThis & { [GLOBAL_KEY]?: ServerDataStore }
  g[GLOBAL_KEY] = seedStore()
}
