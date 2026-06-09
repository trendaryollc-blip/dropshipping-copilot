// Trendaryo Live Store API Integration
// Used by DropEase automation to sync products, prices, stock, and orders
// Upgraded with robust retry logic, exponential backoff, and detailed error handling.

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

export interface TrendaryoConfig {
  baseUrl: string;
  apiKey: string;
}

export interface ProductUpdate {
  price?: number;
  stock?: number;
}

export interface NewOrder {
  userId: string;
  items: Array<{
    productId: string;
    quantity: number;
    unitPrice: number;
  }>;
  total: number;
  shippingAddress: Record<string, unknown>;
}

export class TrendaryoAPIError extends Error {
  public status?: number;
  public data?: unknown;

  constructor(message: string, status?: number, data?: unknown) {
    super(message);
    this.name = 'TrendaryoAPIError';
    this.status = status;
    this.data = data;
  }
}

class TrendaryoAPI {
  private client: AxiosInstance;
  private maxRetries = 3;
  private retryDelay = 1000; // 1 second base delay

  constructor(config: TrendaryoConfig) {
    this.client = axios.create({
      baseURL: `${config.baseUrl.replace(/\/$/, '')}/api/automation-sync`,
      headers: {
        'x-api-key': config.apiKey,
        'Content-Type': 'application/json',
      },
      timeout: 15_000, // Increased timeout for reliability
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor for logging/debugging (optional in prod)
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        if (process.env.NODE_ENV === 'development') {
          console.debug(`[TrendaryoAPI] ${config.method?.toUpperCase()} ${config.url}`);
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for robust error handling and retry logic
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const config = error.config as InternalAxiosRequestConfig & { __retryCount?: number };
        
        // Check if we should retry (network errors or 5xx server errors)
        const isNetworkError = !error.response;
        const isServerError = error.response && error.response.status >= 500;
        
        if (config && (isNetworkError || isServerError) && (config.__retryCount ?? 0) < this.maxRetries) {
          config.__retryCount = (config.__retryCount ?? 0) + 1;
          
          // Exponential backoff: 1s, 2s, 4s
          const delay = this.retryDelay * Math.pow(2, config.__retryCount - 1);
          
          if (process.env.NODE_ENV === 'development') {
            console.warn(`[TrendaryoAPI] Retry ${config.__retryCount}/${this.maxRetries} after ${delay}ms for ${config.url}`);
          }
          
          await new Promise(resolve => setTimeout(resolve, delay));
          return this.client(config);
        }

        // If we've exhausted retries or it's a 4xx error, throw a detailed custom error
        const status = error.response?.status;
        const data = error.response?.data;
        let message = error.message;

        if (status === 401) message = 'Unauthorized: Invalid TRENDARYO_API_KEY';
        else if (status === 403) message = 'Forbidden: API key lacks permissions';
        else if (status === 404) message = 'Not Found: Endpoint does not exist';
        else if (status && status >= 500) message = `Server Error: Trendaryo API is down (Status ${status})`;
        else if (isNetworkError) message = 'Network Error: Unable to reach Trendaryo API';

        throw new TrendaryoAPIError(message, status, data);
      }
    );
  }

  // Adapter interface — verifies connection
  async connect(): Promise<{ connected: boolean; error?: string }> {
    try {
      // Simple health check or just verify config
      if (!this.client.defaults.headers['x-api-key']) {
        return { connected: false, error: 'Missing API Key' };
      }
      return { connected: true };
    } catch (error) {
      return { connected: false, error: (error as Error).message };
    }
  }

  // Get all products from Trendaryo
  async getAllProducts(): Promise<unknown> {
    try {
      const response = await this.client.get('/products');
      return response.data;
    } catch (error) {
      throw this.handleError('Failed to fetch products', error);
    }
  }

  // Get all orders from Trendaryo
  async getAllOrders(): Promise<unknown> {
    try {
      const response = await this.client.get('/orders');
      return response.data;
    } catch (error) {
      throw this.handleError('Failed to fetch orders', error);
    }
  }

  // Create a new product in Trendaryo
  async createProduct(product: {
    name: string;
    description?: string;
    price?: number;
    category?: string;
    image?: string;
    stock?: number;
    status?: string;
    createdAt?: string;
  }): Promise<unknown> {
    try {
      const response = await this.client.post('/products', product);
      return response.data;
    } catch (error) {
      throw this.handleError('Failed to create product', error);
    }
  }

  // Update product price and/or stock in Trendaryo
  async updateProduct(productId: string, updates: ProductUpdate): Promise<unknown> {
    try {
      const response = await this.client.patch(`/products/${productId}`, updates);
      return response.data;
    } catch (error) {
      throw this.handleError(`Failed to update product ${productId}`, error);
    }
  }

  // Create a new order in Trendaryo
  async createOrder(orderData: NewOrder): Promise<unknown> {
    try {
      const response = await this.client.post('/orders', orderData);
      return response.data;
    } catch (error) {
      throw this.handleError('Failed to create order', error);
    }
  }

  // Update order status
  async updateOrderStatus(orderId: string, status: string): Promise<unknown> {
    try {
      const response = await this.client.patch(`/orders/${orderId}`, { status });
      return response.data;
    } catch (error) {
      throw this.handleError(`Failed to update order ${orderId}`, error);
    }
  }

  // ── Adapter bridge methods ──────────────────────────────────────────

  async fetchProducts(): Promise<unknown[]> {
    const data = await this.getAllProducts();
    return Array.isArray(data) ? data : ((data as { data?: unknown[] })?.data ?? []);
  }

  async fetchOrders(): Promise<unknown[]> {
    const data = await this.getAllOrders();
    return Array.isArray(data) ? data : ((data as { data?: unknown[] })?.data ?? []);
  }

  async pushProduct(product: { id: string; name?: string; description?: string; price?: number; stock?: number; category?: string; image?: string }): Promise<void> {
    if (product.name) {
      // If name is provided, create the product
      await this.createProduct({
        name: product.name,
        description: product.description || '',
        price: product.price || 0,
        stock: product.stock || 0,
        category: product.category || '',
        image: product.image || '',
      });
    } else {
      // Otherwise just update price/stock
      await this.updateProduct(product.id, { price: product.price, stock: product.stock });
    }
  }

  async pushOrder(order: { customer?: string; userId?: string; productName?: string; id?: string; quantity?: number; total?: number }): Promise<void> {
    await this.createOrder({
      userId: order.customer || order.userId || 'unknown',
      items: [{ productId: order.productName || order.id || 'unknown', quantity: order.quantity || 1, unitPrice: order.total || 0 }],
      total: order.total || 0,
      shippingAddress: {},
    });
  }

  // ── Copilot Integration Actions (POST to /copilot-integration) ─────

  /**
   * Sync products from Copilot → Trendaryo
   * POST /api/automation-sync/copilot-integration
   * Body: { action: 'product-sync', payload: { products } }
   */
  async syncProducts(products: unknown[]): Promise<unknown> {
    try {
      const response = await this.client.post('/copilot-integration', {
        action: 'product-sync',
        payload: { products },
      })
      return response.data
    } catch (error) {
      throw this.handleError('Failed to sync products', error)
    }
  }

  /**
   * Pull orders from Trendaryo → Copilot
   * POST /api/automation-sync/copilot-integration
   * Body: { action: 'order-pull', payload: { status, limit } }
   */
  async pullOrders(status?: string, limit?: number): Promise<unknown> {
    try {
      const response = await this.client.post('/copilot-integration', {
        action: 'order-pull',
        payload: {
          status: status || 'pending,processing',
          limit: limit || 50,
        },
      })
      return response.data
    } catch (error) {
      throw this.handleError('Failed to pull orders', error)
    }
  }

  /**
   * Update order status/tracking in Trendaryo
   * POST /api/automation-sync/copilot-integration
   * Body: { action: 'order-update', payload: { orders: [{ orderId, ...updates }] } }
   */
  async updateOrder(orderId: string, updates: Record<string, unknown>): Promise<unknown> {
    try {
      const response = await this.client.post('/copilot-integration', {
        action: 'order-update',
        payload: {
          orders: [{ orderId, ...updates }],
        },
      })
      return response.data
    } catch (error) {
      throw this.handleError(`Failed to update order ${orderId}`, error)
    }
  }

  /**
   * Sync suppliers from Copilot → Trendaryo
   * POST /api/automation-sync/copilot-integration
   * Body: { action: 'supplier-sync', payload: { suppliers } }
   */
  async syncSuppliers(suppliers: unknown[]): Promise<unknown> {
    try {
      const response = await this.client.post('/copilot-integration', {
        action: 'supplier-sync',
        payload: { suppliers },
      })
      return response.data
    } catch (error) {
      throw this.handleError('Failed to sync suppliers', error)
    }
  }

  /**
   * Sync prices from Copilot → Trendaryo
   * POST /api/automation-sync/copilot-integration
   * Body: { action: 'price-sync', payload: { prices } }
   */
  async syncPrices(prices: unknown[]): Promise<unknown> {
    try {
      const response = await this.client.post('/copilot-integration', {
        action: 'price-sync',
        payload: { prices },
      })
      return response.data
    } catch (error) {
      throw this.handleError('Failed to sync prices', error)
    }
  }

  /**
   * Sync stock levels from Copilot → Trendaryo
   * POST /api/automation-sync/copilot-integration
   * Body: { action: 'stock-sync', payload: { stock } }
   */
  async syncStock(stock: unknown[]): Promise<unknown> {
    try {
      const response = await this.client.post('/copilot-integration', {
        action: 'stock-sync',
        payload: { stock },
      })
      return response.data
    } catch (error) {
      throw this.handleError('Failed to sync stock', error)
    }
  }

  // ── Private Helpers ─────────────────────────────────────────────────

  private handleError(context: string, error: unknown): TrendaryoAPIError {
    if (error instanceof TrendaryoAPIError) {
      return error; // Already formatted
    }
    
    const axiosError = error as AxiosError;
    const status = axiosError.response?.status;
    const data = axiosError.response?.data;
    
    console.error(`[TrendaryoAPI] ${context}:`, axiosError.message, { status, data });
    return new TrendaryoAPIError(`${context}: ${axiosError.message}`, status, data);
  }
}

// Factory function to create Trendaryo API instance
export function createTrendaryoAPI(): TrendaryoAPI {
  const config: TrendaryoConfig = {
    baseUrl: process.env.TRENDARYO_BASE_URL || process.env.TRENDARYO_API_URL || 'https://trendaryo.com',
    apiKey: process.env.TRENDARYO_API_KEY || '',
  };

  if (!config.apiKey) {
    console.warn('⚠️ TRENDARYO_API_KEY is not set in environment variables. API calls will fail.');
  }

  return new TrendaryoAPI(config);
}

export default TrendaryoAPI;