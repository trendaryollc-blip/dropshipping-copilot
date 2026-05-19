import { NextRequest, NextResponse } from 'next/server'
import { updateSingleProductPriceFromTrendaryo } from '@/lib/services/product-price-updater'

/**
 * POST /api/trendaryo/single
 *
 * Body: { productId: string, trendaryoUrl: string }
 *
 * Scrapes the price from a single Trendaryo product page and writes it
 * back to the specified product document in Firestore.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productId, trendaryoUrl } = body

    if (!productId || !trendaryoUrl) {
      return NextResponse.json(
        { error: 'productId and trendaryoUrl are required' },
        { status: 400 }
      )
    }

    const result = await updateSingleProductPriceFromTrendaryo(productId, trendaryoUrl)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Single price sync failed:', error)
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    )
  }
}
