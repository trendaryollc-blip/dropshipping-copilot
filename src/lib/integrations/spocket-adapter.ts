/**
 * Spocket Integration Adapter
 * 
 * Spocket connects you with US/EU suppliers offering fast shipping.
 * Known for high-quality products with branded invoicing.
 * 
 * API Docs: https://developers.spocket.co/
 * Sign Up: https://www.spocket.co/
 * 
 * Required env vars:
 *   SPOCKET_API_KEY=your_spocket_api_key
 *   SPOCKET_API_URL=https://api.spocket.co/v2
 */

const BASE_URL = process.env.SPOCKET_API_URL || 'https://api.spocket.co/v2'
const API_KEY = process.env.SPOCKET_API_KEY || ''

export default function createSpocketAdapter() {
  return {
    id: 'spocket_adapter',
    provider: 'spocket',
    name: 'Spocket',
    description: 'US/EU suppliers with fast shipping & branded invoicing',
    website: 'https://www.spocket.co',
    docsUrl: 'https://developers.spocket.co/',
    status: API_KEY ? 'configured' : 'not_configured',

    async connect() {
      return { connected: !!API_KEY, error: !API_KEY ? 'SPOCKET_API_KEY not configured' : undefined }
    },

    async fetchProducts(searchParams?: { query?: string; country?: string; page?: number }) {
      if (!API_KEY) return []
      try {
        const axios = (await import('axios')).default
        const response = await axios.get(`${BASE_URL}/products`, {
          headers: { 'Authorization': `Bearer ${API_KEY}`, 'Content-Type': 'application/json' },
          params: { search: searchParams?.query, country: searchParams?.country, page: searchParams?.page || 1, per_page: 50 },
          timeout: 15000,
        })
        return (response.data?.data || response.data?.products || []).map((p: any) => ({
          id: `sp_${p.id}`,
          name: p.name || p.title || 'Unknown Product',
          image: p.image || p.thumbnail || p.images?.[0] || '',
          niche: p.category || p.type || 'General',
          priceRange: { min: Number(p.price) || 0, max: Number(p.retail_price) || Number(p.price) || 0 },
          competition: 'medium' as const,
          trendScore: 55,
          supplierName: 'Spocket',
          status: 'active' as const,
          source: 'spocket',
          sourceId: String(p.id),
          originalPrice: Number(p.price),
          variants: p.variants || [],
          shipping: p.shipping || { from: p.supplier?.country || 'US/EU', estimatedDays: '2-14' },
          supplier: p.supplier || { name: 'Spocket Supplier', country: p.supplier?.country || 'US' },
        }))
      } catch (error) {
        console.error('[SpocketAdapter] Failed to fetch products:', error)
        return []
      }
    },

    async pushOrder(order: any) {
      if (!API_KEY) return { ok: false, error: 'SPOCKET_API_KEY not configured' }
      try {
        const axios = (await import('axios')).default
        const response = await axios.post(`${BASE_URL}/orders`, {
          order: {
            id: order.id,
            email: order.customerEmail,
            shipping_address: order.shippingAddress || {},
            products: (order.items || []).map((item: any) => ({
              product_id: item.productId?.replace('sp_', ''),
              variant_id: item.variantId,
              quantity: item.quantity,
            })),
          },
        }, {
          headers: { 'Authorization': `Bearer ${API_KEY}`, 'Content-Type': 'application/json' },
          timeout: 15000,
        })
        return { ok: response.status === 200 || response.status === 201, remoteId: response.data?.data?.id }
      } catch (error) {
        console.error('[SpocketAdapter] Failed to push order:', error)
        return { ok: false, error: (error as Error).message }
      }
    },

    async fetchOrders() {
      if (!API_KEY) return []
      try {
        const axios = (await import('axios')).default
        const response = await axios.get(`${BASE_URL}/orders`, {
          headers: { 'Authorization': `Bearer ${API_KEY}` },
          timeout: 10000,
        })
        return (response.data?.data || response.data?.orders || []).map((o: any) => ({
          id: `spo_${o.id}`,
          productName: o.product_name || 'Spocket Order',
          productImage: '',
          customer: o.customer?.name || o.email || 'Unknown',
          status: this.mapStatus(o.status),
          orderDate: o.created_at || new Date().toISOString(),
          estimatedDelivery: o.estimated_delivery || '',
          trackingNumber: o.tracking_number,
          total: Number(o.total) || 0,
          quantity: o.quantity || 1,
        }))
      } catch (error) {
        console.error('[SpocketAdapter] Failed to fetch orders:', error)
        return []
      }
    },

    mapStatus(status: string): string {
      const statusMap: { [key: string]: string } = { pending: 'pending', processing: 'processing', shipped: 'shipped', delivered: 'delivered', cancelled: 'cancelled', completed: 'delivered' }
      return statusMap[status?.toLowerCase()] || 'pending'
    },

    async pushProduct() { return { ok: false, error: 'Spocket is a sourcing-only platform' } },
    async pullProducts() { return this.fetchProducts() },
    async pullOrders() { return this.fetchOrders() },
  }
}
