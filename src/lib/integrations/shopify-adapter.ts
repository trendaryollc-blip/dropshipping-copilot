import type { Product, Order } from '@/types'

export default function createShopifyAdapter() {
  return {
    id: 'shopify_adapter',
    provider: 'shopify',
    async connect(config: { shopUrl?: string; apiKey?: string }) {
      // mock connect
      return { connected: !!config.shopUrl }
    },
    async fetchProducts() {
      // return mocked products
      return [ { id: 'p_shop_1', name: 'Shopify Product 1', image: '', niche: 'Misc', priceRange: { min: 10, max: 20 }, competition: 'low', trendScore: 50, supplierName: '', status: 'active' } ] as Product[]
    },
    async fetchOrders() {
      return [ { id: 'ORD-SH-1', productName: 'Shopify Product 1', productImage: '', customer: 'Demo', status: 'pending', orderDate: new Date().toISOString(), estimatedDelivery: '', total: 29.99, quantity: 1 } ] as Order[]
    },
    async pushProduct(product: Product) {
      return { ok: true, remoteId: `sh_${product.id}` }
    },
    async pushOrder(order: Order) {
      return { ok: true, remoteId: `sh_order_${order.id}` }
    },
    async pullProducts() {
      return this.fetchProducts()
    },
    async pullOrders() {
      return this.fetchOrders()
    },
  }
}
