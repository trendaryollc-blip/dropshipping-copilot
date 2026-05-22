import type {
  CustomerProfile,
  CrmActivity,
  CustomerSegmentDefinition,
  SegmentRule,
  CrmAutomation,
  CrmAuditEntry,
  GdprRequest,
  CustomerConsent,
  CrmRole,
} from '@/types'

const STORAGE_KEY = 'dropease_customers_v1'
const ACTIVITIES_KEY = 'dropease_crm_activities_v1'
const SEGMENTS_KEY = 'dropease_crm_segments_v1'
const AUTOMATIONS_KEY = 'dropease_crm_automations_v1'
const AUDIT_KEY = 'dropease_crm_audit_v1'
const GDPR_KEY = 'dropease_crm_gdpr_v1'
const ROLE_KEY = 'dropease_crm_role_v1'

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function writeJson<T>(key: string, data: T) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (e) {
    console.error(`Failed to save ${key}`, e)
  }
}

// ─── Customers ───────────────────────────────────────────────────────────────

export function loadCustomersFromLocal(): CustomerProfile[] {
  return readJson(STORAGE_KEY, [])
}

export function saveCustomersToLocal(customers: CustomerProfile[]) {
  writeJson(STORAGE_KEY, customers)
}

export function generateMockCustomers(): CustomerProfile[] {
  const now = new Date().toISOString()
  return [
    { id: 'cust_1', name: 'Sarah Mitchell', email: 'sarah@example.com', phone: '+15551234567', segment: 'Loyal', lifetimeValue: 420.5, orders: 5, lastOrderDate: now, status: 'active', lastContacted: now, leadScore: 85, consent: { marketing: true, sms: true, analytics: true, updatedAt: now } },
    { id: 'cust_2', name: 'James Cooper', email: 'james@example.com', segment: 'New', lifetimeValue: 24.99, orders: 1, lastOrderDate: now, status: 'active', lastContacted: now, leadScore: 42 },
    { id: 'cust_3', name: 'Emily Chen', email: 'emily@example.com', segment: 'At-risk', lifetimeValue: 19.99, orders: 2, lastOrderDate: now, status: 'inactive', lastContacted: '2023-12-01', leadScore: 28, unsubscribed: true, consent: { marketing: false, sms: false, analytics: true, updatedAt: now } },
  ]
}

// ─── Import / Export ─────────────────────────────────────────────────────────

export function exportCustomersCSV(customers: CustomerProfile[]): string {
  const header = ['id', 'name', 'email', 'phone', 'segment', 'lifetimeValue', 'orders', 'lastOrderDate', 'status', 'leadScore', 'unsubscribed']
  const rows = customers.map((c) => [
    c.id, c.name, c.email, c.phone || '', c.segment, String(c.lifetimeValue), String(c.orders),
    c.lastOrderDate, c.status, String(c.leadScore ?? ''), String(c.unsubscribed ?? false),
  ])
  return [header, ...rows].map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n')
}

export function downloadCSV(content: string, filename: string) {
  if (typeof window === 'undefined') return null
  const blob = new Blob([content], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
  return url
}

export async function importCustomersFromCSV(text: string): Promise<CustomerProfile[]> {
  const lines = text.split(/\r?\n/).filter(Boolean)
  if (lines.length < 2) return []
  const headers = lines[0].split(',').map((h) => h.replace(/"/g, '').trim().toLowerCase())
  const customers: CustomerProfile[] = []
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].match(/("([^"]|"")*"|[^,]+)/g)?.map((c) => c.replace(/^"|"$/g, '').replace(/""/g, '"').trim()) ?? lines[i].split(',')
    const map: Record<string, string> = {}
    headers.forEach((h, j) => { map[h] = cols[j] || '' })
    customers.push({
      id: map.id || `cust_${Math.random().toString(36).slice(2, 9)}`,
      name: map.name || 'Unknown',
      email: map.email || '',
      phone: map.phone || undefined,
      segment: map.segment || 'Imported',
      lifetimeValue: Number(map.lifetimevalue || 0),
      orders: Number(map.orders || 0),
      lastOrderDate: map.lastorderdate || new Date().toISOString().split('T')[0],
      status: (map.status as CustomerProfile['status']) || 'active',
      lastContacted: new Date().toISOString().split('T')[0],
      leadScore: Number(map.leadscore || 50),
    })
  }
  return customers
}

/** XLSX export via CSV (Excel opens CSV); full XLSX needs optional xlsx package */
export function exportCustomersXLSX(customers: CustomerProfile[]) {
  return downloadCSV(exportCustomersCSV(customers), `customers-${Date.now()}.csv`)
}

// ─── Activity timeline ───────────────────────────────────────────────────────

export function loadActivities(): CrmActivity[] {
  return readJson(ACTIVITIES_KEY, [])
}

export function saveActivities(activities: CrmActivity[]) {
  writeJson(ACTIVITIES_KEY, activities)
}

export function addActivity(activity: Omit<CrmActivity, 'id' | 'createdAt'>): CrmActivity {
  const activities = loadActivities()
  const entry: CrmActivity = {
    ...activity,
    id: `act_${Math.random().toString(36).slice(2, 9)}`,
    createdAt: new Date().toISOString(),
  }
  activities.unshift(entry)
  saveActivities(activities.slice(0, 500))
  return entry
}

export function getCustomerTimeline(customerId: string): CrmActivity[] {
  return loadActivities().filter((a) => a.customerId === customerId)
}

// ─── Segmentation ────────────────────────────────────────────────────────────

export function loadSegments(): CustomerSegmentDefinition[] {
  const stored = readJson<CustomerSegmentDefinition[]>(SEGMENTS_KEY, [])
  if (stored.length) return stored
  const now = new Date().toISOString()
  return [
    { id: 'seg_loyal', name: 'High Value', rules: [{ id: 'r1', field: 'lifetimeValue', operator: 'gte', value: 200 }], matchMode: 'all', createdAt: now },
    { id: 'seg_atrisk', name: 'At Risk', rules: [{ id: 'r2', field: 'segment', operator: 'eq', value: 'At-risk' }], matchMode: 'all', createdAt: now },
  ]
}

export function saveSegments(segments: CustomerSegmentDefinition[]) {
  writeJson(SEGMENTS_KEY, segments)
}

function evalRule(customer: CustomerProfile, rule: SegmentRule): boolean {
  const val = customer[rule.field as keyof CustomerProfile]
  const target = rule.value
  switch (rule.operator) {
    case 'eq': return String(val) === String(target)
    case 'gt': return Number(val) > Number(target)
    case 'lt': return Number(val) < Number(target)
    case 'gte': return Number(val) >= Number(target)
    case 'lte': return Number(val) <= Number(target)
    case 'contains': return String(val).toLowerCase().includes(String(target).toLowerCase())
    default: return false
  }
}

export function applySegmentRules(customers: CustomerProfile[], segment: CustomerSegmentDefinition): CustomerProfile[] {
  return customers.filter((c) => {
    const results = segment.rules.map((r) => evalRule(c, r))
    return segment.matchMode === 'all' ? results.every(Boolean) : results.some(Boolean)
  })
}

// ─── Automations ─────────────────────────────────────────────────────────────

export function loadAutomations(): CrmAutomation[] {
  return readJson(AUTOMATIONS_KEY, [
    { id: 'auto_welcome', name: 'Welcome Email', trigger: 'new_customer', action: 'send_email', enabled: true, templateId: 'welcome' },
    { id: 'auto_winback', name: 'Win-back (30d inactive)', trigger: 'inactive_30d', action: 'send_email', enabled: true, templateId: 'winback' },
  ])
}

export function saveAutomations(automations: CrmAutomation[]) {
  writeJson(AUTOMATIONS_KEY, automations)
}

// ─── Lead scoring ────────────────────────────────────────────────────────────

export function calculateLeadScore(customer: CustomerProfile): number {
  let score = 0
  score += Math.min(customer.orders * 10, 40)
  score += Math.min(customer.lifetimeValue / 10, 40)
  if (customer.status === 'active') score += 10
  if (customer.segment === 'Loyal') score += 10
  if (customer.unsubscribed) score -= 20
  return Math.max(0, Math.min(100, Math.round(score)))
}

export function refreshAllLeadScores(customers: CustomerProfile[]): CustomerProfile[] {
  return customers.map((c) => ({ ...c, leadScore: calculateLeadScore(c) }))
}

// ─── Duplicate detection & merge ─────────────────────────────────────────────

export function findDuplicateCustomers(customers: CustomerProfile[]): CustomerProfile[][] {
  const groups: CustomerProfile[][] = []
  for (const c of customers) {
    const email = c.email.toLowerCase().trim()
    let found = false
    for (const g of groups) {
      if (g.some((m) => m.email.toLowerCase().trim() === email)) {
        g.push(c)
        found = true
        break
      }
    }
    if (!found) groups.push([c])
  }
  return groups.filter((g) => g.length > 1)
}

export function mergeCustomers(primaryId: string, mergeIds: string[], customers: CustomerProfile[]): CustomerProfile[] {
  const primary = customers.find((c) => c.id === primaryId)
  if (!primary) return customers
  const toMerge = customers.filter((c) => mergeIds.includes(c.id))
  const merged: CustomerProfile = {
    ...primary,
    orders: primary.orders + toMerge.reduce((s, c) => s + c.orders, 0),
    lifetimeValue: primary.lifetimeValue + toMerge.reduce((s, c) => s + c.lifetimeValue, 0),
  }
  addActivity({ customerId: primaryId, type: 'merge', title: 'Contacts merged', body: `Merged ${mergeIds.length} duplicate(s)` })
  logAudit('merge_contacts', 'system', { primaryId, mergeIds })
  return [merged, ...customers.filter((c) => c.id !== primaryId && !mergeIds.includes(c.id))]
}

// ─── Consent / unsubscribe ───────────────────────────────────────────────────

export function updateConsent(customerId: string, consent: Partial<CustomerConsent>, customers: CustomerProfile[]): CustomerProfile[] {
  return customers.map((c) =>
    c.id === customerId
      ? { ...c, consent: { marketing: true, sms: false, analytics: true, updatedAt: new Date().toISOString(), ...c.consent, ...consent }, unsubscribed: consent.marketing === false ? true : c.unsubscribed }
      : c
  )
}

export function unsubscribeCustomer(customerId: string, customers: CustomerProfile[]): CustomerProfile[] {
  logAudit('unsubscribe', 'customer', { customerId })
  return updateConsent(customerId, { marketing: false, sms: false, updatedAt: new Date().toISOString() }, customers).map((c) =>
    c.id === customerId ? { ...c, unsubscribed: true } : c
  )
}

// ─── Enrichment (mock lookup API) ────────────────────────────────────────────

export async function enrichContact(customer: CustomerProfile): Promise<CustomerProfile> {
  await new Promise((r) => setTimeout(r, 400))
  const domain = customer.email.split('@')[1] || 'unknown.com'
  return {
    ...customer,
    tags: [...(customer.tags || []), `domain:${domain}`, 'enriched'],
    enrichedAt: new Date().toISOString(),
    leadScore: calculateLeadScore(customer) + 5,
  }
}

// ─── Email / SMS (mock with deliverability metadata) ─────────────────────────

export interface MessageResult {
  id: string
  channel: 'email' | 'sms'
  to: string
  status: 'queued' | 'sent' | 'delivered' | 'bounced'
  deliverabilityScore: number
  sentAt: string
}

const EMAIL_TEMPLATES: Record<string, { subject: string; body: string }> = {
  welcome: { subject: 'Welcome to our store!', body: 'Thanks for joining us.' },
  winback: { subject: 'We miss you!', body: 'Come back for 10% off your next order.' },
  custom: { subject: 'Message from DropEase', body: 'Hello from your store.' },
}

export async function sendEmail(to: string, templateId: string, customerId?: string): Promise<MessageResult> {
  const tpl = EMAIL_TEMPLATES[templateId] || EMAIL_TEMPLATES.custom
  await new Promise((r) => setTimeout(r, 300))
  const result: MessageResult = {
    id: `msg_${Math.random().toString(36).slice(2, 9)}`,
    channel: 'email',
    to,
    status: 'delivered',
    deliverabilityScore: 92 + Math.floor(Math.random() * 8),
    sentAt: new Date().toISOString(),
  }
  if (customerId) {
    addActivity({ customerId, type: 'email', title: `Email sent: ${tpl.subject}`, body: tpl.body })
  }
  return result
}

export async function sendSMS(to: string, message: string, customerId?: string): Promise<MessageResult> {
  await new Promise((r) => setTimeout(r, 250))
  const result: MessageResult = {
    id: `sms_${Math.random().toString(36).slice(2, 9)}`,
    channel: 'sms',
    to,
    status: 'delivered',
    deliverabilityScore: 88 + Math.floor(Math.random() * 10),
    sentAt: new Date().toISOString(),
  }
  if (customerId) {
    addActivity({ customerId, type: 'sms', title: 'SMS sent', body: message.slice(0, 160) })
  }
  return result
}

// ─── Roles & permissions ─────────────────────────────────────────────────────

const ROLE_PERMISSIONS: Record<CrmRole, string[]> = {
  owner: ['read', 'write', 'delete', 'export', 'import', 'email', 'sms', 'gdpr', 'audit', 'automations'],
  admin: ['read', 'write', 'delete', 'export', 'import', 'email', 'sms', 'gdpr', 'audit', 'automations'],
  agent: ['read', 'write', 'email', 'sms', 'export'],
  viewer: ['read', 'export'],
}

export function getCurrentRole(): CrmRole {
  return readJson<CrmRole>(ROLE_KEY, 'owner')
}

export function setCurrentRole(role: CrmRole) {
  writeJson(ROLE_KEY, role)
}

export function hasPermission(action: string): boolean {
  const role = getCurrentRole()
  return ROLE_PERMISSIONS[role]?.includes(action) ?? false
}

// ─── Audit log ─────────────────────────────────────────────────────────────────

export function loadAuditLog(): CrmAuditEntry[] {
  return readJson(AUDIT_KEY, [])
}

export function logAudit(action: string, actor: string, changes?: Record<string, unknown>, customerId?: string) {
  const log = loadAuditLog()
  log.unshift({
    id: `audit_${Math.random().toString(36).slice(2, 9)}`,
    customerId,
    action,
    actor,
    changes,
    createdAt: new Date().toISOString(),
  })
  writeJson(AUDIT_KEY, log.slice(0, 200))
}

// ─── GDPR ────────────────────────────────────────────────────────────────────

export function loadGdprRequests(): GdprRequest[] {
  return readJson(GDPR_KEY, [])
}

export function saveGdprRequests(requests: GdprRequest[]) {
  writeJson(GDPR_KEY, requests)
}

export function requestGdprExport(customerId: string, customers: CustomerProfile[]): GdprRequest {
  const req: GdprRequest = {
    id: `gdpr_${Math.random().toString(36).slice(2, 9)}`,
    customerId,
    type: 'export',
    status: 'pending',
    requestedAt: new Date().toISOString(),
  }
  const requests = loadGdprRequests()
  requests.unshift(req)
  saveGdprRequests(requests)
  logAudit('gdpr_export_requested', 'customer', { customerId })
  // Auto-complete export data
  const customer = customers.find((c) => c.id === customerId)
  if (customer) {
    req.status = 'completed'
    req.completedAt = new Date().toISOString()
    const data = JSON.stringify({ customer, activities: getCustomerTimeline(customerId), exportedAt: req.completedAt }, null, 2)
    if (typeof window !== 'undefined') {
      downloadCSV(data, `gdpr-export-${customerId}.json`)
    }
  }
  return req
}

export function requestGdprDeletion(customerId: string): GdprRequest {
  const req: GdprRequest = {
    id: `gdpr_${Math.random().toString(36).slice(2, 9)}`,
    customerId,
    type: 'delete',
    status: 'pending',
    requestedAt: new Date().toISOString(),
  }
  const requests = loadGdprRequests()
  requests.unshift(req)
  saveGdprRequests(requests)
  logAudit('gdpr_delete_requested', 'customer', { customerId })
  return req
}

// ─── API sync ──────────────────────────────────────────────────────────────────

export async function syncCustomersFromAPI(): Promise<CustomerProfile[]> {
  try {
    const res = await fetch('/api/customers')
    if (!res.ok) throw new Error('API unavailable')
    const data = await res.json()
    const customers = (data.customers || data) as CustomerProfile[]
    if (customers.length) saveCustomersToLocal(customers)
    return customers
  } catch {
    return loadCustomersFromLocal()
  }
}

export async function pushCustomersToAPI(customers: CustomerProfile[]): Promise<boolean> {
  try {
    const res = await fetch('/api/customers', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customers }),
    })
    return res.ok
  } catch {
    return false
  }
}
