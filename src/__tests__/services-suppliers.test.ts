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
  getSuppliers,
  getSupplierById,
  getVerifiedSuppliers,
  getSuppliersByCategory,
  getSuppliersByCountry,
  createSupplier,
  updateSupplier,
  deleteSupplier,
  listenToSuppliers,
  listenToSupplier,
} from '@/lib/services/suppliers-service'
import type { Supplier } from '@/types'

const mockSupplier: Supplier = {
  id: 's1',
  name: 'TechSupply Co',
  avatar: 'https://i.pravatar.cc/80?u=techsupply',
  categories: ['Electronics', 'Gadgets'],
  trustScore: 4.8,
  responseTime: '< 2 hrs',
  country: 'China',
  totalProducts: 2400,
  verified: true,
  minOrder: 1,
}

describe('Suppliers Service', () => {
  beforeEach(() => vi.clearAllMocks())

  describe('getSuppliers', () => {
    it('returns all suppliers', async () => {
      const { getCollection } = await import('@/lib/firestore-service')
      vi.mocked(getCollection).mockResolvedValue([mockSupplier])
      const result = await getSuppliers()
      expect(result).toHaveLength(1)
      expect(getCollection).toHaveBeenCalledWith('copilot_suppliers')
    })

    it('returns empty array when none exist', async () => {
      const { getCollection } = await import('@/lib/firestore-service')
      vi.mocked(getCollection).mockResolvedValue([])
      const result = await getSuppliers()
      expect(result).toEqual([])
    })
  })

  describe('getSupplierById', () => {
    it('returns a supplier when found', async () => {
      const { getDocument } = await import('@/lib/firestore-service')
      vi.mocked(getDocument).mockResolvedValue(mockSupplier)
      const result = await getSupplierById('s1')
      expect(result).toEqual(mockSupplier)
    })

    it('returns null when not found', async () => {
      const { getDocument } = await import('@/lib/firestore-service')
      vi.mocked(getDocument).mockResolvedValue(null)
      const result = await getSupplierById('nonexistent')
      expect(result).toBeNull()
    })
  })

  describe('getVerifiedSuppliers', () => {
    it('returns only verified suppliers', async () => {
      const { getCollection } = await import('@/lib/firestore-service')
      vi.mocked(getCollection).mockResolvedValue([
        { ...mockSupplier, id: '1', verified: true },
        { ...mockSupplier, id: '2', verified: false },
        { ...mockSupplier, id: '3', verified: true },
      ])
      const result = await getVerifiedSuppliers()
      expect(result).toHaveLength(2)
      expect(result.every(s => s.verified)).toBe(true)
    })

    it('returns empty if no verified suppliers', async () => {
      const { getCollection } = await import('@/lib/firestore-service')
      vi.mocked(getCollection).mockResolvedValue([
        { ...mockSupplier, id: '1', verified: false },
      ])
      const result = await getVerifiedSuppliers()
      expect(result).toHaveLength(0)
    })
  })

  describe('getSuppliersByCategory', () => {
    it('filters by category', async () => {
      const { getCollection } = await import('@/lib/firestore-service')
      vi.mocked(getCollection).mockResolvedValue([
        { ...mockSupplier, id: '1', categories: ['Electronics', 'Gadgets'] },
        { ...mockSupplier, id: '2', categories: ['Fashion', 'Accessories'] },
      ])
      const result = await getSuppliersByCategory('Electronics')
      expect(result).toHaveLength(1)
    })
  })

  describe('getSuppliersByCountry', () => {
    it('filters by country', async () => {
      const { getCollection } = await import('@/lib/firestore-service')
      vi.mocked(getCollection).mockResolvedValue([
        { ...mockSupplier, id: '1', country: 'China' },
        { ...mockSupplier, id: '2', country: 'USA' },
      ])
      const result = await getSuppliersByCountry('China')
      expect(result).toHaveLength(1)
      expect(result[0].country).toBe('China')
    })
  })

  describe('CRUD operations', () => {
    it('creates a supplier', async () => {
      const { addDocument } = await import('@/lib/firestore-service')
      vi.mocked(addDocument).mockResolvedValue('new-id')
      const { id, ...data } = mockSupplier
      const result = await createSupplier(data)
      expect(result).toBe('new-id')
    })

    it('updates a supplier', async () => {
      const { updateDocument } = await import('@/lib/firestore-service')
      await updateSupplier('s1', { trustScore: 5.0 })
      expect(updateDocument).toHaveBeenCalledWith('copilot_suppliers/s1', { trustScore: 5.0 })
    })

    it('deletes a supplier', async () => {
      const { deleteDocument } = await import('@/lib/firestore-service')
      await deleteSupplier('s1')
      expect(deleteDocument).toHaveBeenCalledWith('copilot_suppliers/s1')
    })
  })

  describe('listeners', () => {
    it('subscribes to suppliers collection', () => {
      const { listenToCollection } = vi.mocked(require('@/lib/firestore-service'))
      vi.mocked(listenToCollection).mockReturnValue(() => {})
      const unsub = listenToSuppliers(vi.fn())
      expect(listenToCollection).toHaveBeenCalledWith('copilot_suppliers', expect.any(Function), undefined)
      expect(typeof unsub).toBe('function')
    })

    it('subscribes to a single supplier', () => {
      const { listenToCollection } = vi.mocked(require('@/lib/firestore-service'))
      vi.mocked(listenToCollection).mockReturnValue(() => {})
      listenToSupplier('s1', vi.fn())
      expect(listenToCollection).toHaveBeenCalledWith('copilot_suppliers', expect.any(Function), undefined)
    })
  })

  describe('edge cases', () => {
    it('handles suppliers with no categories', async () => {
      const { getCollection } = await import('@/lib/firestore-service')
      vi.mocked(getCollection).mockResolvedValue([{ ...mockSupplier, categories: [] }])
      const result = await getSuppliersByCategory('Anything')
      expect(result).toHaveLength(0)
    })

    it('handles case-sensitive country match', async () => {
      const { getCollection } = await import('@/lib/firestore-service')
      vi.mocked(getCollection).mockResolvedValue([mockSupplier])
      const result = await getSuppliersByCountry('china')
      expect(result).toHaveLength(0) // case-sensitive
    })
  })
})