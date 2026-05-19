import type { Product, Order } from '@/types'

export default function createAmazonAdapter() {
  return {
    id: 'amazon_adapter',
    provider: 'amazon',
    async connect(config: { sellerId?: string; apiKey?: string }) {
      return { connected: !!config.sellerId }
    },
    async fetchProducts() {
      return [ { id: 'p_amz_1', name: 'Amazon Product 1', image: '', niche: 'Misc', priceRange: { min: 12, max: 24 }, competition: 'medium', trendScore: 55, supplierName: '', status: 'active' } ] as Product[]
    },
    async fetchOrders() {
      return [ { id: 'ORD-AMZ-1', productName: 'Amazon Product 1', productImage: '', customer: 'Demo A', status: 'processing', orderDate: new Date().toISOString(), estimatedDelivery: '', total: 34.99, quantity: 1 } ] as Order[]
    },
    async pushProduct(product: Product) {
      return { ok: true, remoteId: `amz_${product.id}` }
    },
    async pushOrder(order: Order) {
      return { ok: true, remoteId: `amz_order_${order.id}` }
    },
  }
}
