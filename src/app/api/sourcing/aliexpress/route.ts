import { NextRequest, NextResponse } from 'next/server'
import { searchProducts, getProductReviews } from '@/lib/aliexpress'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')
    const productId = searchParams.get('productId')

    if (productId) {
      const reviews = await getProductReviews(productId)
      return NextResponse.json(reviews)
    }

    if (!query) {
      return NextResponse.json({ products: [], error: 'Query parameter "q" is required' }, { status: 400 })
    }

    const products = await searchProducts(query)
    return NextResponse.json({ products })
  } catch (error) {
    console.error('AliExpress API error:', error)
    return NextResponse.json(
      { error: 'Failed to search AliExpress', message: (error as Error).message },
      { status: 500 }
    )
  }
}