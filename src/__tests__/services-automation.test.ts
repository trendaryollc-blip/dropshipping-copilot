import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('@/lib/firestore-service', () => ({
  getCollection: vi.fn(),
  getDocument: vi.fn(),
  addDocument: vi.fn(),
  updateDocument: vi.fn(),
  deleteDocument: vi.fn(),
  listenToCollection: vi.fn(() => () => {}),
}))

import {
  getAutomationRules,
  getAutomationRuleById,
  getActiveAutomationRules,
  getAutomationRulesByType,
  createAutomationRule,
  updateAutomationRule,
  enableAutomationRule,
  disableAutomationRule,
  deleteAutomationRule,
  getFulfillmentRules,
  getPriceMonitoringRules,
  getEmailMarketingRules,
  getInventoryRules,
} from '@/lib/services/automation-service'
import type { AutomationRule } from '@/types'

const mockRule: AutomationRule = {
  id: 'ar1',
  type: 'fulfillment',
  name: 'Auto Fulfill',
  description: 'Auto process orders',
  status: 'active',
  createdAt: '2024-01-01',
  enabled: true,
}

describe('Automation Service', () => {
  beforeEach(() => vi.clearAllMocks())

  describe('getAutomationRules', () => {
    it('returns all rules', async () => {
      const { getCollection } = await import('@/lib/firestore-service')
      vi.mocked(getCollection).mockResolvedValue([mockRule])
      const result = await getAutomationRules()
      expect(result).toHaveLength(1)
      expect(getCollection).toHaveBeenCalledWith('copilot_automation_rules')
    })
  })

  describe('getAutomationRuleById', () => {
    it('returns rule when found', async () => {
      const { getDocument } = await import('@/lib/firestore-service')
      vi.mocked(getDocument).mockResolvedValue(mockRule)
      const result = await getAutomationRuleById('ar1')
      expect(result).toEqual(mockRule)
    })
  })

  describe('getActiveAutomationRules', () => {
    it('returns only enabled rules', async () => {
      const { getCollection } = await import('@/lib/firestore-service')
      vi.mocked(getCollection).mockResolvedValue([
        { ...mockRule, id: '1', enabled: true },
        { ...mockRule, id: '2', enabled: false },
      ])
      const result = await getActiveAutomationRules()
      expect(result).toHaveLength(1)
      expect(result[0].enabled).toBe(true)
    })
  })

  describe('getAutomationRulesByType', () => {
    it('filters by type', async () => {
      const { getCollection } = await import('@/lib/firestore-service')
      vi.mocked(getCollection).mockResolvedValue([
        { ...mockRule, id: '1', type: 'fulfillment' },
        { ...mockRule, id: '2', type: 'price_monitoring' },
      ])
      const result = await getAutomationRulesByType('fulfillment')
      expect(result).toHaveLength(1)
    })
  })

  describe('enableAutomationRule', () => {
    it('sets enabled: true and status: active', async () => {
      const { updateDocument } = await import('@/lib/firestore-service')
      await enableAutomationRule('ar1')
      expect(updateDocument).toHaveBeenCalledWith('copilot_automation_rules/ar1', {
        enabled: true,
        status: 'active',
      })
    })
  })

  describe('disableAutomationRule', () => {
    it('sets enabled: false and status: paused', async () => {
      const { updateDocument } = await import('@/lib/firestore-service')
      await disableAutomationRule('ar1')
      expect(updateDocument).toHaveBeenCalledWith('copilot_automation_rules/ar1', {
        enabled: false,
        status: 'paused',
      })
    })
  })

  describe('type-specific queries', () => {
    it('getFulfillmentRules filters correctly', async () => {
      const { getCollection } = await import('@/lib/firestore-service')
      vi.mocked(getCollection).mockResolvedValue([
        { ...mockRule, id: '1', type: 'fulfillment' },
        { ...mockRule, id: '2', type: 'email_marketing' },
      ])
      const result = await getFulfillmentRules()
      expect(result).toHaveLength(1)
    })

    it('getPriceMonitoringRules filters correctly', async () => {
      const { getCollection } = await import('@/lib/firestore-service')
      vi.mocked(getCollection).mockResolvedValue([
        { ...mockRule, id: '1', type: 'price_monitoring' },
        { ...mockRule, id: '2', type: 'inventory' },
      ])
      const result = await getPriceMonitoringRules()
      expect(result).toHaveLength(1)
    })

    it('getEmailMarketingRules filters correctly', async () => {
      const { getCollection } = await import('@/lib/firestore-service')
      vi.mocked(getCollection).mockResolvedValue([
        { ...mockRule, id: '1', type: 'email_marketing' },
      ])
      const result = await getEmailMarketingRules()
      expect(result).toHaveLength(1)
    })

    it('getInventoryRules filters correctly', async () => {
      const { getCollection } = await import('@/lib/firestore-service')
      vi.mocked(getCollection).mockResolvedValue([
        { ...mockRule, id: '1', type: 'inventory' },
      ])
      const result = await getInventoryRules()
      expect(result).toHaveLength(1)
    })
  })

  describe('CRUD', () => {
    it('creates a rule', async () => {
      const { addDocument } = await import('@/lib/firestore-service')
      vi.mocked(addDocument).mockResolvedValue('ar-new')
      const { id, ...data } = mockRule
      expect(await createAutomationRule(data)).toBe('ar-new')
    })

    it('updates a rule', async () => {
      const { updateDocument } = await import('@/lib/firestore-service')
      await updateAutomationRule('ar1', { name: 'Updated' })
      expect(updateDocument).toHaveBeenCalledWith('copilot_automation_rules/ar1', { name: 'Updated' })
    })

    it('deletes a rule', async () => {
      const { deleteDocument } = await import('@/lib/firestore-service')
      await deleteAutomationRule('ar1')
      expect(deleteDocument).toHaveBeenCalledWith('copilot_automation_rules/ar1')
    })
  })
})