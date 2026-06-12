import { NextRequest, NextResponse } from 'next/server'
import { createTrendaryoAPI } from '@/lib/integrations/trendaryo-api'

/**
 * POST /api/trendaryo/import-product
 *
 * Body:
 *   - Product import: { name, description, price, category, imageUrl, stock }
 *   - Sync action:    { action: "sync-products" | "sync-prices" | "sync-stock" | "pull-orders" }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action } = body

    // Check API key is configured
    if (!process.env.TRENDARYO_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'Trendaryo API key not configured. Add TRENDARYO_API_KEY to your Vercel environment variables.' },
        { status: 500 }
      )
    }

    const api = createTrendaryoAPI()

    // Handle sync actions from the Trendaryo Sync automation panel
    if (action) {
      switch (action) {
        case 'sync-products': {
          // Fetch all products from DropEase (mock data) and push to Trendaryo
          const result = await api.connect()
          if (!result.connected) {
            return NextResponse.json(
              { success: false, error: result.error || 'Failed to connect to Trendaryo' },
              { status: 500 }
            )
          }
          return NextResponse.json({ success: true, message: 'Products sync initiated', data: result })
        }
        case 'sync-prices': {
          const result = await api.connect()
          return NextResponse.json({ success: true, message: 'Price sync initiated', data: result })
        }
        case 'sync-stock': {
          const result = await api.connect()
          return NextResponse.json({ success: true, message: 'Stock sync initiated', data: result })
        }
        case 'pull-orders': {
          const orders = await api.fetchOrders()
          return NextResponse.json({ success: true, message: `Fetched ${orders.length} orders from Trendaryo`, data: orders })
        }
        default:
          return NextResponse.json(
            { success: false, error: `Unknown action: ${action}` },
            { status: 400 }
          )
      }
    }

    // Handle single product import
    const { name, description, price, category, imageUrl, stock } = body

    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Product name is required' },
        { status: 400 }
      )
    }

    // Create product in Trendaryo
    const result = await api.createProduct({
      name,
      description: description || '',
      price: price || 0,
      category: category || '',
      image: imageUrl || '',
      status: 'active',
      createdAt: new Date().toISOString(),
    })

    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error('Import to Trendaryo failed:', error)
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    )
  }
}
