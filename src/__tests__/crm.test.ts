import { describe, it, expect, beforeEach } from 'vitest'
import { generateMockCustomers, loadCustomersFromLocal, saveCustomersToLocal } from '@/lib/crm-service'

describe('crm service', () => {
  beforeEach(() => {
    // Clear localStorage mock
    if (typeof localStorage !== 'undefined') {
      localStorage.clear()
    }
  })

  it('generates and persists mock customers', () => {
    const mocks = generateMockCustomers()
    expect(mocks.length).toBeGreaterThan(0)
    saveCustomersToLocal(mocks)
    const loaded = loadCustomersFromLocal()
    expect(loaded.length).toBe(mocks.length)
  })

  it('handles missing localStorage gracefully', () => {
    // Simulate missing localStorage
    const originalLocalStorage = global.localStorage
    delete (global as any).localStorage

    const mocks = generateMockCustomers()
    expect(mocks.length).toBeGreaterThan(0)

    // Restore
    global.localStorage = originalLocalStorage
  })
})