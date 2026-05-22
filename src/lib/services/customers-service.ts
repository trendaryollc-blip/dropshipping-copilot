import { getDataStore } from '../server/data-store'
import type { CustomerProfile, CrmActivity, CustomerSegmentDefinition, CrmAutomation, CrmAuditEntry, GdprRequest } from '@/types'

export async function getCustomers(): Promise<CustomerProfile[]> {
  return getDataStore().customers
}

export async function getCustomerById(id: string): Promise<CustomerProfile | null> {
  return getDataStore().customers.find((c) => c.id === id) ?? null
}

export async function upsertCustomers(customers: CustomerProfile[]): Promise<void> {
  getDataStore().customers = customers
}

export async function createCustomer(customer: Omit<CustomerProfile, 'id'>): Promise<string> {
  const id = `cust_${crypto.randomUUID().slice(0, 8)}`
  const entry: CustomerProfile = { ...customer, id }
  getDataStore().customers.unshift(entry)
  getDataStore().auditLog.unshift({
    id: `audit_${crypto.randomUUID().slice(0, 8)}`,
    customerId: id,
    action: 'customer_created',
    actor: 'api',
    createdAt: new Date().toISOString(),
  })
  return id
}

export async function getActivities(customerId?: string): Promise<CrmActivity[]> {
  const activities = getDataStore().activities
  return customerId ? activities.filter((a) => a.customerId === customerId) : activities
}

export async function addActivity(activity: Omit<CrmActivity, 'id' | 'createdAt'>): Promise<CrmActivity> {
  const entry: CrmActivity = { ...activity, id: `act_${crypto.randomUUID().slice(0, 8)}`, createdAt: new Date().toISOString() }
  getDataStore().activities.unshift(entry)
  return entry
}

export async function getSegments(): Promise<CustomerSegmentDefinition[]> {
  return getDataStore().segments
}

export async function getAutomations(): Promise<CrmAutomation[]> {
  return getDataStore().automations
}

export async function getAuditLog(): Promise<CrmAuditEntry[]> {
  return getDataStore().auditLog
}

export async function getGdprRequests(): Promise<GdprRequest[]> {
  return getDataStore().gdprRequests
}

export async function addGdprRequest(req: Omit<GdprRequest, 'id'>): Promise<GdprRequest> {
  const entry: GdprRequest = { ...req, id: `gdpr_${crypto.randomUUID().slice(0, 8)}` }
  getDataStore().gdprRequests.unshift(entry)
  return entry
}
