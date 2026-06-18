/**e all the changes 
 * Modalyst Integration Adapter - IMPROVED VERSION
 *
 * This is an improved version of the Modalyst adapter that extends the BaseAdapter
 * with enhanced error handling, retry logic, and rate limiting.
 */

import { BaseAdapter } from './base-adapter'

const BASE_URL = process.env.MODALYST_API_URL || 'https://api.modalyst.com/v1'
const API_KEY = process.env.MODALYST_API_KEY || ''

export default function createModalystAdapter() {
  class ModalystAdapter extends BaseAdapter {
    protected readonly provider = 'modalyst'
    protected readonly name = 'Modalyst'
    protected readonly baseUrl = BASE_URL
    protected readonly apiKey = API_KEY
    protected readonly requiredEnvVars = ['MODALYST_API_KEY']

    protected getWebsite(): string {
      return 'https://www.modalyst.co'
    }

    protected getDocsUrl(): string {
      return 'https://docs.modalyst.co/'
    }

    protected getDescription(): string {
      return 'Large marketplace with independent brands & AliExpress suppliers'
    }

    async connect() {
      if (!this.apiKey) {
        return { connected: false, error: 'MODALYST_API_KEY not configured' }
      }

      try {
        // Test the connection by making a simple API call
        await this.withRetry(async () => {
          const response = await this.makeApiRequest({
            method: 'GET',
            url: `${this.baseUrl}/products/search`,
            params: { limit: 1 }
          })
          return response.status === 200
        }, 'connect')

        return { connected: true }
      } catch (error: any) {
        this.logError('Connection test failed', error)
        return { connected: false, error: error.message }
      }
    }

    async fetchProducts(searchParams?: { query?: string; category?: string; page?: number }) {
      if (!this.apiKey) return []

      try {
        const products = await this.withRetry(async () => {
          const response = await this.makeApiRequest({
            method: 'GET',
            url: `${this.baseUrl}/products/search`,
            params: {
              search_term: searchParams?.query,
              category: searchParams?.category,
              page: searchParams?.page || 1,
              limit: 50
            }
          })

          const data = (response.data as any)?.data || (response.data as any)?.products || []
          return data.map((p: any) => ({
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
            variants: p.variants || [],
            shipping: p.shipping || { from: p.supplier_country || 'US', estimatedDays: '5-15' },
          }))
        }, 'fetchProducts')

        this.logInfo(`Successfully fetched ${products.length} products`)
        return products
      } catch (error: any) {
        this.logError('Failed to fetch products', error)
        // Return empty array instead of throwing to maintain API consistency
        return []
      }
    }

    async pushOrder(order: any) {
      if (!this.apiKey) return { ok: false, error: 'MODALYST_API_KEY not configured' }

      try {
        const result = await this.withRetry(async () => {
          const response = await this.makeApiRequest({
            method: 'POST',
            url: `${this.baseUrl}/orders`,
            data: {
              order: {
                external_id: order.id,
                products: (order.items || []).map((item: any) => ({
                  variant_id: item.variantId,
                  quantity: item.quantity,
                })),
                shipping_address: order.shippingAddress || {},
              },
            }
          })

          return {
            ok: response.status === 200 || response.status === 201,
            remoteId: (response.data as any)?.data?.id
          }
        }, 'pushOrder')

        if (result.ok) {
          this.logInfo(`Successfully pushed order ${order.id} to Modalyst`)
        }
        return result
      } catch (error: any) {
        this.logError(`Failed to push order ${order.id}`, error)
        return { ok: false, error: error.message }
      }
    }

    async fetchOrders() {
      if (!this.apiKey) return []

      try {
        const orders = await this.withRetry(async () => {
          const response = await this.makeApiRequest({
            method: 'GET',
            url: `${this.baseUrl}/orders`
          })

          const data = (response.data as any)?.data || (response.data as any)?.orders || []
          return data.map((o: any) => ({
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
        }, 'fetchOrders')

        this.logInfo(`Successfully fetched ${orders.length} orders`)
        return orders
      } catch (error: any) {
        this.logError('Failed to fetch orders', error)
        return []
      }
    }

    async pushProduct() {
      this.logWarning('Modalyst is primarily a sourcing platform - pushProduct not supported')
      return { ok: false, error: 'Modalyst is primarily a sourcing platform' }
    }

    async pullProducts() {
      return this.fetchProducts()
    }

    async pullOrders() {
      return this.fetchOrders()
    }
  }

  return new ModalystAdapter()
}