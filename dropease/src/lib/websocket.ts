"use client"

import { toast } from "sonner"

export interface WebSocketMessage {
  type: 'order_update' | 'inventory_update' | 'notification' | 'stock_alert'
  data: any
  timestamp: string
}

export interface OrderUpdate {
  orderId: string
  status: string
  message?: string
}

export interface InventoryUpdate {
  productId: string
  stock: number
  supplierId: string
}

export interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  read: boolean
}

export interface StockAlert {
  productId: string
  productName: string
  currentStock: number
  threshold: number
  supplierId: string
}

class WebSocketService {
  private ws: WebSocket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000
  private listeners: Map<string, ((data: any) => void)[]> = new Map()
  private isConnecting = false

  constructor() {
    // Don't auto-connect in development - only connect when explicitly requested
    // this.connect()
  }

  public connect(): void {
    // Disable automatic reconnection in development
    if (process.env.NODE_ENV === 'development') {
      console.log('WebSocket connection disabled in development mode')
      toast.info('WebSocket test mode - click button to test features')
      return
    }

    if (this.isConnecting || (this.ws && this.ws.readyState === WebSocket.OPEN)) {
      return
    }

    this.isConnecting = true
    
    // Mock WebSocket URL - replace with real WebSocket server
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080'
    
    try {
      this.ws = new WebSocket(wsUrl)
      
      this.ws.onopen = () => {
        console.log('WebSocket connected')
        this.isConnecting = false
        this.reconnectAttempts = 0
        this.reconnectDelay = 1000
        toast.success('Real-time updates enabled')
      }

      this.ws.onmessage = (event: MessageEvent) => {
        const message: WebSocketMessage = JSON.parse(event.data)
        this.handleMessage(message)
      }

      this.ws.onclose = () => {
        console.log('WebSocket disconnected')
        this.isConnecting = false
        this.scheduleReconnect()
      }

      this.ws.onerror = (error: Event) => {
        console.error('WebSocket error:', error)
        this.isConnecting = false
        toast.error('Connection error. Attempting to reconnect...')
      }
    } catch (error) {
      console.error('Failed to connect WebSocket:', error)
      this.isConnecting = false
      this.scheduleReconnect()
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      setTimeout(() => {
        this.reconnectAttempts++
        this.reconnectDelay *= 2
        console.log(`Reconnecting... Attempt ${this.reconnectAttempts}`)
        this.connect()
      }, this.reconnectDelay)
    } else {
      toast.error('Unable to establish real-time connection')
    }
  }

  private handleMessage(message: WebSocketMessage): void {
    const listeners = this.listeners.get(message.type)
    if (listeners) {
      listeners.forEach(listener => listener(message.data))
    }

    // Handle specific message types
    switch (message.type) {
      case 'order_update':
        this.handleOrderUpdate(message.data)
        break
      case 'inventory_update':
        this.handleInventoryUpdate(message.data)
        break
      case 'notification':
        this.handleNotification(message.data)
        break
      case 'stock_alert':
        this.handleStockAlert(message.data)
        break
    }
  }

  private handleOrderUpdate(data: OrderUpdate): void {
    toast.info(`Order ${data.orderId} updated: ${data.status}`)
  }

  private handleInventoryUpdate(data: InventoryUpdate): void {
    console.log('Inventory updated:', data)
  }

  private handleNotification(data: Notification): void {
    if (data.type === 'success') {
      toast.success(data.message)
    } else if (data.type === 'warning') {
      toast.warning(data.message)
    } else if (data.type === 'error') {
      toast.error(data.message)
    } else {
      toast.info(data.message)
    }
  }

  private handleStockAlert(data: StockAlert): void {
    toast.warning(`Low stock alert: ${data.productName} has ${data.currentStock} units left`)
  }

  // Public methods for subscribing to events
  subscribe(eventType: string, callback: (data: any) => void): void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, [])
    }
    this.listeners.get(eventType)!.push(callback)
  }

  unsubscribe(eventType: string, callback: (data: any) => void): void {
    const listeners = this.listeners.get(eventType)
    if (listeners) {
      const index = listeners.indexOf(callback)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }

  // Send messages to server
  send(message: WebSocketMessage): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message))
    } else {
      console.warn('WebSocket not connected, message not sent:', message)
    }
  }

  // Close connection
  disconnect(): void {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }

  // Get connection status
  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN
  }
}

// Singleton instance
export const wsService = new WebSocketService()
export default wsService
