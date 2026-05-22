import { describe, it, expect } from 'vitest'
import {
  calculateLeadScore,
  findDuplicateCustomers,
  applySegmentRules,
  exportCustomersCSV,
  importCustomersFromCSV,
} from '../lib/crm-service'
import type { CustomerProfile } from '@/types'

const baseCustomer: CustomerProfile = {
  id: 'c1',
  name: 'Test',
  email: 'test@example.com',
  segment: 'Loyal',
  lifetimeValue: 300,
  orders: 5,
  lastOrderDate: '2024-01-01',
  status: 'active',
  lastContacted: '2024-01-01',
}

describe('CRM service', () => {
  it('calculates lead score', () => {
    const score = calculateLeadScore(baseCustomer)
    expect(score).toBeGreaterThan(0)
    expect(score).toBeLessThanOrEqual(100)
  })

  it('finds duplicate emails', () => {
    const dupes = findDuplicateCustomers([
      baseCustomer,
      { ...baseCustomer, id: 'c2', name: 'Test 2' },
    ])
    expect(dupes.length).toBe(1)
    expect(dupes[0].length).toBe(2)
  })

  it('exports and imports CSV roundtrip', async () => {
    const csv = exportCustomersCSV([baseCustomer])
    expect(csv).toContain('test@example.com')
    const imported = await importCustomersFromCSV(csv)
    expect(imported[0].email).toBe('test@example.com')
  })

  it('applies segment rules', () => {
    const matched = applySegmentRules([baseCustomer], {
      id: 's1',
      name: 'High LTV',
      rules: [{ id: 'r1', field: 'lifetimeValue', operator: 'gte', value: 200 }],
      matchMode: 'all',
      createdAt: new Date().toISOString(),
    })
    expect(matched.length).toBe(1)
  })
})
