import {
  getCollection,
  getDocument,
  addDocument,
  updateDocument,
  deleteDocument,
  listenToCollection
} from '../firestore-service'
import type { Order } from '@/types'

const COLLECTION_NAME = 'dropease_orders'

// ============================================================================
// ORDER OPERATIONS
// ============================================================================

export async function getOrders(): Promise<Order[]> {
  const orders = await getCollection(COLLECTION_NAME)
  return orders as Order[]
}

export async function getOrderById(id: string): Promise<Order | null> {
  const order = await getDocument(`${COLLECTION_NAME}/${id}`)
  return order as Order | null
}

export async function getOrdersByStatus(status: Order['status']): Promise<Order[]> {
  const orders = await getCollection(COLLECTION_NAME)
  return (orders as Order[]).filter(o => o.status === status)
}

export async function getOrdersByCustomer(customer: string): Promise<Order[]> {
  const orders = await getCollection(COLLECTION_NAME)
  return (orders as Order[]).filter(o => o.customer === customer)
}

export async function getPendingOrders(): Promise<Order[]> {
  return getOrdersByStatus('pending')
}

export async function getShippedOrders(): Promise<Order[]> {
  return getOrdersByStatus('shipped')
}

export async function getDeliveredOrders(): Promise<Order[]> {
  return getOrdersByStatus('delivered')
}

export async function createOrder(order: Omit<Order, 'id'>): Promise<string> {
  return await addDocument(COLLECTION_NAME, order)
}

export async function updateOrder(id: string, updates: Partial<Order>): Promise<void> {
  await updateDocument(`${COLLECTION_NAME}/${id}`, updates)
}

export async function updateOrderStatus(id: string, status: Order['status']): Promise<void> {
  await updateDocument(`${COLLECTION_NAME}/${id}`, { status })
}

export async function deleteOrder(id: string): Promise<void> {
  await deleteDocument(`${COLLECTION_NAME}/${id}`)
}

// ============================================================================
// REAL-TIME LISTENERS
// ============================================================================

export function listenToOrders(
  callback: (orders: Order[]) => void,
  errorCallback?: (error: Error) => void
) {
  return listenToCollection(
    COLLECTION_NAME,
    (data) => callback(data as Order[]),
    errorCallback
  )
}

export function listenToOrder(
  id: string,
  callback: (order: Order | null) => void,
  errorCallback?: (error: Error) => void
) {
  return listenToCollection(
    COLLECTION_NAME,
    (data) => {
      const order = data.find((o: { id: string }) => o.id === id)
      callback(order as Order | null)
    },
    errorCallback
  )
}

export function listenToPendingOrders(
  callback: (orders: Order[]) => void,
  errorCallback?: (error: Error) => void
) {
  return listenToCollection(
    COLLECTION_NAME,
    (data) => callback((data as Order[]).filter(o => o.status === 'pending')),
    errorCallback
  )
}
