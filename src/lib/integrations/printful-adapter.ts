/**
 * Printful Integration Adapter
 * 
 * Printful provides print-on-demand and fulfillment services for custom products
 * (t-shirts, mugs, posters, etc.) — ideal for branded dropshipping stores.
 * 
 * API Docs: https://developers.printful.com/
 * Sign Up: https://www.printful.com/
 * 
 * Required env vars:
 *   PRINTFUL_API_KEY=your_printful_api_key
 *   PRINTFUL_API_URL=https://api.printful.com
 */

const BASE_URL = process.env.PRINTFUL_API_URL || 'https://api.printful.com'
const API_KEY = process.env.PRINTFUL_API_KEY || ''

export default function createPrintfulAdapter() {
  return {
    id: 'printful_adapter',
    provider: 'printful',
    name: 'Printful',
    description: 'Print-on-demand & fulfillment for custom branded products',
    website: 'https://www.printful.com',
    docsUrl: 'https://developers.printful.com/',
    status: API_KEY ? 'configured' : 'not_configured',

    async connect() {
      return { connected: !!API_KEY, error: !API_KEY ? 'PRINTFUL_API_KEY not configured' : undefined }
    },

    async fetchProducts() {
      if (!API_KEY) return []
      try {
        const axios = (await import('axios')).default
        const response = await axios.get(`${BASE_URL}/store/products`, {
          headers: { 'Authorization': `Bearer ${API_KEY}`, 'Content-Type': 'application/json' },
          timeout: 15000,
        })
        return (response.data?.result?.products || []).map((p: any) => ({
          id: `pf_${p.id}`,
          name: p.name || 'Unknown Product',
          image: p.image || p.thumbnail_url || '',
          niche: p.category || 'Print-on-Demand',
          priceRange: { min: Number(p.price) || 0, max: Number(p.price) || 0 },
          competition: 'low' as const,
          trendScore: 50,
          supplierName: 'Printful',
          status: 'active' as const,
          source: 'printful',
          sourceId: String(p.id),
          originalPrice: Number(p.price),
          stock: 999,
          variants: p.variants || [],
          shipping: p.shipping || { from: 'US/EU', estimatedDays: '3-10' },
        }))
      } catch (error) {
        console.error('[PrintfulAdapter] Failed to fetch products:', error)
        return []
      }
    },

    async pushOrder(order: any) {
      if (!API_KEY) return { ok: false, error: 'PRINTFUL_API_KEY not configured' }
      try {
        const axios = (await import('axios')).default
        const response = await axios.post(`${BASE_URL}/orders`, {
          external_id: order.id,
          items: (order.items || []).map((item: any) => ({
            sync_product_id: item.productId?.replace('pf_', ''),
            quantity: item.quantity,
          })),
          shipping: {
            name: order.customerName || '',
            email: order.customerEmail || '',
            address1: order.shippingAddress?.line1 || '',
            city: order.shippingAddress?.city || '',
            state: order.shippingAddress?.state || '',
            country_code: order.shippingAddress?.country || '',
            zip: order.shippingAddress?.postal_code || '',
          },
        }, {
          headers: { 'Authorization': `Bearer ${API_KEY}`, 'Content-Type': 'application/json' },
          timeout: 15000,
        })
        return { ok: response.status === 200 || response.status === 201, remoteId: response.data?.result?.id }
      } catch (error) {
        console.error('[PrintfulAdapter] Failed to push order:', error)
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
        return (response.data?.result?.orders || []).map((o: any) => ({
          id: `pfo_${o.id}`,
          productName: o.items?.[0]?.product?.name || 'Printful Order',
          productImage: '',
          customer: o.recipient?.name || 'Unknown',
          status: o.status || 'pending',
          orderDate: o.created_at || new Date().toISOString(),
          estimatedDelivery: o.shipping_address?.phone || '',
          trackingNumber: o.shipment?.tracking_number,
          total: Number(o.costs?.total) || 0,
          quantity: o.items?.[0]?.quantity || 1,
        }))
      } catch (error) {
        console.error('[PrintfulAdapter] Failed to fetch orders:', error)
        return []
      }
    },

    async pushProduct() { return { ok: false, error: 'Use Printful API to create products via their catalog' } },
    async pullProducts() { return this.fetchProducts() },
    async pullOrders() { return this.fetchOrders() },
  }
}
