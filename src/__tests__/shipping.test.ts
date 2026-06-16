import { describe, it, expect, beforeEach } from 'vitest'
import { getRatesForShipment, cacheRates, getCachedRates } from '@/lib/shipping-service'

describe('shipping service', () => {
  beforeEach(() => {
    // Clear localStorage mock
    if (typeof localStorage !== 'undefined') {
      localStorage.clear()
    }
  })

  it('provides mock rates and caches them', () => {
    const rates = getRatesForShipment({ origin: 'CN', destination: 'US', weight: 2 })
    expect(Array.isArray(rates)).toBe(true)
    cacheRates('testkey', rates, 1)
    const cached = getCachedRates('testkey')
    expect(cached).not.toBeNull()
  })

  it('handles missing localStorage gracefully', () => {
    // Simulate missing localStorage
    const originalLocalStorage = global.localStorage
    delete (global as any).localStorage

    const rates = getRatesForShipment({ origin: 'CN', destination: 'US', weight: 2 })
    expect(rates).toBeDefined()

    // Restore
    global.localStorage = originalLocalStorage
  })
})