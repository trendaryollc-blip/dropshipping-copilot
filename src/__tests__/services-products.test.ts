import { describe, it, expect, beforeEach, vi } from 'vitest'

// Use relative path mocks to ensure vitest can resolve them correctly
vi.mock('../lib/firestore-service', () => ({
  getCollection: vi.fn(),
  getDocument: vi.fn(),
  addDocument: vi.fn(),
  updateDocument: vi.fn(),
  deleteDocument: vi.fn(),
  listenToCollection: vi.fn(() => () => {}),
}))

import {
  getProductById,
  getProductsByStatus,
  getProductsBySupplier,
  getProductsByNiche,
  createProduct,
  updateProduct,
  deleteProduct,
  listenToProducts,
  listenToProduct,
} from '../lib/services/products-service'
import type { Product } from '../types'

const mockProduct: Product = {
  id: 'p1',
  name: 'Test Product',
  image: 'https://example.com/img.jpg',
  niche: 'Electronics',
  priceRange: { min: 10, max: 50 },
  competition: 'low',
  trendScore: 85,
  supplierName: 'TechSupply Co',
  status: 'active',
  importedAt: '2024-01-10',
  views: 100,
}

describe('Products Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getProductById', () => {
    it('returns a product when found', async () => {
      const { getDocument } = await import('../lib/firestore-service')
      vi.mocked(getDocument).mockResolvedValue(mockProduct)
      const result = await getProductById('p1')
      expect(result).toEqual(mockProduct)
    })

    it('returns null when product not found', async () => {
      const { getDocument } = await import('../lib/firestore-service')
      vi.mocked(getDocument).mockResolvedValue(null)
      const result = await getProductById('nonexistent')
      expect(result).toBeNull()
    })

    it('throws when firestore fails', async () => {
      const { getDocument } = await import('../lib/firestore-service')
      vi.mocked(getDocument).mockRejectedValue(new Error('Network error'))
      await expect(getProductById('p1')).rejects.toThrow('Network error')
    })
  })

  describe('getProductsByStatus', () => {
    it('filters products by status', async () => {
      const { getCollection } = await import('../lib/firestore-service')
      const products: Product[] = [
        { ...mockProduct, id: '1', status: 'active' },
        { ...mockProduct, id: '2', status: 'draft' },
        { ...mockProduct, id: '3', status: 'active' },
      ]
      vi.mocked(getCollection).mockResolvedValue(products)
      const result = await getProductsByStatus('active')
      expect(result).toHaveLength(2)
      expect(result.every(p => p.status === 'active')).toBe(true)
    })

    it('returns empty array when no products match status', async () => {
      const { getCollection } = await import('../lib/firestore-service')
      vi.mocked(getCollection).mockResolvedValue([mockProduct])
      const result = await getProductsByStatus('archived')
      expect(result).toHaveLength(0)
    })
  })

  describe('createProduct', () => {
    it('creates a product and returns its id', async () => {
      const { addDocument } = await import('../lib/firestore-service')
      vi.mocked(addDocument).mockResolvedValue('new-id-123')
      const { id, ...productWithoutId } = mockProduct
      const result = await createProduct(productWithoutId)
      expect(result).toBe('new-id-123')
    })
  })

  describe('updateProduct', () => {
    it('updates a product with partial data', async () => {
      const { updateDocument } = await import('../lib/firestore-service')
      await updateProduct('p1', { name: 'Updated Name', trendScore: 90 })
      expect(updateDocument).toHaveBeenCalledWith('copilot_products/p1', { name: 'Updated Name', trendScore: 90 })
    })
  })

  describe('deleteProduct', () => {
    it('deletes a product by id', async () => {
      const { deleteDocument } = await import('../lib/firestore-service')
      await deleteProduct('p1')
      expect(deleteDocument).toHaveBeenCalledWith('copilot_products/p1')
    })
  })

  describe('listenToProducts', () => {
    it('subscribes to products collection', () => {
      const { listenToCollection } = vi.mocked(require('../lib/firestore-service'))
      vi.mocked(listenToCollection).mockReturnValue(() => {})
      const callback = vi.fn()
      const unsubscribe = listenToProducts(callback)
      expect(listenToCollection).toHaveBeenCalledWith('copilot_products', expect.any(Function))
      expect(typeof unsubscribe).toBe('function')
    })
  })

  describe('edge cases', () => {
    it('handles empty collection gracefully', async () => {
      const { getCollection } = await import('../lib/firestore-service')
      vi.mocked(getCollection).mockResolvedValue([])
      const result = await getProductsByStatus('active')
      expect(result).toEqual([])
    })
  })
})