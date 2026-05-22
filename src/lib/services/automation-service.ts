import {
  getCollection,
  getDocument,
  addDocument,
  updateDocument,
  deleteDocument,
  listenToCollection
} from '../firestore-service'
import type { AutomationRule, FulfillmentRule, PriceMonitoringRule, EmailMarketingRule, InventoryRule } from '@/types'

const COLLECTION_NAME = 'dropease_automation_rules'

// ============================================================================
// AUTOMATION RULES OPERATIONS
// ============================================================================

export async function getAutomationRules(): Promise<AutomationRule[]> {
  const rules = await getCollection(COLLECTION_NAME)
  return rules as AutomationRule[]
}

export async function getAutomationRuleById(id: string): Promise<AutomationRule | null> {
  const rule = await getDocument(`${COLLECTION_NAME}/${id}`)
  return rule as AutomationRule | null
}

export async function getActiveAutomationRules(): Promise<AutomationRule[]> {
  const rules = await getCollection(COLLECTION_NAME)
  return (rules as AutomationRule[]).filter(r => r.enabled)
}

export async function getAutomationRulesByType(type: AutomationRule['type']): Promise<AutomationRule[]> {
  const rules = await getCollection(COLLECTION_NAME)
  return (rules as AutomationRule[]).filter(r => r.type === type)
}

export async function createAutomationRule(rule: Omit<AutomationRule, 'id'>): Promise<string> {
  return await addDocument(COLLECTION_NAME, rule)
}

export async function updateAutomationRule(id: string, updates: Partial<AutomationRule>): Promise<void> {
  await updateDocument(`${COLLECTION_NAME}/${id}`, updates)
}

export async function enableAutomationRule(id: string): Promise<void> {
  await updateDocument(`${COLLECTION_NAME}/${id}`, { enabled: true, status: 'active' })
}

export async function disableAutomationRule(id: string): Promise<void> {
  await updateDocument(`${COLLECTION_NAME}/${id}`, { enabled: false, status: 'paused' })
}

export async function deleteAutomationRule(id: string): Promise<void> {
  await deleteDocument(`${COLLECTION_NAME}/${id}`)
}

// ============================================================================
// SPECIFIC AUTOMATION TYPES
// ============================================================================

export async function getFulfillmentRules(): Promise<FulfillmentRule[]> {
  const rules = await getCollection(COLLECTION_NAME)
  return (rules as AutomationRule[]).filter(r => r.type === 'fulfillment') as FulfillmentRule[]
}

export async function getPriceMonitoringRules(): Promise<PriceMonitoringRule[]> {
  const rules = await getCollection(COLLECTION_NAME)
  return (rules as AutomationRule[]).filter(r => r.type === 'price_monitoring') as PriceMonitoringRule[]
}

export async function getEmailMarketingRules(): Promise<EmailMarketingRule[]> {
  const rules = await getCollection(COLLECTION_NAME)
  return (rules as AutomationRule[]).filter(r => r.type === 'email_marketing') as EmailMarketingRule[]
}

export async function getInventoryRules(): Promise<InventoryRule[]> {
  const rules = await getCollection(COLLECTION_NAME)
  return (rules as AutomationRule[]).filter(r => r.type === 'inventory') as InventoryRule[]
}

// ============================================================================
// REAL-TIME LISTENERS
// ============================================================================

export function listenToAutomationRules(
  callback: (rules: AutomationRule[]) => void,
  errorCallback?: (error: Error) => void
) {
  return listenToCollection(
    COLLECTION_NAME,
    (data) => callback(data as AutomationRule[]),
    errorCallback
  )
}

export function listenToActiveAutomationRules(
  callback: (rules: AutomationRule[]) => void,
  errorCallback?: (error: Error) => void
) {
  return listenToCollection(
    COLLECTION_NAME,
    (data) => callback((data as AutomationRule[]).filter(r => r.enabled)),
    errorCallback
  )
}

export function listenToAutomationRule(
  id: string,
  callback: (rule: AutomationRule | null) => void,
  errorCallback?: (error: Error) => void
) {
  return listenToCollection(
    COLLECTION_NAME,
    (data) => {
      const rule = (data as AutomationRule[]).find((r) => r.id === id)
      callback(rule as AutomationRule | null)
    },
    errorCallback
  )
}
