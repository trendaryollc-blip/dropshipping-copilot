/**
 * Modalyst Integration Adapter
 * 
 * Modalyst is one of the largest dropshipping marketplaces, connecting you 
 * with independent brands and AliExpress suppliers with fast processing.
 * 
 * API Docs: https://docs.modalyst.co/
 * Sign Up: https://www.modalyst.co/
 * 
 * Required env vars:
 *   MODALYST_API_KEY=your_modalyst_api_key
 *   MODALYST_API_URL=https://api.modalyst.com/v1
 */

const BASE_URL = process.env.MODALYST_API_URL || 'https://api.modalyst.com/v1'
const API_KEY = process.env.MODALYST_API_KEY || ''

export default function createModalystAdapter() {
  return {
    id: 'modalyst_adapter',
    provider: 'modalyst',
    name: 'Modalyst',
    description: 'Large marketplace with independent brands & AliExpress suppliers',
    website: 'https://www.modalyst.co',
    docsUrl: 'https://docs.modalyst.co/',
    status: API_KEY ? 'configured' : 'not_configured',

    async connect() {
      return { connected: !!API_KEY, error: !API_KEY ? 'MODALYST_API_KEY not configured' : undefined }
    },

    async fetchProducts(searchParams?: { query?: string; category?: string; page?: number }) {
      if (!API_KEY) return []
      try {
        const axios = (await import('axios')).default
        const response = await axios.get(`${BASE_URL}/products/search`, {
          headers: { 'Authorization': `Bearer ${API_KEY}`, 'Content-Type': 'application/json' },
          params: { search_term: searchParams?.query, category: searchParams?.category, page: searchParams?.page || 1, limit: 50 },
          timeout: 15000,
        })
        return (response.data?.data || response.data?.products || []).map((p: any) => ({
          id: `md_${p.id}`,
          name: p.name || p.title || 'Unknown Product',
          image: p.image || p.images?.[0] || '',
          niche: p.category || p.type || 'General',
          priceRange: { min: Number(p.price) || 0, max: Number(p.retail_price) || Number(p.price) || 0 },
          competition: 'medium' as const,
          trendScore: 55,
          supplierName: 'Modalyst',
          status: 'active' as const,
          source: 'modalyst',
          sourceId: String(p.id),
          originalPrice: Number(p.price),
          stock: p.stock || 999,
          variants: p.variants || [],
          shipping: p.shipping || { from: p.supplier_country || 'US', estimatedDays: '5-15' },
        }))
      } catch (error) {
        console.error('[ModalystAdapter] Failed to fetch products:', error)
        return []
      }
    },

    async pushOrder(order: any) {
      if (!API_KEY) return { ok: false, error: 'MODALYST_API_KEY not configured' }
      try {
        const axios = (await import('axios')).default
        const response = await axios.post(`${BASE_URL}/orders`, {
          order: {
            external_id: order.id,
            products: (order.items || []).map((item: any) => ({
              variant_id: item.variantId,
              quantity: item.quantity,
            })),
            shipping_address: order.shippingAddress || {},
          },
        }, {
          headers: { 'Authorization': `Bearer ${API_KEY}`, 'Content-Type': 'application/json' },
          timeout: 15000,
        })
        return { ok: response.status === 200 || response.status === 201, remoteId: response.data?.data?.id }
      } catch (error) {
        console.error('[ModalystAdapter] Failed to push order:', error)
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
          id: `mdo_${o.id}`,
          productName: o.product_name || 'Modalyst Order',
          productImage: '',
          customer: o.customer?.name || o.email || 'Unknown',
          status: o.status || 'pending',
          orderDate: o.created_at || new Date().toISOString(),
          estimatedDelivery: o.estimated_delivery || '',
          trackingNumber: o.tracking_number,
          total: Number(o.total) || 0,
          quantity: o.quantity || 1,
        }))
      } catch (error) {
        console.error('[ModalystAdapter] Failed to fetch orders:', error)
        return []
      }
    },

    async pushProduct() { return { ok: false, error: 'Modalyst is primarily a sourcing platform' } },
    async pullProducts() { return this.fetchProducts() },
    async pullOrders() { return this.fetchOrders() },
  }
}
