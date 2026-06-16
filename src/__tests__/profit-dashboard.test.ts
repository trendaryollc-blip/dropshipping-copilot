import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/firestore-service', () => ({
  getCollection: vi.fn(),
}))

import profitDashboardService from '@/lib/profit-dashboard-service'

describe('Profit Dashboard Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('calculatePnL', () => {
    it('calculates P&L with no data', async () => {
      const { getCollection } = await import('@/lib/firestore-service')
      vi.mocked(getCollection).mockResolvedValue([])

      const result = await profitDashboardService.calculatePnL(
        new Date('2024-01-01'),
        new Date('2024-01-31')
      )

      expect(result.totalRevenue).toBe(0)
      expect(result.totalCOGS).toBe(0)
      expect(result.totalShipping).toBe(0)
      expect(result.totalAdSpend).toBe(0)
      expect(result.totalFees).toBe(0)
      expect(result.totalRefunds).toBe(0)
      expect(result.netProfit).toBe(0)
      expect(result.profitMargin).toBe(0)
      expect(result.topProducts).toEqual([])
      expect(result.periodStart).toBeTruthy()
      expect(result.periodEnd).toBeTruthy()
    })

    it('calculates P&L with orders', async () => {
      const { getCollection } = await import('@/lib/firestore-service')
      vi.mocked(getCollection)
        .mockResolvedValueOnce([
          {
            id: 'o1',
            orderDate: '2024-01-15',
            status: 'delivered',
            total: 100,
            shippingCost: 10,
            items: [{ productId: 'p1', quantity: 2, unitPrice: 50 }],
          },
          {
            id: 'o2',
            orderDate: '2024-01-20',
            status: 'pending',
            total: 50,
            shippingCost: 5,
            items: [{ productId: 'p2', quantity: 1, unitPrice: 50 }],
          },
        ])
        .mockResolvedValueOnce([
          { id: 'p1', name: 'Product 1', cogs: 20, supplierPrice: 20 },
          { id: 'p2', name: 'Product 2', cogs: 15 },
        ])
        .mockResolvedValueOnce([]) // no ad spend

      const result = await profitDashboardService.calculatePnL(
        new Date('2024-01-01'),
        new Date('2024-01-31')
      )

      expect(result.totalRevenue).toBe(150)
      expect(result.totalCOGS).toBeGreaterThan(0)
      expect(result.totalShipping).toBe(15)
      expect(result.netProfit).toBeDefined()
      expect(result.topProducts.length).toBeGreaterThan(0)
    })

    it('excludes cancelled/refunded orders from revenue', async () => {
      const { getCollection } = await import('@/lib/firestore-service')
      vi.mocked(getCollection)
        .mockResolvedValueOnce([
          {
            id: 'o1',
            orderDate: '2024-01-15',
            status: 'cancelled',
            total: 200,
            items: [{ productId: 'p1', quantity: 1, unitPrice: 200 }],
          },
          {
            id: 'o2',
            orderDate: '2024-01-20',
            status: 'refunded',
            total: 100,
            items: [{ productId: 'p2', quantity: 1, unitPrice: 100 }],
          },
        ])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])

      const result = await profitDashboardService.calculatePnL(
        new Date('2024-01-01'),
        new Date('2024-01-31')
      )

      expect(result.totalRevenue).toBe(0)
      expect(result.totalRefunds).toBe(300)
    })

    it('handles orders without items array', async () => {
      const { getCollection } = await import('@/lib/firestore-service')
      vi.mocked(getCollection)
        .mockResolvedValueOnce([
          {
            id: 'o1',
            orderDate: '2024-01-15',
            status: 'delivered',
            total: 50,
            shippingCost: 5,
          },
        ])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])

      const result = await profitDashboardService.calculatePnL(
        new Date('2024-01-01'),
        new Date('2024-01-31')
      )

      expect(result.totalRevenue).toBe(50)
    })
  })
})