import type { Product, Order } from '@/types'

export default function createEbayAdapter() {
  return {
    id: 'ebay_adapter',
    provider: 'ebay',
    async connect(config: { sellerId?: string; apiKey?: string }) {
      return { connected: !!config.sellerId }
    },
    async fetchProducts() {
      return [
        { id: 'p_ebay_1', name: 'eBay Product 1', image: '', niche: 'Gadgets', priceRange: { min: 18, max: 28 }, competition: 'medium', trendScore: 62, supplierName: '', status: 'active' },
      ] as Product[]
    },
    async fetchOrders() {
      return [
        { id: 'ORD-EBAY-1', productName: 'eBay Product 1', productImage: '', customer: 'Demo E', status: 'processing', orderDate: new Date().toISOString(), estimatedDelivery: '', total: 27.5, quantity: 1 },
      ] as Order[]
    },
    async pushProduct(product: Product) {
      return { ok: true, remoteId: `eb_${product.id}` }
    },
    async pushOrder(order: Order) {
      return { ok: true, remoteId: `eb_order_${order.id}` }
    },
  }
}