// Trendaryo Live Store API Integration
// Used by DropEase automation to sync products, prices, stock, and orders

import axios, { AxiosInstance } from 'axios';

interface TrendaryoConfig {
  baseUrl: string;
  apiKey: string;
}

interface ProductUpdate {
  price?: number;
  stock?: number;
}

interface NewOrder {
  userId: string
  items: Array<{
    productId: string
    quantity: number
    unitPrice: number
  }>
  total: number
  shippingAddress: Record<string, unknown>
}

class TrendaryoAPI {
  private client: AxiosInstance

  constructor(config: TrendaryoConfig) {
    this.client = axios.create({
      baseURL: `${config.baseUrl}/api/automation-sync`,
      headers: {
        'x-api-key': config.apiKey,
        'Content-Type': 'application/json',
      },
      timeout: 10_000,
    })
  }

  // Adapter interface — connects (reads config from env at instantiation)
  async connect(config: { shopUrl?: string; apiKey?: string }): Promise<{ connected: boolean }> {
    return { connected: !!this.client.defaults.headers['x-api-key'] }
  }

  // Get all products from Trendaryo
  async getAllProducts(): Promise<unknown> {
    try {
      const response = await this.client.get('/products')
      return response.data
    } catch (error) {
      const err = error as Error
      console.error('Trendaryo: Failed to fetch products', err.message)
      throw err
    }
  }

  // Get all orders from Trendaryo
  async getAllOrders(): Promise<unknown> {
    try {
      const response = await this.client.get('/orders')
      return response.data
    } catch (error) {
      const err = error as Error
      console.error('Trendaryo: Failed to fetch orders', err.message)
      throw err
    }
  }

  // Update product price and/or stock in Trendaryo
  async updateProduct(productId: string, updates: ProductUpdate): Promise<unknown> {
    try {
      const response = await this.client.patch(`/products/${productId}`, updates)
      return response.data
    } catch (error) {
      const err = error as Error
      console.error(`Trendaryo: Failed to update product ${productId}`, err.message)
      throw err
    }
  }

  // Create a new order in Trendaryo
  async createOrder(orderData: NewOrder): Promise<unknown> {
    try {
      const response = await this.client.post('/orders', orderData)
      return response.data
    } catch (error) {
      const err = error as Error
      console.error('Trendaryo: Failed to create order', err.message)
      throw err
    }
  }

  // Update order status
  async updateOrderStatus(orderId: string, status: string): Promise<unknown> {
    try {
      const response = await this.client.patch(`/orders/${orderId}`, { status })
      return response.data
    } catch (error) {
      const err = error as Error
      console.error(`Trendaryo: Failed to update order ${orderId}`, err.message)
      throw err
    }
  }

  // ── Adapter bridge methods ──────────────────────────────────────────

  async fetchProducts(): Promise<unknown[]> {
    const data = await this.getAllProducts()
    return Array.isArray(data) ? (data as unknown[]) : ((data as { data?: unknown[] })?.data ?? [])
  }

  async fetchOrders(): Promise<unknown[]> {
    const data = await this.getAllOrders()
    return Array.isArray(data) ? (data as unknown[]) : ((data as { data?: unknown[] })?.data ?? [])
  }

  async pushProduct(product: { id: string; price?: number; productName?: string }): Promise<void> {
    await this.updateProduct(product.id, { price: product.price })
  }

  async pushOrder(order: { customer?: string; userId?: string; productName?: string; id?: string; quantity?: number; total?: number }): Promise<void> {
    await this.createOrder({
      userId: order.customer || order.userId || 'unknown',
      items: [{ productId: order.productName || order.id || 'unknown', quantity: order.quantity || 1, unitPrice: order.total || 0 }],
      total: order.total || 0,
      shippingAddress: {},
    })
  }
}

// Factory function to create Trendaryo API instance
export function createTrendaryoAPI(): TrendaryoAPI {
  const config: TrendaryoConfig = {
    baseUrl: process.env.TRENDARYO_API_URL || 'https://your-trendaryo-site.vercel.app',
    apiKey: process.env.TRENDARYO_API_KEY || '',
  };

  if (!config.apiKey) {
    console.warn('⚠️ TRENDARYO_API_KEY is not set in environment variables');
  }

  return new TrendaryoAPI(config);
}

export default TrendaryoAPI;
