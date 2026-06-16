/**
 * Enhanced Fulfillment Engine
 *
 * Extends AutomationBase with comprehensive automation features:
 * - Detailed logging at every step
 * - Progress tracking for bulk operations
 * - Error recovery mechanisms
 * - Real-time status monitoring
 * - Comprehensive result reporting
 */

import { AutomationBase, AutomationResult } from './automation-base'
import { getCollection, updateDocument } from '@/lib/firestore-service'
import { EmailService } from '@/lib/email-service'
import { SMSService } from '@/lib/sms-service'
import { webhookService } from '@/lib/webhook-service'
import { createTrendaryoAPI } from '@/lib/integrations/trendaryo-api'

export interface FulfillmentOrder {
  id: string
  customerId: string
  customerEmail?: string
  customerPhone?: string
  items: Array<{
    productId: string
    quantity: number
    supplierId?: string
    productName?: string
    variantId?: string
  }>
  total: number
  status: string
  shippingAddress?: any
  customerName?: string
}

export class EnhancedFulfillmentEngine extends AutomationBase {
  constructor() {
    super('EnhancedFulfillmentEngine')
  }

  /**
   * Process a new order for auto-fulfillment with enhanced features
   */
  async processOrder(order: FulfillmentOrder): Promise<AutomationResult> {
    this.startOperation()

    try {
      this.logInfo(`Starting auto-fulfillment for order ${order.id}`)
      this.updateProgress(0, 6, 'Updating order status to processing...')

      // 1. Update order status to 'processing'
      await this.withRecovery(
        async () => {
          await updateDocument(`copilot_orders/${order.id}`, {
            status: 'processing',
            fulfillmentStartedAt: new Date().toISOString(),
          })
        },
        async (error) => {
          this.logWarning(`Failed to update order status, will retry: ${error.message}`)
          await new Promise(resolve => setTimeout(resolve, 1000)) // Wait before retry
          await updateDocument(`copilot_orders/${order.id}`, {
            status: 'processing',
            fulfillmentStartedAt: new Date().toISOString(),
          })
        }
      )
      this.updateProgress(1, 6, 'Order status updated to processing')

      // 2. Place order with supplier(s)
      this.updateProgress(2, 6, 'Placing orders with suppliers...')
      const supplierResults = await this.placeSupplierOrders(order)

      if (!supplierResults.success) {
        throw new Error(`Failed to place supplier orders: ${supplierResults.error}`)
      }
      this.updateProgress(3, 6, 'Supplier orders placed successfully')

      // 3. Update order with tracking/supplier info
      this.updateProgress(4, 6, 'Updating order with tracking information...')
      const trackingNumber = await this.generateTrackingNumber(order)
      await updateDocument(`copilot_orders/${order.id}`, {
        status: 'shipped',
        trackingNumber,
        fulfillmentCompletedAt: new Date().toISOString(),
      })
      this.updateProgress(5, 6, 'Order updated with tracking information')

      // 4. Sync status back to Trendaryo with recovery
      await this.syncStatusToTrendaryo(order.id, 'shipped', trackingNumber)

      // 5. Notify customer with multiple channels
      this.updateProgress(6, 6, 'Notifying customer...')
      await this.notifyCustomer(order, trackingNumber)

      this.logSuccess(`Auto-fulfillment completed successfully for order ${order.id}`)
      return this.completeOperation(true)

    } catch (error: any) {
      this.logError(`Auto-fulfillment failed for order ${order.id}`, error)

      // Update order status to 'manual_review' with recovery
      await this.withRecovery(
        async () => {
          await updateDocument(`copilot_orders/${order.id}`, {
            status: 'manual_review',
            fulfillmentError: error.message,
          })
        },
        async (updateError) => {
          this.logWarning(`Failed to update order status to manual_review: ${updateError.message}`)
          // Try alternative approach
          await updateDocument(`copilot_orders/${order.id}`, {
            status: 'error',
            fulfillmentError: `Original: ${error.message}, Update: ${updateError.message}`,
          })
        }
      )

      return this.completeOperation(false)
    }
  }

  /**
   * Place orders with suppliers with enhanced error handling
   */
  private async placeSupplierOrders(order: FulfillmentOrder): Promise<{ success: boolean; error?: string }> {
    this.logInfo(`Placing orders with suppliers for order ${order.id}`)

    // Group items by supplier
    const itemsBySupplier = new Map<string, any[]>()
    order.items.forEach(item => {
      const supplierId = item.supplierId || 'default'
      if (!itemsBySupplier.has(supplierId)) {
        itemsBySupplier.set(supplierId, [])
      }
      itemsBySupplier.get(supplierId)?.push(item)
    })

    // Process each supplier's items
    for (const [supplierId, items] of itemsBySupplier) {
      try {
        this.logInfo(`Processing ${items.length} items with supplier ${supplierId}`)
        // TODO: Replace with real supplier API calls using the improved integration system
        await new Promise(resolve => setTimeout(resolve, 500)) // Simulate API call
      } catch (error: any) {
        this.logError(`Failed to process items with supplier ${supplierId}`, error, true)
        return { success: false, error: error.message }
      }
    }

    return { success: true }
  }

  /**
   * Generate tracking number (simulated)
   */
  private async generateTrackingNumber(order: FulfillmentOrder): Promise<string> {
    // In a real implementation, this would come from the shipping carrier
    return `TRK-${Date.now()}-${order.id.substring(0, 4)}`
  }

  /**
   * Sync status to Trendaryo with recovery mechanism
   */
  private async syncStatusToTrendaryo(orderId: string, status: string, trackingNumber: string): Promise<void> {
    try {
      const trendaryoAPI = createTrendaryoAPI()
      await trendaryoAPI.updateOrderStatus(orderId, status)
      this.logInfo(`Successfully synced order ${orderId} status to Trendaryo`)
    } catch (error: any) {
      this.logWarning(`Failed to sync status to Trendaryo, will retry: ${error.message}`)

      // Retry with exponential backoff
      await this.withRecovery(
        async () => {
          const trendaryoAPI = createTrendaryoAPI()
          await trendaryoAPI.updateOrderStatus(orderId, status)
        },
        async (syncError) => {
          this.logWarning(`Trendaryo sync recovery attempt: ${syncError.message}`)
          await new Promise(resolve => setTimeout(resolve, 2000)) // Wait longer before retry
          const trendaryoAPI = createTrendaryoAPI()
          await trendaryoAPI.updateOrderStatus(orderId, status)
        },
        2 // Only 2 attempts for sync
      )
    }
  }

  /**
   * Notify customer through multiple channels with error recovery
   */
  private async notifyCustomer(order: FulfillmentOrder, trackingNumber: string): Promise<void> {
    const notificationTasks = []

    // Email notification with recovery
    if (order.customerEmail) {
      notificationTasks.push(
        this.withRecovery(
          async () => {
            await EmailService.sendOrderConfirmation(order.customerEmail, {
              orderId: order.id,
              total: order.total,
              items: order.items.map(i => ({
                name: i.productName || `Product ${i.productId}`,
                quantity: i.quantity
              })),
              trackingNumber: trackingNumber
            })
            this.logInfo(`Order confirmation email sent to ${order.customerEmail}`)
          },
          async (emailError) => {
            this.logWarning(`Email failed, will retry: ${emailError.message}`)
            await new Promise(resolve => setTimeout(resolve, 1000))
            await EmailService.sendOrderConfirmation(order.customerEmail, {
              orderId: order.id,
              total: order.total,
              items: order.items.map(i => ({
                name: i.productName || `Product ${i.productId}`,
                quantity: i.quantity
              })),
              trackingNumber: trackingNumber
            })
          }
        )
      )
    }

    // SMS notification with recovery
    if (order.customerPhone) {
      notificationTasks.push(
        this.withRecovery(
          async () => {
            await SMSService.sendOrderStatusUpdate(order.customerPhone || '', {
              orderId: order.id,
              status: 'shipped',
              trackingNumber: trackingNumber
            })
            this.logInfo(`Order status SMS sent to ${order.customerPhone}`)
          },
          async (smsError) => {
            this.logWarning(`SMS failed, will retry: ${smsError.message}`)
            await new Promise(resolve => setTimeout(resolve, 1000))
          await SMSService.sendOrderStatusUpdate(order.customerPhone || '', {
            orderId: order.id,
            status: 'shipped',
            trackingNumber: trackingNumber
            })
          }
        )
      )
    }

    // Execute all notifications in parallel
    await Promise.all(notificationTasks)

    // Webhook notification (no recovery needed, fire-and-forget)
    try {
      await webhookService.sendWebhook({
        url: process.env.FULFILLMENT_WEBHOOK_URL || '',
        event: 'order.fulfilled',
        data: {
          orderId: order.id,
          status: 'shipped',
          trackingNumber,
          trackingUrl: this.generateTrackingUrl(trackingNumber),
          customerEmail: order.customerEmail,
          customerPhone: order.customerPhone
        },
        secret: process.env.WEBHOOK_SECRET,
      })
      this.logInfo(`Webhook sent for order ${order.id}`)
    } catch (webhookError) {
      this.logWarning(`Webhook failed (non-critical): ${(webhookError as Error).message}`)
    }
  }

  /**
   * Generate tracking URL
   */
  private generateTrackingUrl(trackingNumber: string): string {
    // In a real implementation, this would use the actual carrier's tracking URL
    return `https://tracking.example.com/${trackingNumber}`
  }

  /**
   * Process pending orders in batches with progress tracking
   */
  async processPendingOrders(): Promise<AutomationResult> {
      const orders = await this.getPendingOrders()
      const result = await this.processInBatches(
        orders,
        5, // Process 5 orders at a time
        async (order, batchIndex, itemIndex) => {
          this.logInfo(`Processing order ${order.id} (Batch ${batchIndex}, Item ${itemIndex})`)
          const processResult = await this.processOrder(order)
          return {
            orderId: order.id,
            success: processResult.success,
            status: processResult.status
          }
        }
      )

      return this.completeOperation(result.failures.length === 0)
  }

  /**
   * Get pending orders with automation enabled
   */
  private async getPendingOrders(): Promise<FulfillmentOrder[]> {
    try {
      const orders = await getCollection('copilot_orders')
      return orders
        .filter((o: any) => o.status === 'pending' && o.automationEnabled === true)
        .map((o: any) => ({
          id: o.id,
          customerId: o.customerId,
          customerEmail: o.customerEmail,
          customerPhone: o.customerPhone,
          items: o.items || [],
          total: o.total || 0,
          status: o.status || 'pending',
          shippingAddress: o.shippingAddress,
          customerName: o.customerName
        }))
    } catch (error) {
      this.logError('Failed to fetch pending orders', error)
      return []
    }
  }

  /**
   * Get detailed status report
   */
  public getStatusReport(): {
    engineStatus: string
    currentProgress: any
    ordersInQueue: number
    recentResults: AutomationResult[]
  } {
    return {
      engineStatus: this.getStatus(),
      currentProgress: this.getCurrentProgress(),
      ordersInQueue: 0, // Would be populated from database in real implementation
      recentResults: [] // Would store recent operation results
    }
  }
}

// Singleton instance
export const enhancedFulfillmentEngine = new EnhancedFulfillmentEngine()
export default enhancedFulfillmentEngine