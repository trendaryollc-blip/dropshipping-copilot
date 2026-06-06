import { getFirestoreClient, isFirestoreConfigured } from './firebase-client'
import type { DocumentData, Query, QueryConstraint, DocumentSnapshot } from 'firebase/firestore'
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
  writeBatch,
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
    const firebaseError = error as { code?: string }
    throw new FirestoreError(`Firestore ${operation} failed: ${error.message}`, firebaseError.code)
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
    isOnboarded: true,
  },
]

const mockCollections: Record<string, unknown[]> = {
  dropease_products: products as unknown[],
  dropease_suppliers: suppliers as unknown[],
  dropease_orders: orders as unknown[],
  dropease_users: mockUsers as unknown[],
}

// ============================================================================
// DOCUMENT OPERATIONS
// ============================================================================

export async function getDocument<D extends DocumentData = DocumentData>(
  path: string,
): Promise<D | null> {
  if (!isFirestoreConfigured()) {
    const [collectionName, docId] = path.split("/")
    if (collectionName && docId && mockCollections[collectionName]) {
      const items = mockCollections[collectionName] as Array<{ id: string }>
      const found = items.find((it: { id: string }) => it.id === docId)
      return (found || null) as D | null
    }
    return { mock: true, path } as unknown as D | null
  }
  try {
    const db = getFirestoreClient()!
    const dref = doc(db, path)
    const snap = await getDoc(dref)
    return (snap.exists() ? snap.data() : null) as D | null
  } catch (error) {
    handleFirestoreError(error, "getDocument")
  }
}

export async function setDocument<D extends DocumentData = DocumentData>(
  path: string,
  data: D,
  merge: boolean = true,
): Promise<void> {
  if (!isFirestoreConfigured()) {
    console.warn(`Firestore not configured; setDocument no-op for ${path}`)
    return
  }
  try {
    const db = getFirestoreClient()!
    const dref = doc(db, path)
    await setDoc(dref, { ...data, updatedAt: serverTimestamp() }, { merge })
  } catch (error) {
    handleFirestoreError(error, "setDocument")
  }
}

export async function addDocument<D extends DocumentData = DocumentData>(
  collectionName: string,
  data: D,
): Promise<string> {
  if (!isFirestoreConfigured()) {
    console.warn(`Firestore not configured; addDocument no-op for ${collectionName}`)
    return `mock-${Date.now()}`
  }
  try {
    const db = getFirestoreClient()!
    const colRef = collection(db, collectionName)
    const docRef = await addDoc(colRef, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    return docRef.id
  } catch (error) {
    handleFirestoreError(error, "addDocument")
  }
}

export async function updateDocument<D extends DocumentData = DocumentData>(
  path: string,
  data: Partial<D>,
): Promise<void> {
  if (!isFirestoreConfigured()) {
    console.warn(`Firestore not configured; updateDocument no-op for ${path}`)
    return
  }
  try {
    const db = getFirestoreClient()!
    const dref = doc(db, path)
    // Try update first, fall back to set with merge if document doesn't exist
    try {
      await updateDoc(dref, { ...data, updatedAt: serverTimestamp() })
    } catch (updateError) {
      const fbError = updateError as { code?: string }
      // If document doesn't exist, create it with merge
      if (fbError.code === 'not-found') {
        await setDoc(dref, { ...data, updatedAt: serverTimestamp() }, { merge: true })
      } else {
        throw updateError
      }
    }
  } catch (error) {
    handleFirestoreError(error, "updateDocument")
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

export async function getCollection<D extends DocumentData = DocumentData>(
  collectionName: string,
): Promise<D[]> {
  if (!isFirestoreConfigured()) {
    return (mockCollections[collectionName] as D[] | undefined) || []
  }
  try {
    const db = getFirestoreClient()!
    const colRef = collection(db, collectionName)
    const snap = await getDocs(colRef)
    return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as unknown as D[]
  } catch (error) {
    handleFirestoreError(error, "getCollection")
  }
}

export async function queryCollection<D extends DocumentData = DocumentData>(
  collectionName: string,
  constraints: QueryConstraint[],
): Promise<D[]> {
  if (!isFirestoreConfigured()) {
    let results = (mockCollections[collectionName] as D[] | undefined) || []
    for (const constraint of constraints) {
      if (constraint.type === "where") {
        const wc = constraint as QueryConstraint & { field: string; value: unknown }
        results = results.filter((item) => item[wc.field as keyof D] === wc.value) as D[]
      }
    }
    return results
  }
  try {
    const db = getFirestoreClient()!
    const colRef = collection(db, collectionName)
    const q = query(colRef, ...constraints)
    const snap = await getDocs(q)
    return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as unknown as D[]
  } catch (error) {
    handleFirestoreError(error, "queryCollection")
  }
}

export async function getCollectionWhere<D extends DocumentData = DocumentData>(
  collectionName: string,
  field: string,
  operator: unknown,
  value: unknown,
): Promise<D[]> {
  return queryCollection<D>(collectionName, [where(field, operator as any, value)])
}

// ============================================================================
// REAL-TIME LISTENERS
// ============================================================================

export function listenToDocument<D extends DocumentData = DocumentData>(
  path: string,
  callback: (data: D | null) => void,
  errorCallback?: (error: Error) => void,
): Unsubscribe {
  if (!isFirestoreConfigured()) {
    const [collectionName, docId] = path.split("/")
    if (collectionName && docId && mockCollections[collectionName]) {
      const mockData = (mockCollections[collectionName] as unknown as Array<{ id: string }>).find(
        (item: { id: string }) => item.id === docId,
      ) || null
      callback(mockData as unknown as D)
    }
    return () => {}
  }
  try {
    const db = getFirestoreClient()!
    const dref = doc(db, path)
    return onSnapshot(
      dref,
      (snap) =>
        callback(snap.exists() ? ({ id: snap.id, ...snap.data() } as unknown as D) : null),
      (error) => errorCallback?.(error),
    )
  } catch (error) {
    errorCallback?.(error as Error)
    return () => {}
  }
}

export function listenToCollection<D extends DocumentData = DocumentData>(
  collectionName: string,
  callback: (data: D[]) => void,
  errorCallback?: (error: Error) => void,
  constraints: QueryConstraint[] = [],
): Unsubscribe {
  if (!isFirestoreConfigured()) {
    const mockData = (mockCollections[collectionName] as unknown as D[] | undefined) || []
    callback(mockData)
    return () => {}
  }
  try {
    const db = getFirestoreClient()!
    const colRef = collection(db, collectionName)
    const q = constraints.length > 0 ? query(colRef, ...constraints) : colRef
    return onSnapshot(
      q,
      (snap) =>
        callback(snap.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() } as unknown as D))),
      (error) => errorCallback?.(error),
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

export async function batchWrite<D extends DocumentData = DocumentData>(
  operations: Array<{
    type: 'set' | 'update' | 'delete'
    path: string
    data?: Partial<D>
  }>,
): Promise<void> {
  if (!isFirestoreConfigured()) {
    console.warn('Firestore not configured; batchWrite no-op')
    return
  }
  try {
    const db = getFirestoreClient()!
    const batch = writeBatch(db)

    for (const op of operations) {
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
    }

    await batch.commit()
  } catch (error) {
    handleFirestoreError(error, 'batchWrite')
  }
}

