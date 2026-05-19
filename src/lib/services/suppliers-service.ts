import {
  getCollection,
  getDocument,
  addDocument,
  updateDocument,
  deleteDocument,
  listenToCollection
} from '../firestore-service'
import type { Supplier } from '@/types'

const COLLECTION_NAME = 'dropease_suppliers'

// ============================================================================
// SUPPLIER OPERATIONS
// ============================================================================

export async function getSuppliers(): Promise<Supplier[]> {
  const suppliers = await getCollection(COLLECTION_NAME)
  return suppliers as Supplier[]
}

export async function getSupplierById(id: string): Promise<Supplier | null> {
  const supplier = await getDocument(`${COLLECTION_NAME}/${id}`)
  return supplier as Supplier | null
}

export async function getVerifiedSuppliers(): Promise<Supplier[]> {
  const suppliers = await getCollection(COLLECTION_NAME)
  return (suppliers as Supplier[]).filter(s => s.verified)
}

export async function getSuppliersByCategory(category: string): Promise<Supplier[]> {
  const suppliers = await getCollection(COLLECTION_NAME)
  return (suppliers as Supplier[]).filter(s => s.categories.includes(category))
}

export async function getSuppliersByCountry(country: string): Promise<Supplier[]> {
  const suppliers = await getCollection(COLLECTION_NAME)
  return (suppliers as Supplier[]).filter(s => s.country === country)
}

export async function createSupplier(supplier: Omit<Supplier, 'id'>): Promise<string> {
  return await addDocument(COLLECTION_NAME, supplier)
}

export async function updateSupplier(id: string, updates: Partial<Supplier>): Promise<void> {
  await updateDocument(`${COLLECTION_NAME}/${id}`, updates)
}

export async function deleteSupplier(id: string): Promise<void> {
  await deleteDocument(`${COLLECTION_NAME}/${id}`)
}

// ============================================================================
// REAL-TIME LISTENERS
// ============================================================================

export function listenToSuppliers(
  callback: (suppliers: Supplier[]) => void,
  errorCallback?: (error: Error) => void
) {
  return listenToCollection(
    COLLECTION_NAME,
    (data) => callback(data as Supplier[]),
    errorCallback
  )
}

export function listenToSupplier(
  id: string,
  callback: (supplier: Supplier | null) => void,
  errorCallback?: (error: Error) => void
) {
  return listenToCollection(
    COLLECTION_NAME,
    (data) => {
      const supplier = data.find((s: any) => s.id === id)
      callback(supplier as Supplier | null)
    },
    errorCallback
  )
}
