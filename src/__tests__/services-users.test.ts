import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('@/lib/firestore-service', () => ({
  getCollection: vi.fn(),
  getDocument: vi.fn(),
  addDocument: vi.fn(),
  updateDocument: vi.fn(),
  deleteDocument: vi.fn(),
  listenToCollection: vi.fn(() => () => {}),
}))

import {
  getUsers,
  getUserById,
  getUserByEmail,
  getProUsers,
  getFreeUsers,
  getOnboardedUsers,
  createUser,
  updateUser,
  updateUserPlan,
  markUserAsOnboarded,
  deleteUser,
  listenToUsers,
  listenToUser,
} from '@/lib/services/users-service'
import type { User } from '@/types'

const mockUser: User = {
  id: 'u1',
  name: 'John Doe',
  email: 'john@example.com',
  plan: 'free',
  createdAt: '2024-01-01',
  isOnboarded: false,
}

describe('Users Service', () => {
  beforeEach(() => vi.clearAllMocks())

  describe('getUsers', () => {
    it('returns all users', async () => {
      const { getCollection } = await import('@/lib/firestore-service')
      vi.mocked(getCollection).mockResolvedValue([mockUser])
      const result = await getUsers()
      expect(result).toHaveLength(1)
      expect(getCollection).toHaveBeenCalledWith('copilot_users')
    })
  })

  describe('getUserById', () => {
    it('returns user when found', async () => {
      const { getDocument } = await import('@/lib/firestore-service')
      vi.mocked(getDocument).mockResolvedValue(mockUser)
      const result = await getUserById('u1')
      expect(result).toEqual(mockUser)
    })

    it('returns null when not found', async () => {
      const { getDocument } = await import('@/lib/firestore-service')
      vi.mocked(getDocument).mockResolvedValue(null)
      expect(await getUserById('nonexistent')).toBeNull()
    })
  })

  describe('getUserByEmail', () => {
    it('finds user by email', async () => {
      const { getCollection } = await import('@/lib/firestore-service')
      vi.mocked(getCollection).mockResolvedValue([
        { ...mockUser, id: '1', email: 'john@example.com' },
        { ...mockUser, id: '2', email: 'jane@example.com' },
      ])
      const result = await getUserByEmail('john@example.com')
      expect(result).not.toBeNull()
      expect(result!.email).toBe('john@example.com')
    })

    it('returns null when email not found', async () => {
      const { getCollection } = await import('@/lib/firestore-service')
      vi.mocked(getCollection).mockResolvedValue([])
      expect(await getUserByEmail('unknown@example.com')).toBeNull()
    })
  })

  describe('getProUsers', () => {
    it('filters pro plan users', async () => {
      const { getCollection } = await import('@/lib/firestore-service')
      vi.mocked(getCollection).mockResolvedValue([
        { ...mockUser, id: '1', plan: 'free' },
        { ...mockUser, id: '2', plan: 'pro' },
        { ...mockUser, id: '3', plan: 'pro' },
      ])
      const result = await getProUsers()
      expect(result).toHaveLength(2)
      expect(result.every(u => u.plan === 'pro')).toBe(true)
    })
  })

  describe('getFreeUsers', () => {
    it('filters free plan users', async () => {
      const { getCollection } = await import('@/lib/firestore-service')
      vi.mocked(getCollection).mockResolvedValue([
        { ...mockUser, id: '1', plan: 'free' },
        { ...mockUser, id: '2', plan: 'pro' },
      ])
      const result = await getFreeUsers()
      expect(result).toHaveLength(1)
      expect(result[0].plan).toBe('free')
    })
  })

  describe('getOnboardedUsers', () => {
    it('filters onboarded users', async () => {
      const { getCollection } = await import('@/lib/firestore-service')
      vi.mocked(getCollection).mockResolvedValue([
        { ...mockUser, id: '1', isOnboarded: true },
        { ...mockUser, id: '2', isOnboarded: false },
      ])
      const result = await getOnboardedUsers()
      expect(result).toHaveLength(1)
      expect(result[0].isOnboarded).toBe(true)
    })
  })

  describe('CRUD operations', () => {
    it('creates a user', async () => {
      const { addDocument } = await import('@/lib/firestore-service')
      vi.mocked(addDocument).mockResolvedValue('u-new')
      const { id, ...data } = mockUser
      expect(await createUser(data)).toBe('u-new')
    })

    it('updates a user', async () => {
      const { updateDocument } = await import('@/lib/firestore-service')
      await updateUser('u1', { name: 'Updated' })
      expect(updateDocument).toHaveBeenCalledWith('copilot_users/u1', { name: 'Updated' })
    })

    it('updates user plan', async () => {
      const { updateDocument } = await import('@/lib/firestore-service')
      await updateUserPlan('u1', 'pro')
      expect(updateDocument).toHaveBeenCalledWith('copilot_users/u1', { plan: 'pro' })
    })

    it('marks user as onboarded', async () => {
      const { updateDocument } = await import('@/lib/firestore-service')
      await markUserAsOnboarded('u1')
      expect(updateDocument).toHaveBeenCalledWith('copilot_users/u1', { isOnboarded: true })
    })

    it('deletes a user', async () => {
      const { deleteDocument } = await import('@/lib/firestore-service')
      await deleteUser('u1')
      expect(deleteDocument).toHaveBeenCalledWith('copilot_users/u1')
    })
  })

  describe('listeners', () => {
    it('subscribes to users collection', () => {
      const { listenToCollection } = vi.mocked(require('@/lib/firestore-service'))
      vi.mocked(listenToCollection).mockReturnValue(() => {})
      expect(typeof listenToUsers(vi.fn())).toBe('function')
      expect(listenToCollection).toHaveBeenCalledWith('copilot_users', expect.any(Function), undefined)
    })
  })
})