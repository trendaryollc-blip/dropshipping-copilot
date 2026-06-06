import { NextRequest, NextResponse } from 'next/server'
import { searchProducts, getProductDetails, getShippingRates } from '@/lib/cj-dropshipping'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')
    const productId = searchParams.get('productId')
    const country = searchParams.get('country')
    const page = parseInt(searchParams.get('page') || '1')

    if (productId && country) {
      const rates = await getShippingRates(productId, country)
      return NextResponse.json({ rates })
    }

    if (productId) {
      const details = await getProductDetails(productId)
      return NextResponse.json(details)
    }

    if (!query) {
      return NextResponse.json({ products: [], error: 'Query parameter "q" is required' }, { status: 400 })
    }

    const products = await searchProducts(query, page)
    return NextResponse.json({ products, page })
  } catch (error) {
    console.error('CJ API error:', error)
    return NextResponse.json(
      { error: 'Failed to search CJ Dropshipping', message: (error as Error).message },
      { status: 500 }
    )
  }
}