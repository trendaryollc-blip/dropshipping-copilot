import { getFirestoreClient, isFirestoreConfigured } from './firebase-client'
import type { DocumentData } from 'firebase/firestore'
import { collection, doc, getDoc, setDoc } from 'firebase/firestore'

// Simple wrapper exposing minimal read/write with mock fallback
export async function getDocument(path: string): Promise<DocumentData | null> {
  if (!isFirestoreConfigured()) {
    // mock data return
    return { mock: true, path }
  }
  const db = getFirestoreClient()!
  const dref = doc(db, path)
  const snap = await getDoc(dref)
  return snap.exists() ? snap.data() : null
}

export async function setDocument(path: string, data: any): Promise<void> {
  if (!isFirestoreConfigured()) {
    // no-op in mock mode
    console.warn('Firestore not configured; setDocument no-op for', path)
    return
  }
  const db = getFirestoreClient()!
  const dref = doc(db, path)
  await setDoc(dref, data)
}
