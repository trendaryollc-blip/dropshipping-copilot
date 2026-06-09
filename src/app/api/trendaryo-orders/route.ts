import { NextRequest, NextResponse } from 'next/server'
import { addDocument } from '@/lib/firestore-service'

/**
 * POST /api/trendaryo-orders
 *
 * Webhook receiver for Trendaryo → Copilot order push.
 * Trendaryo sends new orders here when a customer places an order on the Trendaryo store.
 *
 * Security: Validates X-API-Key header against process.env.TRENDARYO_API_KEY
 *
 * Incoming payload format:
 * {
 *   source: 'trendaryo',
 *   event: 'new_order',
 *   order: {
 *     id: string,
 *     orderNumber: string,
 *     status: 'pending',
 *     items: [{ productId, name, quantity, price, supplierId, supplierUrl }],
 *     total: number,
 *     currency: 'USD',
 *     shippingAddress: { fullName, email, phone, street, city, state, zipCode },
 *     customer: { email, name, phone }
 *   }
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // ── Validate API Key ──────────────────────────────────────────
    const apiKey = request.headers.get('X-API-Key') || request.headers.get('x-api-key')

    if (!apiKey || apiKey !== process.env.TRENDARYO_API_KEY) {
      console.warn('[trendaryo-orders] Unauthorized webhook attempt')
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Invalid or missing X-API-Key' },
        { status: 401 }
      )
    }

    // ── Parse body ────────────────────────────────────────────────
    const body = await request.json()
    const { source, event, order } = body

    if (!order || !order.id || !order.orderNumber) {
      return NextResponse.json(
        { success: false, error: 'Invalid order data: id and orderNumber are required' },
        { status: 400 }
      )
    }

    console.log(`[trendaryo-orders] Received ${event} from ${source}: Order #${order.orderNumber}`)

    // ── Store order in Firestore ───────────────────────────────────
    // Save under copilot_orders collection with Trendaryo source metadata
    const orderDoc = {
      source: source || 'trendaryo',
      event: event || 'new_order',
      trendaryoOrderId: order.id,
      orderNumber: order.orderNumber,
      status: order.status || 'pending',
      items: order.items || [],
      total: order.total || 0,
      currency: order.currency || 'USD',
      shippingAddress: order.shippingAddress || {},
      customer: order.customer || {},
      fulfillmentStatus: 'pending', // Copilot-side status for automation
      trackingNumber: null,
      trackingCarrier: null,
      notes: '',
      receivedAt: new Date().toISOString(),
    }

    await addDocument('copilot_orders', orderDoc)

    return NextResponse.json({
      success: true,
      message: `Order #${order.orderNumber} received and queued for fulfillment`,
      orderId: order.id,
    })
  } catch (error) {
    console.error('[trendaryo-orders] Webhook processing failed:', error)
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    )
  }
}

/**
 * GET /api/trendaryo-orders
 * Health check / verification endpoint for the webhook
 */
export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Trendaryo webhook endpoint is active',
    usage: 'POST with X-API-Key header and order payload',
  })
}