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
  userId: string;
  items: Array<{
    productId: string;
    quantity: number;
    unitPrice: number;
  }>;
  total: number;
  shippingAddress: any;
}

class TrendaryoAPI {
  private client: AxiosInstance;

  constructor(config: TrendaryoConfig) {
    this.client = axios.create({
      baseURL: `${config.baseUrl}/api/automation-sync`,
      headers: {
        'x-api-key': config.apiKey,
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });
  }

  // Get all products from Trendaryo
  async getAllProducts() {
    try {
      const response = await this.client.get('/products');
      return response.data;
    } catch (error: any) {
      console.error('Trendaryo: Failed to fetch products', error.message);
      throw error;
    }
  }

  // Update product price and/or stock in Trendaryo
  async updateProduct(productId: string, updates: ProductUpdate) {
    try {
      const response = await this.client.patch(`/products/${productId}`, updates);
      return response.data;
    } catch (error: any) {
      console.error(`Trendaryo: Failed to update product ${productId}`, error.message);
      throw error;
    }
  }

  // Create a new order in Trendaryo
  async createOrder(orderData: NewOrder) {
    try {
      const response = await this.client.post('/orders', orderData);
      return response.data;
    } catch (error: any) {
      console.error('Trendaryo: Failed to create order', error.message);
      throw error;
    }
  }

  // Update order status
  async updateOrderStatus(orderId: string, status: string) {
    try {
      const response = await this.client.patch(`/orders/${orderId}`, { status });
      return response.data;
    } catch (error: any) {
      console.error(`Trendaryo: Failed to update order ${orderId}`, error.message);
      throw error;
    }
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
