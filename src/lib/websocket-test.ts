"use client"

import { toast } from "sonner"
import wsService, { type WebSocketMessage } from "@/lib/websocket"

// Test function to simulate real-time updates
export function testRealTimeFeatures() {
  console.log("🧪 Testing Real-Time Features...")
  
  // Connect WebSocket for testing
  try {
    wsService.connect()
    toast.success("✅ WebSocket test initiated")
  } catch (error) {
    toast.warning("⚠️ WebSocket test mode")
  }

  // Test 2: Simulate order update
  setTimeout(() => {
    const orderUpdate: WebSocketMessage = {
      type: 'order_update',
      data: {
        orderId: 'ORD-001',
        status: 'shipped',
        message: 'Order has been shipped'
      },
      timestamp: new Date().toISOString()
    }
    
    // Simulate receiving message (in real app, this comes from server)
    console.log("📦 Simulating order update:", orderUpdate)
    toast.info("Test: Order ORD-001 updated to shipped")
  }, 2000)

  // Test 3: Simulate stock alert
  setTimeout(() => {
    console.log("📊 Simulating stock alert")
    toast.warning("Test: Low stock alert for Wireless Earbuds")
  }, 4000)

  // Test 4: Simulate notification
  setTimeout(() => {
    console.log("🔔 Simulating notification")
    toast.success("Test: New supplier message received")
  }, 6000)

  return {
    testOrderUpdate: () => {
      const message: WebSocketMessage = {
        type: 'order_update',
        data: { orderId: 'TEST-001', status: 'processing' },
        timestamp: new Date().toISOString()
      }
      wsService.send(message)
    },
    testStockAlert: () => {
      const message: WebSocketMessage = {
        type: 'stock_alert',
        data: { 
          productId: 'PROD-001', 
          productName: 'Test Product',
          currentStock: 5,
          threshold: 10 
        },
        timestamp: new Date().toISOString()
      }
      wsService.send(message)
    }
  }
}

// Test component removed - using button in orders page instead
