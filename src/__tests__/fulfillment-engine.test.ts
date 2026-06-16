import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'

vi.mock('@/lib/firestore-service', () => ({
  getCollection: vi.fn(),
  updateDocument: vi.fn(),
}))

vi.mock('@/lib/email-service', () => ({
  EmailService: {
    sendOrderConfirmation: vi.fn(),
  },
}))

vi.mock('@/lib/sms-service', () => ({
  SMSService: {
    sendOrderStatusUpdate: vi.fn(),
  },
}))

vi.mock('@/lib/webhook-service', () => ({
  webhookService: {
    sendWebhook: vi.fn(),
  },
}))

vi.mock('@/lib/integrations/trendaryo-api', () => ({
  createTrendaryoAPI: vi.fn(() => ({
    updateOrderStatus: vi.fn(),
  })),
}))

import { fulfillmentEngine, type FulfillmentOrder } from '@/lib/automation/fulfillment-engine'

const mockOrder: FulfillmentOrder = {
  id: 'ORD-001',
  customerId: 'cust-1',
  customerEmail: 'customer@example.com',
  customerPhone: '+15551234567',
  items: [{ productId: 'p1', quantity: 2 }],
  total: 59.99,
  status: 'pending',
}

describe('Fulfillment Engine', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('processOrder', () => {
    it('successfully processes a complete order', async () => {
      const { updateDocument } = await import('@/lib/firestore-service')
      const { EmailService } = await import('@/lib/email-service')
      const { SMSService } = await import('@/lib/sms-service')

      vi.mocked(updateDocument).mockResolvedValue(undefined)
      vi.mocked(EmailService.sendOrderConfirmation).mockResolvedValue(undefined as any)
      vi.mocked(SMSService.sendOrderStatusUpdate).mockResolvedValue({ success: true })

      const result = await fulfillmentEngine.processOrder(mockOrder)

      expect(result.success).toBe(true)
      // Should update status to processing first
      expect(updateDocument).toHaveBeenCalledWith(
        'copilot_orders/ORD-001',
        expect.objectContaining({ status: 'processing' })
      )
    })

    it('handles order with missing optional fields', async () => {
      const { updateDocument } = await import('@/lib/firestore-service')
      vi.mocked(updateDocument).mockResolvedValue(undefined)

      const minimalOrder: FulfillmentOrder = {
        id: 'ORD-002',
        customerId: 'cust-2',
        items: [{ productId: 'p1', quantity: 1 }],
        total: 19.99,
        status: 'pending',
      }

      const result = await fulfillmentEngine.processOrder(minimalOrder)
      expect(result.success).toBe(true)
    })

    it('handles firestore errors gracefully', async () => {
      const { updateDocument } = await import('@/lib/firestore-service')
      vi.mocked(updateDocument).mockRejectedValue(new Error('Firestore write failed'))

      const result = await fulfillmentEngine.processOrder(mockOrder)
      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
    })
  })

  describe('processPendingOrders', () => {
    it('processes multiple pending orders', async () => {
      const { getCollection, updateDocument } = await import('@/lib/firestore-service')
      vi.mocked(getCollection).mockResolvedValue([
        { ...mockOrder, status: 'pending', automationEnabled: true },
        { ...mockOrder, id: 'ORD-003', status: 'pending', automationEnabled: true },
      ])
      vi.mocked(updateDocument).mockResolvedValue(undefined)

      const result = await fulfillmentEngine.processPendingOrders()
      expect(result.processed).toBeGreaterThan(0)
    })

    it('returns zeros when no pending orders', async () => {
      const { getCollection } = await import('@/lib/firestore-service')
      vi.mocked(getCollection).mockResolvedValue([])

      const result = await fulfillmentEngine.processPendingOrders()
      expect(result.processed).toBe(0)
      expect(result.failed).toBe(0)
    })

    it('handles getCollection errors', async () => {
      const { getCollection } = await import('@/lib/firestore-service')
      vi.mocked(getCollection).mockRejectedValue(new Error('Database error'))

      const result = await fulfillmentEngine.processPendingOrders()
      expect(result.processed).toBe(0)
      expect(result.failed).toBe(0)
    })
  })
})