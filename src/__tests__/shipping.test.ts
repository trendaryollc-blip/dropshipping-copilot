import { describe, it, expect, beforeEach } from 'vitest'
import { getRatesForShipment, cacheRates, getCachedRates } from '@/lib/shipping-service'

describe('shipping service', () => {
  beforeEach(() => { localStorage.clear() })

  it('provides mock rates and caches them', () => {
    const rates = getRatesForShipment({ origin: 'CN', destination: 'US', weight: 2 })
    expect(Array.isArray(rates)).toBe(true)
    cacheRates('testkey', rates, 1)
    const cached = getCachedRates('testkey')
    expect(cached).not.toBeNull()
  })
})
