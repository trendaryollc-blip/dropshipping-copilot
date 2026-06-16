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
  getOrders,
  getOrderById,
  getOrdersByStatus,
  getOrdersByCustomer,
  getPendingOrders,
  getShippedOrders,
  getDeliveredOrders,
  createOrder,
  updateOrder,
  updateOrderStatus,
  deleteOrder,
  listenToOrders,
  listenToOrder,
  listenToPendingOrders,
} from '@/lib/services/orders-service'
import type { Order } from '@/types'

const mockOrder: Order = {
  id: 'ORD-001',
  productName: 'Test Product',
  productImage: 'https://example.com/img.jpg',
  customer: 'John Doe',
  status: 'pending',
  orderDate: '2024-01-15',
  estimatedDelivery: '2024-01-25',
  total: 29.99,
  quantity: 1,
}

describe('Orders Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getOrders', () => {
    it('returns all orders', async () => {
      const { getCollection } = await import('@/lib/firestore-service')
      const orders: Order[] = [mockOrder, { ...mockOrder, id: 'ORD-002' }]
      vi.mocked(getCollection).mockResolvedValue(orders)
      const result = await getOrders()
      expect(result).toHaveLength(2)
      expect(getCollection).toHaveBeenCalledWith('copilot_orders')
    })

    it('returns empty array when no orders', async () => {
      const { getCollection } = await import('@/lib/firestore-service')
      vi.mocked(getCollection).mockResolvedValue([])
      const result = await getOrders()
      expect(result).toEqual([])
    })
  })

  describe('getOrderById', () => {
    it('returns an order when found', async () => {
      const { getDocument } = await import('@/lib/firestore-service')
      vi.mocked(getDocument).mockResolvedValue(mockOrder)
      const result = await getOrderById('ORD-001')
      expect(result).toEqual(mockOrder)
      expect(getDocument).toHaveBeenCalledWith('copilot_orders/ORD-001')
    })

    it('returns null when not found', async () => {
      const { getDocument } = await import('@/lib/firestore-service')
      vi.mocked(getDocument).mockResolvedValue(null)
      const result = await getOrderById('nonexistent')
      expect(result).toBeNull()
    })
  })

  describe('getOrdersByStatus', () => {
    it('filters orders by status', async () => {
      const { getCollection } = await import('@/lib/firestore-service')
      const orders: Order[] = [
        { ...mockOrder, id: '1', status: 'pending' },
        { ...mockOrder, id: '2', status: 'shipped' },
        { ...mockOrder, id: '3', status: 'pending' },
      ]
      vi.mocked(getCollection).mockResolvedValue(orders)
      const result = await getOrdersByStatus('pending')
      expect(result).toHaveLength(2)
      expect(result.every(o => o.status === 'pending')).toBe(true)
    })
  })

  describe('getOrdersByCustomer', () => {
    it('filters orders by customer name', async () => {
      const { getCollection } = await import('@/lib/firestore-service')
      const orders: Order[] = [
        { ...mockOrder, id: '1', customer: 'John Doe' },
        { ...mockOrder, id: '2', customer: 'Jane Smith' },
      ]
      vi.mocked(getCollection).mockResolvedValue(orders)
      const result = await getOrdersByCustomer('John Doe')
      expect(result).toHaveLength(1)
      expect(result[0].customer).toBe('John Doe')
    })
  })

  describe('getPendingOrders', () => {
    it('returns only pending orders', async () => {
      const { getCollection } = await import('@/lib/firestore-service')
      const orders: Order[] = [
        { ...mockOrder, id: '1', status: 'pending' },
        { ...mockOrder, id: '2', status: 'shipped' },
        { ...mockOrder, id: '3', status: 'delivered' },
      ]
      vi.mocked(getCollection).mockResolvedValue(orders)
      const result = await getPendingOrders()
      expect(result).toHaveLength(1)
      expect(result[0].status).toBe('pending')
    })
  })

  describe('getShippedOrders', () => {
    it('returns only shipped orders', async () => {
      const { getCollection } = await import('@/lib/firestore-service')
      vi.mocked(getCollection).mockResolvedValue([
        { ...mockOrder, id: '1', status: 'shipped' },
        { ...mockOrder, id: '2', status: 'pending' },
      ])
      const result = await getShippedOrders()
      expect(result).toHaveLength(1)
      expect(result[0].status).toBe('shipped')
    })
  })

  describe('getDeliveredOrders', () => {
    it('returns only delivered orders', async () => {
      const { getCollection } = await import('@/lib/firestore-service')
      vi.mocked(getCollection).mockResolvedValue([
        { ...mockOrder, id: '1', status: 'delivered' },
        { ...mockOrder, id: '2', status: 'pending' },
      ])
      const result = await getDeliveredOrders()
      expect(result).toHaveLength(1)
      expect(result[0].status).toBe('delivered')
    })
  })

  describe('createOrder', () => {
    it('creates an order and returns id', async () => {
      const { addDocument } = await import('@/lib/firestore-service')
      vi.mocked(addDocument).mockResolvedValue('ORD-999')
      const { id, ...orderData } = mockOrder
      const result = await createOrder(orderData)
      expect(result).toBe('ORD-999')
      expect(addDocument).toHaveBeenCalledWith('copilot_orders', orderData)
    })
  })

  describe('updateOrder', () => {
    it('updates an order partially', async () => {
      const { updateDocument } = await import('@/lib/firestore-service')
      await updateOrder('ORD-001', { total: 39.99 })
      expect(updateDocument).toHaveBeenCalledWith('copilot_orders/ORD-001', { total: 39.99 })
    })
  })

  describe('updateOrderStatus', () => {
    it('updates only the status field', async () => {
      const { updateDocument } = await import('@/lib/firestore-service')
      await updateOrderStatus('ORD-001', 'shipped')
      expect(updateDocument).toHaveBeenCalledWith('copilot_orders/ORD-001', { status: 'shipped' })
    })
  })

  describe('deleteOrder', () => {
    it('deletes an order', async () => {
      const { deleteDocument } = await import('@/lib/firestore-service')
      await deleteOrder('ORD-001')
      expect(deleteDocument).toHaveBeenCalledWith('copilot_orders/ORD-001')
    })
  })

  describe('listenToOrders', () => {
    it('subscribes to orders collection', () => {
      const { listenToCollection } = vi.mocked(require('@/lib/firestore-service'))
      const cb = vi.fn()
      const unsub = listenToOrders(cb)
      expect(listenToCollection).toHaveBeenCalledWith('copilot_orders', expect.any(Function), undefined)
      expect(typeof unsub).toBe('function')
    })
  })

  describe('listenToPendingOrders', () => {
    it('subscribes with pending filter', () => {
      const { listenToCollection } = vi.mocked(require('@/lib/firestore-service'))
      listenToPendingOrders(vi.fn())
      expect(listenToCollection).toHaveBeenCalledWith('copilot_orders', expect.any(Function), undefined)
    })
  })

  describe('edge cases', () => {
    it('handles cancelled orders gracefully', async () => {
      const { getCollection } = await import('@/lib/firestore-service')
      vi.mocked(getCollection).mockResolvedValue([
        { ...mockOrder, id: '1', status: 'cancelled' },
      ])
      const pending = await getPendingOrders()
      expect(pending).toHaveLength(0)
    })

    it('handles orders with missing fields', async () => {
      const { getDocument } = await import('@/lib/firestore-service')
      vi.mocked(getDocument).mockResolvedValue({ id: 'bad', productName: 'Partial' } as any)
      const result = await getOrderById('bad')
      expect(result).toBeDefined()
      expect((result as any).productName).toBe('Partial')
    })
  })
})