import {
  getCollection,
  getDocument,
  addDocument,
  updateDocument,
  deleteDocument,
  listenToCollection
} from '../firestore-service'
import type { User } from '@/types'

const COLLECTION_NAME = 'dropease_users'

// ============================================================================
// USER OPERATIONS
// ============================================================================

export async function getUsers(): Promise<User[]> {
  const users = await getCollection(COLLECTION_NAME)
  return users as User[]
}

export async function getUserById(id: string): Promise<User | null> {
  const user = await getDocument(`${COLLECTION_NAME}/${id}`)
  return user as User | null
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const users = await getCollection(COLLECTION_NAME)
  return (users as User[]).find(u => u.email === email) || null
}

export async function getProUsers(): Promise<User[]> {
  const users = await getCollection(COLLECTION_NAME)
  return (users as User[]).filter(u => u.plan === 'pro')
}

export async function getFreeUsers(): Promise<User[]> {
  const users = await getCollection(COLLECTION_NAME)
  return (users as User[]).filter(u => u.plan === 'free')
}

export async function getOnboardedUsers(): Promise<User[]> {
  const users = await getCollection(COLLECTION_NAME)
  return (users as User[]).filter(u => u.isOnboarded)
}

export async function createUser(user: Omit<User, 'id'>): Promise<string> {
  return await addDocument(COLLECTION_NAME, user)
}

export async function updateUser(id: string, updates: Partial<User>): Promise<void> {
  await updateDocument(`${COLLECTION_NAME}/${id}`, updates)
}

export async function updateUserPlan(id: string, plan: User['plan']): Promise<void> {
  await updateDocument(`${COLLECTION_NAME}/${id}`, { plan })
}

export async function markUserAsOnboarded(id: string): Promise<void> {
  await updateDocument(`${COLLECTION_NAME}/${id}`, { isOnboarded: true })
}

export async function deleteUser(id: string): Promise<void> {
  await deleteDocument(`${COLLECTION_NAME}/${id}`)
}

// ============================================================================
// REAL-TIME LISTENERS
// ============================================================================

export function listenToUsers(
  callback: (users: User[]) => void,
  errorCallback?: (error: Error) => void
) {
  return listenToCollection(
    COLLECTION_NAME,
    (data) => callback(data as User[]),
    errorCallback
  )
}

export function listenToUser(
  id: string,
  callback: (user: User | null) => void,
  errorCallback?: (error: Error) => void
) {
  return listenToCollection(
    COLLECTION_NAME,
    (data) => {
      const user = data.find((u: { id: string }) => u.id === id)
      callback(user as User | null)
    },
    errorCallback
  )
}
