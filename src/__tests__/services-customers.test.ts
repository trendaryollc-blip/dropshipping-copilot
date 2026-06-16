import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockCustomers: any[] = []
const mockActivities: any[] = []
const mockSegments: any[] = []
const mockAutomations: any[] = []
const mockAuditLog: any[] = []
const mockGdprRequests: any[] = []

vi.mock('@/lib/server/data-store', () => ({
  getDataStore: () => ({
    customers: mockCustomers,
    activities: mockActivities,
    segments: mockSegments,
    automations: mockAutomations,
    auditLog: mockAuditLog,
    gdprRequests: mockGdprRequests,
    reviews: [],
    webhooks: [],
  }),
}))

import {
  getCustomers,
  getCustomerById,
  createCustomer,
  getActivities,
  addActivity,
  getSegments,
  getAutomations,
  getAuditLog,
  getGdprRequests,
  addGdprRequest,
} from '@/lib/services/customers-service'
import type { CustomerProfile } from '@/types'

const mockCustomer: CustomerProfile = {
  id: 'cust_1',
  name: 'Sarah Mitchell',
  email: 'sarah@example.com',
  segment: 'Loyal',
  lifetimeValue: 420.5,
  orders: 5,
  lastOrderDate: new Date().toISOString(),
  status: 'active',
  lastContacted: new Date().toISOString(),
  leadScore: 85,
}

describe('Customers Service (server data store)', () => {
  beforeEach(() => {
    mockCustomers.length = 0
    mockActivities.length = 0
    mockSegments.length = 0
    mockAutomations.length = 0
    mockAuditLog.length = 0
    mockGdprRequests.length = 0
  })

  describe('getCustomers', () => {
    it('returns empty array initially', async () => {
      const result = await getCustomers()
      expect(result).toEqual([])
    })

    it('returns customers after adding', async () => {
      mockCustomers.push(mockCustomer)
      const result = await getCustomers()
      expect(result).toHaveLength(1)
      expect(result[0].email).toBe('sarah@example.com')
    })
  })

  describe('getCustomerById', () => {
    it('returns undefined when not found', async () => {
      const result = await getCustomerById('nonexistent')
      expect(result).toBeNull()
    })
  })

  describe('createCustomer', () => {
    it('creates a customer and returns an id', async () => {
      const { name, email, ...rest } = mockCustomer
      const id = await createCustomer({ name, email, ...rest })
      expect(id).toBeTruthy()
      expect(id.startsWith('cust_')).toBe(true)
      const customers = await getCustomers()
      expect(customers).toHaveLength(1)
      expect(customers[0].name).toBe('Sarah Mitchell')
    })
  })

  describe('getActivities', () => {
    it('returns empty activities initially', async () => {
      const result = await getActivities()
      expect(result).toEqual([])
    })
  })

  describe('addActivity', () => {
    it('adds an activity', async () => {
      const activity = await addActivity({
        customerId: 'cust_1',
        type: 'note',
        title: 'Test note',
      })
      expect(activity.id).toBeTruthy()
      expect(activity.createdAt).toBeTruthy()
      const activities = await getActivities('cust_1')
      expect(activities).toHaveLength(1)
    })
  })

  describe('getSegments', () => {
    it('returns empty segments initially', async () => {
      const result = await getSegments()
      expect(result).toEqual([])
    })
  })

  describe('getAutomations', () => {
    it('returns empty automations initially', async () => {
      const result = await getAutomations()
      expect(result).toEqual([])
    })
  })

  describe('getAuditLog', () => {
    it('returns empty audit log initially', async () => {
      const result = await getAuditLog()
      expect(result).toEqual([])
    })
  })

  describe('getGdprRequests / addGdprRequest', () => {
    it('returns empty GDPR requests initially', async () => {
      const result = await getGdprRequests()
      expect(result).toEqual([])
    })

    it('adds a GDPR request', async () => {
      const req = await addGdprRequest({
        customerId: 'cust_1',
        type: 'export',
        status: 'pending',
        requestedAt: new Date().toISOString(),
      })
      expect(req.id).toBeTruthy()
      expect(req.type).toBe('export')
      const requests = await getGdprRequests()
      expect(requests).toHaveLength(1)
    })
  })
})