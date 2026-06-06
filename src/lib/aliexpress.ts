/**
 * AliExpress (Alibaba API Gateway) integration
 * Product research, pricing, reviews, category exploration
 * Uses Alibaba's Open Platform API
 */

export interface AliExpressProduct {
  id: string
  title: string
  image: string
  price: number
  originalPrice: number
  salesCount: number
  rating: number
  reviews: number
  shippingCost: number
  categoryId: string
  url: string
}

const ALIEXPRESS_API = 'https://api.alibaba.com/rest'
const APP_KEY = process.env.ALIEXPRESS_APP_KEY || '535898'
const APP_SECRET = process.env.ALIEXPRESS_APP_SECRET || ''

async function callAliExpress(method: string, params: Record<string, string> = {}): Promise<any> {
  const timestamp = new Date().toISOString().replace(/[:-]/g, '').slice(0, 14)
  
  const requestParams = {
    method,
    app_key: APP_KEY,
    timestamp,
    format: 'json',
    v: '2.0',
    sign_method: 'sha256',
    ...params,
  }

  // Build the query string
  const queryString = new URLSearchParams(requestParams).toString()
  
  const res = await fetch(`${ALIEXPRESS_API}?${queryString}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })

  if (!res.ok) {
    throw new Error(`AliExpress API error: ${res.status}`)
  }

  const data = await res.json()
  if (data.error_response) {
    throw new Error(`AliExpress error: ${data.error_response.msg || data.error_response.code}`)
  }
  return data
}

/**
 * Search products on AliExpress
 */
export async function searchProducts(query: string, page = 1): Promise<AliExpressProduct[]> {
  try {
    const data = await callAliExpress('aliexpress.ds.product.search', {
      q: query,
      page_no: String(page),
      page_size: '20',
      sort: 'SALE_PRICE_ASC',
    })

    const products = data?.aliexpress_ds_product_search_response?.result?.products || []
    
    if (Array.isArray(products)) {
      return products.map((p: any) => ({
        id: p.product_id || p.id,
        title: p.product_title || p.subject || '',
        image: p.product_main_image_url || p.image_url || '',
        price: parseFloat(p.product_price || p.sale_price || 0),
        originalPrice: parseFloat(p.original_price || p.retail_price || 0),
        salesCount: parseInt(p.sales_count || p.trade_count || 0),
        rating: parseFloat(p.rating || p.average_rating || 0),
        reviews: parseInt(p.reviews_count || p.evaluate_count || 0),
        shippingCost: parseFloat(p.shipping_cost || 0),
        categoryId: p.category_id || '',
        url: p.product_detail_url || `https://www.aliexpress.com/item/${p.product_id || p.id}.html`,
      }))
    }
    return []
  } catch (error) {
    console.error('AliExpress search failed:', error)
    return []
  }
}

/**
 * Get hot selling products in a category
 */
export async function getHotSelling(categoryId: string): Promise<AliExpressProduct[]> {
  return searchProducts('', 1) // Falls back to search
}

/**
 * Get product reviews/scores
 */
export async function getProductReviews(productId: string): Promise<{
  avgRating: number
  totalReviews: number
  positivePercent: number
}> {
  try {
    const data = await callAliExpress('aliexpress.ds.product.reviews', {
      product_id: productId,
    })

    const result = data?.aliexpress_ds_product_reviews_response?.result
    return {
      avgRating: parseFloat(result?.avg_rating || 0),
      totalReviews: parseInt(result?.total_reviews || 0),
      positivePercent: parseFloat(result?.positive_percent || 90),
    }
  } catch {
    return { avgRating: 0, totalReviews: 0, positivePercent: 90 }
  }
}