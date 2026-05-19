import { describe, it, expect } from 'vitest'
import { calculatePnLForProduct } from '@/lib/finance-service'

describe('finance service', () => {
  it('calculates net profit correctly', () => {
    const res = calculatePnLForProduct(100, 1, { productId: 'p1', cogs: 40, shipping: 5, otherCost: 2 }, { percentage: 5, fixed: 0.3 }, 10)
    // revenue 100 - (40+5+2) - fees(5% of 100 + 0.3) - adSpend(10) = net
    const expectedFees = 100 * 0.05 + 0.3
    const expectedNet = 100 - (40 + 5 + 2) - expectedFees - 10
    expect(res.net).toBeCloseTo(expectedNet)
  })
})
