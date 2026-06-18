import { NextRequest, NextResponse } from 'next/server'
import {
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByStatus,
  getProductsBySupplier,
  getProductsByNiche
} from '@/lib/services/products-service'
import { searchProducts, getTrendingProducts } from '@/lib/services/product-search-service'
import type { Product } from '@/types'

// GET /api/products - Get all products or filtered products
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const supplier = searchParams.get('supplier')
    const niche = searchParams.get('niche')
    const id = searchParams.get('id')

    if (id) {
      const product = await getProductById(id)
      if (!product) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 })
      }
      return NextResponse.json(product)
    }

    if (status) {
      const products = await getProductsByStatus(status as Product['status'])
      return NextResponse.json(products)
    }

    if (supplier) {
      const products = await getProductsBySupplier(supplier)
      return NextResponse.json(products)
    }

    if (niche) {
      const products = await getProductsByNiche(niche)
      return NextResponse.json(products)
    }

    const query = searchParams.get('q') || searchParams.get('search') || ''
    const nicheSearch = searchParams.get('niche') || undefined

    // If there's a search query, use AI-powered real product search
    if (query) {
      const results = await searchProducts(query, nicheSearch)
      return NextResponse.json(results)
    }

    // Check if we should return trending products
    const trending = searchParams.get('trending')
    if (trending === 'true') {
      const trendingProducts = await getTrendingProducts(20)
      return NextResponse.json(trendingProducts)
    }

    // If no query, Firestore will return mock data or real data depending on config
    // Return empty - the store will handle loading from Firestore
    const allProducts = await getProductsByStatus('active')
    return NextResponse.json(allProducts)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products', message: (error as Error).message },
      { status: 500 }
    )
  }
}

// POST /api/products - Create a new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...productData } = body as Product

    // Validate required fields
    if (!productData.name || !productData.niche || !productData.priceRange) {
      return NextResponse.json(
        { error: 'Missing required fields: name, niche, priceRange' },
        { status: 400 }
      )
    }

    const productId = await createProduct(productData)
    return NextResponse.json({ id: productId, ...productData }, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product', message: (error as Error).message },
      { status: 500 }
    )
  }
}

// PUT /api/products - Update a product
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updates } = body as Partial<Product> & { id: string }

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }

    await updateProduct(id, updates)
    return NextResponse.json({ id, ...updates })
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { error: 'Failed to update product', message: (error as Error).message },
      { status: 500 }
    )
  }
}

// DELETE /api/products - Delete a product
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }

    await deleteProduct(id)
    return NextResponse.json({ message: 'Product deleted successfully' })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { error: 'Failed to delete product', message: (error as Error).message },
      { status: 500 }
    )
  }
}
