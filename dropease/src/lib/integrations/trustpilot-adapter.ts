import type { Product, Order } from '@/types'

export default function createTrustpilotAdapter() {
  return {
    id: 'trustpilot_adapter',
    provider: 'trustpilot',
    async connect(config: { businessId?: string; apiKey?: string }) {
      return { connected: !!config.businessId }
    },
    async fetchProducts() {
      return [
        { id: 'p_tp_1', name: 'Trustpilot Product 1', image: '', niche: 'Home', priceRange: { min: 20, max: 35 }, competition: 'low', trendScore: 45, supplierName: '', status: 'active' },
      ] as Product[]
    },
    async fetchOrders() {
      return [
        { id: 'ORD-TP-1', productName: 'Trustpilot Product 1', productImage: '', customer: 'Demo TP', status: 'pending', orderDate: new Date().toISOString(), estimatedDelivery: '', total: 31.8, quantity: 1 },
      ] as Order[]
    },
    async pushProduct(product: Product) {
      return { ok: true, remoteId: `tp_${product.id}` }
    },
    async pushOrder(order: Order) {
      return { ok: true, remoteId: `tp_order_${order.id}` }
    },
  }
}