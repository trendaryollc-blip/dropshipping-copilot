import {
  getCollection,
  getDocument,
  addDocument,
  updateDocument,
  deleteDocument,
  listenToCollection
} from '../firestore-service'
import type { Product } from '@/types'

const COLLECTION_NAME = 'dropease_products'

// ============================================================================
// PRODUCT OPERATIONS
// ============================================================================

export async function getProducts(): Promise<Product[]> {
  const products = await getCollection(COLLECTION_NAME)
  return products as Product[]
}

export async function getProductById(id: string): Promise<Product | null> {
  const product = await getDocument(`${COLLECTION_NAME}/${id}`)
  return product as Product | null
}

export async function getProductsByStatus(status: Product['status']): Promise<Product[]> {
  const products = await getCollection(COLLECTION_NAME)
  return (products as Product[]).filter(p => p.status === status)
}

export async function getProductsBySupplier(supplierName: string): Promise<Product[]> {
  const products = await getCollection(COLLECTION_NAME)
  return (products as Product[]).filter(p => p.supplierName === supplierName)
}

export async function getProductsByNiche(niche: string): Promise<Product[]> {
  const products = await getCollection(COLLECTION_NAME)
  return (products as Product[]).filter(p => p.niche === niche)
}

export async function createProduct(product: Omit<Product, 'id'>): Promise<string> {
  return await addDocument(COLLECTION_NAME, product)
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<void> {
  await updateDocument(`${COLLECTION_NAME}/${id}`, updates)
}

export async function deleteProduct(id: string): Promise<void> {
  await deleteDocument(`${COLLECTION_NAME}/${id}`)
}

// ============================================================================
// REAL-TIME LISTENERS
// ============================================================================

export function listenToProducts(
  callback: (products: Product[]) => void,
  errorCallback?: (error: Error) => void
) {
  return listenToCollection(
    COLLECTION_NAME,
    (data) => callback(data as Product[]),
    errorCallback
  )
}

export function listenToProduct(
  id: string,
  callback: (product: Product | null) => void,
  errorCallback?: (error: Error) => void
) {
  return listenToCollection(
    COLLECTION_NAME,
    (data) => {
      const product = data.find((p: any) => p.id === id)
      callback(product as Product | null)
    },
    errorCallback
  )
}
