/**
 * Base Integration Adapter
 *
 * This provides a unified interface and common functionality for all supplier integrations.
 * Includes error handling, retry logic, rate limiting, and standardized response formats.
 */

import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import { rateLimitAsync } from '../rate-limiter'

// Standardized types for all adapters
export type IntegrationStatus = 'not_configured' | 'configured' | 'connected' | 'error'
export type Product = {
  id: string
  name: string
  image: string
  niche: string
  priceRange: { min: number; max: number }
  competition: 'low' | 'medium' | 'high'
  trendScore: number
  supplierName: string
  status: 'active' | 'inactive' | 'discontinued'
  source: string
  sourceId: string
  originalPrice: number
  variants: any[]
  shipping: { from: string; estimatedDays: string }
  [key: string]: any
}

export type Order = {
  id: string
  productName: string
  productImage: string
  customer: string
  status: string
  orderDate: string
  estimatedDelivery: string
  trackingNumber?: string
  total: number
  quantity: number
  [key: string]: any
}

export type APIResponse<T> = {
  success: boolean
  data?: T
  error?: IntegrationError
  statusCode?: number
}

export type IntegrationErrorType = 'authentication' | 'rate_limit' | 'network' | 'api' | 'validation' | 'unknown'

export type IntegrationError = {
  type: IntegrationErrorType
  message: string
  details?: any
  originalError?: any
  timestamp: string
}

export type RetryConfig = {
  maxRetries: number
  delayMs: number
  backoffFactor: number
}

export type RateLimitConfig = {
  tokensPerInterval: number
  intervalMs: number
}

export const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  delayMs: 1000,
  backoffFactor: 2
}

export const DEFAULT_RATE_LIMIT_CONFIG: RateLimitConfig = {
  tokensPerInterval: 10,
  intervalMs: 1000
}

export class IntegrationErrorClass extends Error {
  constructor(
    public type: IntegrationErrorType,
    message: string,
    public details?: any,
    public originalError?: any,
    public timestamp: string = new Date().toISOString()
  ) {
    super(message)
    this.name = 'IntegrationError'
  }
}

export abstract class BaseAdapter {
  protected abstract readonly provider: string
  protected abstract readonly name: string
  protected abstract readonly baseUrl: string
  protected abstract readonly apiKey: string
  protected abstract readonly requiredEnvVars: string[]

  protected retryConfig: RetryConfig
  private lastRequestTime: number = 0

  constructor() {
    this.retryConfig = DEFAULT_RETRY_CONFIG
  }

  // Standard adapter interface
  abstract connect(): Promise<{ connected: boolean; error?: string }>
  abstract fetchProducts(searchParams?: any): Promise<Product[]>
  abstract pushOrder(order: any): Promise<{ ok: boolean; error?: string; remoteId?: string }>
  abstract fetchOrders(): Promise<Order[]>
  abstract pullProducts(): Promise<Product[]>
  abstract pullOrders(): Promise<Order[]>

  // Common methods
  getAdapterInfo() {
    return {
      id: `${this.provider}_adapter`,
      provider: this.provider,
      name: this.name,
      status: this.getStatus() as IntegrationStatus,
      website: this.getWebsite(),
      docsUrl: this.getDocsUrl(),
      description: this.getDescription()
    }
  }

  protected getStatus(): IntegrationStatus {
    const missingEnvVars = this.requiredEnvVars.filter(varName => !process.env[varName])
    if (missingEnvVars.length > 0) return 'not_configured'
    return 'configured'
  }

  protected async withRetry<T>(fn: () => Promise<T>, operationName: string): Promise<T> {
    let lastError: any
    let retryCount = 0

    while (retryCount <= this.retryConfig.maxRetries) {
      try {
        // Apply rate limiting
        await this.applyRateLimiting()
        return await fn()
      } catch (error) {
        lastError = error
        retryCount++

        if (retryCount > this.retryConfig.maxRetries) break

        const delayMs = this.retryConfig.delayMs * Math.pow(this.retryConfig.backoffFactor, retryCount - 1)
        const shouldRetry = this.shouldRetryError(error, retryCount)

        if (shouldRetry) {
          this.logWarning(`[${this.provider}] ${operationName} failed (attempt ${retryCount}/${this.retryConfig.maxRetries}), retrying in ${delayMs}ms...`)
          await new Promise(resolve => setTimeout(resolve, delayMs))
        } else {
          break
        }
      }
    }

    throw this.createIntegrationErrorFromError(lastError, operationName)
  }

  protected shouldRetryError(error: any, attempt: number): boolean {
    if (error && error.type) {
      // Don't retry authentication errors
      if (error.type === 'authentication') return false
      // Don't retry validation errors
      if (error.type === 'validation') return false
    }

    // Don't retry on 4xx errors except 429 (rate limiting)
    if (error.response && error.response.status >= 400 && error.response.status < 500) {
      if (error.response.status === 429) return true // Retry rate limit errors
      return false
    }

    // Retry server errors and network issues
    if (error.response && error.response.status >= 500) return true
    if (error.code === 'ECONNABORTED') return true
    if (error.code === 'ETIMEDOUT') return true
    if (error.code === 'ENOTFOUND') return true

    return attempt <= 2 // Only retry twice for unknown errors
  }

  protected createIntegrationErrorFromError(error: any, context: string): IntegrationError {
    let errorType: IntegrationErrorType = 'unknown'
    let message = error.message || 'Unknown error'
    let details = error

    if (error.response) {
      // Handle HTTP errors
      const status = error.response.status
      if (status === 401 || status === 403) {
        errorType = 'authentication'
        message = `Authentication failed: ${error.response.data?.message || 'Invalid credentials'}`
      } else if (status === 429) {
        errorType = 'rate_limit'
        message = `Rate limit exceeded: ${error.response.data?.message || 'Too many requests'}`
      } else if (status >= 400 && status < 500) {
        errorType = 'validation'
        message = `API request failed: ${error.response.data?.message || 'Invalid request'}`
      } else if (status >= 500) {
        errorType = 'api'
        message = `Server error: ${error.response.data?.message || 'Internal server error'}`
      }
    } else if (error.code) {
      // Handle network errors
      if (['ECONNABORTED', 'ETIMEDOUT', 'ENOTFOUND'].includes(error.code)) {
        errorType = 'network'
        message = `Network error: ${error.message}`
      }
    }

    return {
      type: errorType,
      message: `[${this.provider}] ${context}: ${message}`,
      details: details,
      originalError: error,
      timestamp: new Date().toISOString()
    }
  }

  protected async makeApiRequest<T>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    try {
      const response = await axios({
        ...config,
        headers: {
          ...config.headers,
          'Authorization': this.apiKey ? `Bearer ${this.apiKey}` : undefined,
          'Content-Type': 'application/json'
        },
        timeout: config.timeout || 15000
      })
      return response
    } catch (error) {
      throw this.createIntegrationErrorFromError(error, `API request to ${config.method?.toUpperCase()} ${config.url}`)
    }
  }

  protected logError(message: string, error?: any) {
    console.error(`[${this.provider}] ${message}`, error || '')
  }

  protected logWarning(message: string) {
    console.warn(`[${this.provider}] ${message}`)
  }

  protected logInfo(message: string) {
    console.info(`[${this.provider}] ${message}`)
  }

  protected async applyRateLimiting() {
    const now = Date.now()
    const timeSinceLastRequest = now - this.lastRequestTime

    if (timeSinceLastRequest < DEFAULT_RATE_LIMIT_CONFIG.intervalMs) {
      const waitTime = DEFAULT_RATE_LIMIT_CONFIG.intervalMs - timeSinceLastRequest
      await new Promise(resolve => setTimeout(resolve, waitTime))
    }

    this.lastRequestTime = Date.now()
  }

  // Abstract methods to be implemented by concrete adapters
  protected abstract getWebsite(): string
  protected abstract getDocsUrl(): string
  protected abstract getDescription(): string
}