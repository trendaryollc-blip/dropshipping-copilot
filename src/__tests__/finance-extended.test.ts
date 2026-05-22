import { describe, it, expect } from 'vitest'
import {
  convertCurrency,
  calculateCarryingCost,
  applyReturnsImpact,
  reconcilePayments,
  calculatePnLForProduct,
} from '../lib/finance-service'

describe('Finance extended', () => {
  it('converts currency', () => {
    expect(convertCurrency(100, 'USD', 'EUR')).toBeGreaterThan(0)
  })

  it('calculates carrying cost', () => {
    expect(calculateCarryingCost(100, 10, 2)).toBeGreaterThan(0)
  })

  it('applies returns impact', () => {
    expect(applyReturnsImpact(100, 0.1)).toBe(90)
  })

  it('reconciles payments', () => {
    const result = reconcilePayments(
      [{ id: 'o1', total: 50 }],
      [{ orderId: 'o1', amount: 50, gateway: 'stripe' }]
    )
    expect(result[0].matched).toBe(true)
  })

  it('calculates PnL', () => {
    const pnl = calculatePnLForProduct(100, 2, { productId: 'p1', cogs: 20, shipping: 5, otherCost: 0 })
    expect(pnl.revenue).toBe(200)
    expect(pnl.net).toBeLessThan(pnl.revenue)
  })
})
