import { NextRequest, NextResponse } from 'next/server'
import { updateProductPricesFromTrendaryo } from '@/lib/services/product-price-updater'

/**
 * POST /api/trendaryo/sync-prices
 *
 * Triggers a bulk price sync:
 *  1. Reads all products from Firestore that have a `trendaryoUrl` and status === "active"
 *  2. Scrapes the live price from each Trendaryo product page
 *  3. Writes `price`, `currency`, and `priceLastUpdated` back to Firestore
 */
export async function POST() {
  try {
    const result = await updateProductPricesFromTrendaryo()
    return NextResponse.json(result)
  } catch (error) {
    console.error('Price sync failed:', error)
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    )
  }
}
