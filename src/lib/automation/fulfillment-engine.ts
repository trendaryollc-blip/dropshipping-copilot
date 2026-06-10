/**
 * Fulfillment Engine
 * Handles end-to-end auto-fulfillment: Order detected → Supplier order placed → Tracking updated → Customer notified.
 */

import { getCollection, updateDocument } from '@/lib/firestore-service';
import { EmailService } from '@/lib/email-service';
import { SMSService } from '@/lib/sms-service';
import { webhookService } from '@/lib/webhook-service';
import { createTrendaryoAPI } from '@/lib/integrations/trendaryo-api';

export interface FulfillmentOrder {
  id: string;
  customerId: string;
  customerEmail?: string;
  customerPhone?: string;
  items: Array<{ productId: string; quantity: number; supplierId?: string }>;
  total: number;
  status: string;
}

class FulfillmentEngine {
  /**
   * Process a new order for auto-fulfillment
   */
  async processOrder(order: FulfillmentOrder): Promise<{ success: boolean; error?: string }> {
    try {
      console.log(`[FulfillmentEngine] Starting auto-fulfillment for order ${order.id}`);

      // 1. Update order status to 'processing'
      await updateDocument(`copilot_orders/${order.id}`, {
        status: 'processing',
        fulfillmentStartedAt: new Date().toISOString(),
      });

      // 2. Place order with supplier(s)
      const supplierResults = await this.placeSupplierOrders(order);
      
      if (!supplierResults.success) {
        throw new Error(`Failed to place supplier orders: ${supplierResults.error}`);
      }

      // 3. Update order with tracking/supplier info (mocked for now, would be real data from supplier API)
      const trackingNumber = `TRK-${Date.now()}`; // Placeholder
      await updateDocument(`copilot_orders/${order.id}`, {
        status: 'shipped',
        trackingNumber,
        fulfillmentCompletedAt: new Date().toISOString(),
      });

      // 4. Sync status back to Trendaryo
      try {
        const trendaryoAPI = createTrendaryoAPI();
        await trendaryoAPI.updateOrderStatus(order.id, 'shipped');
      } catch (err) {
        console.warn(`[FulfillmentEngine] Failed to sync status to Trendaryo:`, err);
      }

      // 5. Notify customer
      if (order.customerEmail) {
        await EmailService.sendOrderConfirmation(order.customerEmail, {
          orderId: order.id,
          total: order.total,
          items: order.items.map(i => ({ name: `Product ${i.productId}`, quantity: i.quantity })),
        });
      }

      if (order.customerPhone) {
        await SMSService.sendOrderStatusUpdate(order.customerPhone, {
          orderId: order.id,
          status: 'shipped',
          trackingNumber,
        });
      }

      // 6. Fire webhook to external systems
      await webhookService.sendWebhook({
        url: process.env.FULFILLMENT_WEBHOOK_URL || '',
        event: 'order.fulfilled',
        data: { orderId: order.id, status: 'shipped', trackingNumber },
        secret: process.env.WEBHOOK_SECRET,
      });

      console.log(`[FulfillmentEngine] Auto-fulfillment completed successfully for order ${order.id}`);
      return { success: true };
    } catch (error) {
      console.error(`[FulfillmentEngine] Auto-fulfillment failed for order ${order.id}:`, error);
      
      // Update order status to 'failed' or 'manual_review'
      await updateDocument(`copilot_orders/${order.id}`, {
        status: 'manual_review',
        fulfillmentError: (error as Error).message,
      });

      return { success: false, error: (error as Error).message };
    }
  }

  /**
   * Place orders with suppliers
   * Supports Trendaryo, CJ Dropshipping, and custom supplier API via webhook.
   */
  private async placeSupplierOrders(order: FulfillmentOrder): Promise<{ success: boolean; error?: string }> {
    console.log(`[FulfillmentEngine] Placing orders with suppliers for order ${order.id}`);

    // Attempt to place via Trendaryo API (primary dropshipping integration)
    try {
      const trendaryoAPI = createTrendaryoAPI();
      await trendaryoAPI.createOrder({
        userId: order.customerId,
        items: order.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: 0, // Will be looked up by Trendaryo
        })),
        total: order.total,
        shippingAddress: {},
      });
      console.log(`[FulfillmentEngine] Order placed via Trendaryo for order ${order.id}`);
      return { success: true };
    } catch (trendaryoError) {
      console.warn(`[FulfillmentEngine] Trendaryo order placement failed, trying CJ Dropshipping:`, trendaryoError);
    }

    // Fallback: attempt via CJ Dropshipping API if configured
    if (process.env.CJ_API_KEY && process.env.CJ_API_KEY !== 'your_cj_api_key_here') {
      try {
        const axios = (await import('axios')).default;
        const cjResponse = await axios.post('https://developers.cjdropshipping.com/api2.0/v1/order/create', {
          appKey: process.env.CJ_API_KEY,
          id: order.id,
          products: order.items.map((item) => ({
            vid: item.productId,
            quantity: item.quantity,
          })),
          shippingAddress: {},
        }, { timeout: 15000 });
        
        if (cjResponse.data?.code === 200) {
          console.log(`[FulfillmentEngine] Order placed via CJ Dropshipping for order ${order.id}`);
          return { success: true };
        }
        console.warn(`[FulfillmentEngine] CJ Dropshipping responded: ${cjResponse.data?.message || 'unknown error'}`);
      } catch (cjError) {
        console.warn(`[FulfillmentEngine] CJ Dropshipping fallback failed:`, cjError);
      }
    }

    // Last resort: fire a fulfillment webhook to a custom supplier system
    if (process.env.FULFILLMENT_WEBHOOK_URL) {
      try {
        const { webhookService } = await import('@/lib/webhook-service');
        await webhookService.sendWebhook({
          url: process.env.FULFILLMENT_WEBHOOK_URL,
          event: 'order.fulfill',
          data: { orderId: order.id, customerId: order.customerId, items: order.items, total: order.total },
          secret: process.env.WEBHOOK_SECRET,
        });
        console.log(`[FulfillmentEngine] Order dispatched via fulfillment webhook for order ${order.id}`);
        return { success: true };
      } catch (webhookError) {
        console.error(`[FulfillmentEngine] Fulfillment webhook also failed:`, webhookError);
      }
    }

    return { success: false, error: 'All supplier fulfillment channels failed. No supplier API configured or all unavailable.' };
  }

  /**
   * Check for pending orders and process them
   * This can be called by a cron job or webhook
   */
  async processPendingOrders(): Promise<{ processed: number; failed: number }> {
    try {
      const orders = await getCollection('copilot_orders');
      const pendingOrders = orders.filter((o: any) => o.status === 'pending' && o.automationEnabled === true);

      let processed = 0;
      let failed = 0;

      for (const order of pendingOrders) {
        const result = await this.processOrder(order as FulfillmentOrder);
        if (result.success) {
          processed++;
        } else {
          failed++;
        }
      }

      return { processed, failed };
    } catch (error) {
      console.error('[FulfillmentEngine] Failed to process pending orders:', error);
      return { processed: 0, failed: 0 };
    }
  }
}

export const fulfillmentEngine = new FulfillmentEngine();
export default fulfillmentEngine;