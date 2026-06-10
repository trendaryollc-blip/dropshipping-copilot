/**
 * Zendrop Integration Adapter
 * 
 * Zendrop is a popular US-based dropshipping supplier with fast shipping,
 * product sourcing, and automated fulfillment.
 * 
 * API Docs: https://developer.zendrop.com/
 * Sign Up: https://www.zendrop.com/
 * 
 * Required env vars:
 *   ZENDROP_API_KEY=your_zendrop_api_key
 *   ZENDROP_API_URL=https://api.zendrop.com/v1
 */

import type { Product, Order } from '@/types'

const BASE_URL = process.env.ZENDROP_API_URL || 'https://api.zendrop.com/v1'
const API_KEY = process.env.ZENDROP_API_KEY || ''

export default function createZendropAdapter() {
  return {
    id: 'zendrop_adapter',
    provider: 'zendrop',
    name: 'Zendrop',
    description: 'US-based dropshipping with fast shipping & automated fulfillment',
    website: 'https://www.zendrop.com',
    docsUrl: 'https://developer.zendrop.com/',
    status: API_KEY ? 'configured' : 'not_configured',

    async connect() {
      return { connected: !!API_KEY, error: !API_KEY ? 'ZENDROP_API_KEY not configured' : undefined }
    },

    async fetchProducts(searchParams?: { query?: string; category?: string; page?: number }) {
      if (!API_KEY) return []
      try {
        const axios = (await import('axios')).default
        const response = await axios.get(`${BASE_URL}/products`, {
          headers: { 'x-api-key': API_KEY, 'Content-Type': 'application/json' },
          params: { search: searchParams?.query, category: searchParams?.category, page: searchParams?.page || 1, limit: 50 },
          timeout: 15000,
        })
        return (response.data?.data || response.data?.products || []).map((p: any) => ({
          id: `zd_${p.id}`,
          name: p.name || p.title || 'Unknown Product',
          image: p.image || p.images?.[0] || '',
          niche: p.category || p.type || 'General',
          priceRange: { min: Number(p.price) || 0, max: Number(p.compare_at_price) || Number(p.price) || 0 },
          competition: 'medium' as const,
          trendScore: 50,
          supplierName: 'Zendrop',
          status: 'active' as const,
          source: 'zendrop',
          sourceId: String(p.id),
          originalPrice: Number(p.price),
          stock: p.stock || p.quantity || 0,
          variants: p.variants || [],
          shipping: p.shipping || { from: 'US', estimatedDays: '5-12' },
        }))
      } catch (error) {
        console.error('[ZendropAdapter] Failed to fetch products:', error)
        return []
      }
    },

    async pushProduct(product: any) {
      // Zendrop doesn't allow pushing products from Copilot
      return { ok: false, error: 'Zendrop is a sourcing-only platform' }
    },

    async pushOrder(order: any) {
      if (!API_KEY) return { ok: false, error: 'ZENDROP_API_KEY not configured' }
      try {
        const axios = (await import('axios')).default
        const response = await axios.post(`${BASE_URL}/orders`, {
          order_id: order.id,
          products: (order.items || []).map((item: any) => ({
            product_id: item.productId?.replace('zd_', ''),
            quantity: item.quantity,
            variant_id: item.variantId,
          })),
          shipping_address: order.shippingAddress || {},
          customer: { email: order.customerEmail },
        }, {
          headers: { 'x-api-key': API_KEY, 'Content-Type': 'application/json' },
          timeout: 15000,
        })
        return { ok: response.status === 200 || response.status === 201, remoteId: response.data?.order_id }
      } catch (error) {
        console.error('[ZendropAdapter] Failed to push order:', error)
        return { ok: false, error: (error as Error).message }
      }
    },

    async fetchOrders() {
      if (!API_KEY) return []
      try {
        const axios = (await import('axios')).default
        const response = await axios.get(`${BASE_URL}/orders`, {
          headers: { 'x-api-key': API_KEY },
          timeout: 10000,
        })
        return (response.data?.data || response.data?.orders || []).map((o: any) => ({
          id: `zdo_${o.id}`,
          productName: o.product_name || 'Zendrop Order',
          productImage: '',
          customer: o.customer?.name || o.customer_email || 'Unknown',
          status: this.mapStatus(o.status),
          orderDate: o.created_at || new Date().toISOString(),
          estimatedDelivery: o.estimated_delivery || '',
          trackingNumber: o.tracking_number,
          total: Number(o.total) || 0,
          quantity: o.quantity || 1,
        }))
      } catch (error) {
        console.error('[ZendropAdapter] Failed to fetch orders:', error)
        return []
      }
    },

    mapStatus(status: string): string {
      const statusMap: { [k: string]: string } = { pending: 'pending', processing: 'processing', shipped: 'shipped', delivered: 'delivered', cancelled: 'cancelled', completed: 'delivered' }
      return statusMap[status?.toLowerCase()] || 'pending'
    },

    async pullProducts() { return this.fetchProducts() },
    async pullOrders() { return this.fetchOrders() },
  }
}
