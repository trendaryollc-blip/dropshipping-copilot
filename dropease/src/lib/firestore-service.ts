import { getFirestoreClient, isFirestoreConfigured } from './firebase-client'
import type { DocumentData, Query, QueryConstraint } from 'firebase/firestore'
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  Unsubscribe,
  serverTimestamp,
  Timestamp,
  writeBatch
} from 'firebase/firestore'
import { products, suppliers, orders, dashboardStats } from './mock-data'
import type { User } from '@/types'

// ============================================================================
// ERROR HANDLING
// ============================================================================

class FirestoreError extends Error {
  constructor(message: string, public code?: string) {
    super(message)
    this.name = 'FirestoreError'
  }
}

function handleFirestoreError(error: unknown, operation: string): never {
  if (error instanceof Error) {
    throw new FirestoreError(`Firestore ${operation} failed: ${error.message}`, (error as any).code)
  }
  throw new FirestoreError(`Firestore ${operation} failed with unknown error`)
}

// ============================================================================
// MOCK FALLBACK DATA
// ============================================================================

const mockUsers: User[] = [
  {
    id: "1",
    name: "Demo User",
    email: "demo@dropease.com",
    plan: "pro",
    createdAt: "2024-01-01",
    isOnboarded: true
  }
]

const mockCollections: Record<string, any[]> = {
  'dropease_products': products,
  'dropease_suppliers': suppliers,
  'dropease_orders': orders,
  'dropease_users': mockUsers,
}

// ============================================================================
// DOCUMENT OPERATIONS
// ============================================================================

export async function getDocument(path: string): Promise<DocumentData | null> {
  if (!isFirestoreConfigured()) {
    // Mock fallback
    const [collectionName, docId] = path.split('/')
    if (collectionName && docId && mockCollections[collectionName]) {
      return mockCollections[collectionName].find((item: any) => item.id === docId) || null
    }
    return { mock: true, path }
  }
  try {
    const db = getFirestoreClient()!
    const dref = doc(db, path)
    const snap = await getDoc(dref)
    return snap.exists() ? snap.data() : null
  } catch (error) {
    handleFirestoreError(error, 'getDocument')
  }
}

export async function setDocument(path: string, data: any, merge: boolean = true): Promise<void> {
  if (!isFirestoreConfigured()) {
    console.warn('Firestore not configured; setDocument no-op for', path)
    return
  }
  try {
    const db = getFirestoreClient()!
    const dref = doc(db, path)
    await setDoc(dref, { ...data, updatedAt: serverTimestamp() }, { merge })
  } catch (error) {
    handleFirestoreError(error, 'setDocument')
  }
}

export async function addDocument(collectionName: string, data: any): Promise<string> {
  if (!isFirestoreConfigured()) {
    console.warn('Firestore not configured; addDocument no-op for', collectionName)
    return `mock-${Date.now()}`
  }
  try {
    const db = getFirestoreClient()!
    const colRef = collection(db, collectionName)
    const docRef = await addDoc(colRef, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
    return docRef.id
  } catch (error) {
    handleFirestoreError(error, 'addDocument')
  }
}

export async function updateDocument(path: string, data: any): Promise<void> {
  if (!isFirestoreConfigured()) {
    console.warn('Firestore not configured; updateDocument no-op for', path)
    return
  }
  try {
    const db = getFirestoreClient()!
    const dref = doc(db, path)
    await updateDoc(dref, { ...data, updatedAt: serverTimestamp() })
  } catch (error) {
    handleFirestoreError(error, 'updateDocument')
  }
}

export async function deleteDocument(path: string): Promise<void> {
  if (!isFirestoreConfigured()) {
    console.warn('Firestore not configured; deleteDocument no-op for', path)
    return
  }
  try {
    const db = getFirestoreClient()!
    const dref = doc(db, path)
    await deleteDoc(dref)
  } catch (error) {
    handleFirestoreError(error, 'deleteDocument')
  }
}

// ============================================================================
// COLLECTION OPERATIONS
// ============================================================================

export async function getCollection(collectionName: string): Promise<DocumentData[]> {
  if (!isFirestoreConfigured()) {
    // Mock fallback
    return mockCollections[collectionName] || []
  }
  try {
    const db = getFirestoreClient()!
    const colRef = collection(db, collectionName)
    const snap = await getDocs(colRef)
    return snap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    handleFirestoreError(error, 'getCollection')
  }
}

export async function queryCollection(
  collectionName: string,
  constraints: QueryConstraint[]
): Promise<DocumentData[]> {
  if (!isFirestoreConfigured()) {
    // Mock fallback with basic filtering
    let results = mockCollections[collectionName] || []
    constraints.forEach(constraint => {
      if (constraint.type === 'where') {
        const whereConstraint = constraint as any
        results = results.filter((item: any) => item[whereConstraint.field] === whereConstraint.value)
      }
    })
    return results
  }
  try {
    const db = getFirestoreClient()!
    const colRef = collection(db, collectionName)
    const q = query(colRef, ...constraints)
    const snap = await getDocs(q)
    return snap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    handleFirestoreError(error, 'queryCollection')
  }
}

export async function getCollectionWhere(
  collectionName: string,
  field: string,
  operator: any,
  value: any
): Promise<DocumentData[]> {
  return queryCollection(collectionName, [where(field, operator, value)])
}

// ============================================================================
// REAL-TIME LISTENERS
// ============================================================================

export function listenToDocument(
  path: string,
  callback: (data: DocumentData | null) => void,
  errorCallback?: (error: Error) => void
): Unsubscribe {
  if (!isFirestoreConfigured()) {
    // Mock fallback - call callback once with mock data
    const [collectionName, docId] = path.split('/')
    if (collectionName && docId && mockCollections[collectionName]) {
      const mockData = mockCollections[collectionName].find((item: any) => item.id === docId) || null
      callback(mockData)
    }
    return () => {}
  }
  try {
    const db = getFirestoreClient()!
    const dref = doc(db, path)
    return onSnapshot(
      dref,
      (snap: any) => callback(snap.exists() ? { id: snap.id, ...snap.data() } : null),
      (error: any) => errorCallback?.(error)
    )
  } catch (error) {
    errorCallback?.(error as Error)
    return () => {}
  }
}

export function listenToCollection(
  collectionName: string,
  callback: (data: DocumentData[]) => void,
  errorCallback?: (error: Error) => void,
  constraints: QueryConstraint[] = []
): Unsubscribe {
  if (!isFirestoreConfigured()) {
    // Mock fallback - call callback once with mock data
    callback(mockCollections[collectionName] || [])
    return () => {}
  }
  try {
    const db = getFirestoreClient()!
    const colRef = collection(db, collectionName)
    const q = constraints.length > 0 ? query(colRef, ...constraints) : colRef
    return onSnapshot(
      q,
      (snap: any) => callback(snap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }))),
      (error: any) => errorCallback?.(error)
    )
  } catch (error) {
    errorCallback?.(error as Error)
    return () => {}
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export function convertTimestampToDate(timestamp: Timestamp | undefined): Date | undefined {
  if (!timestamp) return undefined
  return timestamp.toDate()
}

export function convertDateToTimestamp(date: Date): Timestamp {
  return Timestamp.fromDate(date)
}

export function isFirestoreReady(): boolean {
  return isFirestoreConfigured()
}

// ============================================================================
// BATCH OPERATIONS
// ============================================================================

export async function batchWrite(operations: {
  type: 'set' | 'update' | 'delete'
  path: string
  data?: any
}[]): Promise<void> {
  if (!isFirestoreConfigured()) {
    console.warn('Firestore not configured; batchWrite no-op')
    return
  }
  try {
    const db = getFirestoreClient()!
    const batch = writeBatch(db)
    
    operations.forEach(op => {
      const dref = doc(db, op.path)
      switch (op.type) {
        case 'set':
          batch.set(dref, { ...op.data, updatedAt: serverTimestamp() }, { merge: true })
          break
        case 'update':
          batch.update(dref, { ...op.data, updatedAt: serverTimestamp() })
          break
        case 'delete':
          batch.delete(dref)
          break
      }
    })
    
    await batch.commit()
  } catch (error) {
    handleFirestoreError(error, 'batchWrite')
  }
}
