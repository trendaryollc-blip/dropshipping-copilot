"use client"

import { useEffect, useCallback, useRef } from "react"
import wsService, { type WebSocketMessage, type OrderUpdate, type InventoryUpdate, type Notification, type StockAlert } from "@/lib/websocket"

export function useWebSocket() {
  const wsRef = useRef(wsService)

  const subscribe = useCallback((eventType: string, callback: (data: WebSocketMessage) => void) => {
    wsRef.current.subscribe(eventType, callback)
    
    // Cleanup on unmount
    return () => {
      wsRef.current.unsubscribe(eventType, callback)
    }
  }, [])

  const send = useCallback((message: WebSocketMessage) => {
    wsRef.current.send(message)
  }, [])

  const isConnected = useCallback(() => {
    return wsRef.current.isConnected()
  }, [])

  const disconnect = useCallback(() => {
    wsRef.current.disconnect()
  }, [])

  return {
    subscribe,
    send,
    isConnected,
    disconnect
  }
}

export function useOrderUpdates(callback: (data: OrderUpdate) => void) {
  const { subscribe } = useWebSocket()
  
  useEffect(() => {
    const unsubscribe = subscribe('order_update', callback)
    return unsubscribe
  }, [subscribe, callback])
}

export function useInventoryUpdates(callback: (data: InventoryUpdate) => void) {
  const { subscribe } = useWebSocket()
  
  useEffect(() => {
    const unsubscribe = subscribe('inventory_update', callback)
    return unsubscribe
  }, [subscribe, callback])
}

export function useNotifications(callback: (data: Notification) => void) {
  const { subscribe } = useWebSocket()
  
  useEffect(() => {
    const unsubscribe = subscribe('notification', callback)
    return unsubscribe
  }, [subscribe, callback])
}

export function useStockAlerts(callback: (data: StockAlert) => void) {
  const { subscribe } = useWebSocket()
  
  useEffect(() => {
    const unsubscribe = subscribe('stock_alert', callback)
    return unsubscribe
  }, [subscribe, callback])
}
