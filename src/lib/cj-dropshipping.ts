/**
 * CJ Dropshipping API integration
 * Product sourcing, inventory, order fulfillment
 * API Key: CJ5479348@api
 */

export interface CJProduct {
  id: string
  name: string
  image: string
  price: number
  shippingPrice: number
  category: string
  supplierName: string
  shippingTime: string
  inStock: boolean
}

const CJ_API_BASE = 'https://api.cjdropshipping.com'
const CJ_API_KEY = process.env.CJ_API_KEY || 'CJ5479348@api'

async function callCJ(endpoint: string, body: Record<string, unknown> = {}): Promise<any> {
  const res = await fetch(`${CJ_API_BASE}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'CJ-Access-Token': CJ_API_KEY,
    },
    body: JSON.stringify({ ...body }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`CJ API error (${res.status}): ${err}`)
  }

  const data = await res.json()
  if (data.code !== '200' && data.code !== 200) {
    throw new Error(`CJ API error: ${data.message || data.msg || 'Unknown error'}`)
  }
  return data.data || data.result || data
}

/**
 * Search products from CJ Dropshipping catalog
 */
export async function searchProducts(query: string, page = 1, limit = 20): Promise<CJProduct[]> {
  const data = await callCJ('/api/product/list', {
    productName: query,
    page,
    pageSize: limit,
  })
  
  if (Array.isArray(data)) {
    return data.map((p: any) => ({
      id: p.id || p.productId,
      name: p.productName || p.name,
      image: p.productImage || p.image || '',
      price: parseFloat(p.price || p.sellPrice || 0),
      shippingPrice: parseFloat(p.shippingPrice || 0),
      category: p.category || p.categoryName || '',
      supplierName: p.supplierName || '',
      shippingTime: p.shippingTime || '7-15 days',
      inStock: p.stock !== undefined ? p.stock > 0 : true,
    }))
  }
  return []
}

/**
 * Get product details including variants
 */
export async function getProductDetails(productId: string): Promise<any> {
  return callCJ('/api/product/detail', { productId })
}

/**
 * Create a fulfillment order on CJ
 */
export async function createFulfillmentOrder(order: {
  orderId: string
  products: Array<{ productId: string; quantity: number; variantId?: string }>
  shippingAddress: {
    name: string
    phone: string
    country: string
    state: string
    city: string
    address: string
    zip: string
  }
}): Promise<{ success: boolean; trackingNumber?: string; message: string }> {
  const data = await callCJ('/api/order/create', {
    orderNumber: order.orderId,
    productList: order.products.map(p => ({
      productId: p.productId,
      quantity: p.quantity,
      vid: p.variantId || '',
    })),
    shipping: {
      name: order.shippingAddress.name,
      phone: order.shippingAddress.phone,
      country: order.shippingAddress.country,
      province: order.shippingAddress.state,
      city: order.shippingAddress.city,
      address: order.shippingAddress.address,
      zip: order.shippingAddress.zip,
    },
  })

  return {
    success: true,
    trackingNumber: data.trackingNumber || data.tracking_number,
    message: 'Order created on CJ Dropshipping',
  }
}

/**
 * Get shipping rates for a product to a country
 */
export async function getShippingRates(productId: string, country: string): Promise<any[]> {
  const data = await callCJ('/api/product/shipping', { productId, country })
  return Array.isArray(data) ? data : []
}