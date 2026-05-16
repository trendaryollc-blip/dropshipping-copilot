import { describe, it, expect, beforeEach } from 'vitest'
import { generateMockCustomers, loadCustomersFromLocal, saveCustomersToLocal } from '@/lib/crm-service'

describe('crm service', () => {
  beforeEach(() => { localStorage.clear() })

  it('generates and persists mock customers', () => {
    const mocks = generateMockCustomers()
    expect(mocks.length).toBeGreaterThan(0)
    saveCustomersToLocal(mocks)
    const loaded = loadCustomersFromLocal()
    expect(loaded.length).toBe(mocks.length)
  })
})
