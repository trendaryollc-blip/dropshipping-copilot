import { describe, it, expect, vi } from 'vitest'
import { generateManifestCSV, exportRateCardCSV, calculateInsuranceCost, generateHTMLLabel, generatePDFLabel } from '@/lib/shipping-service'

describe('shipping extras', () => {
  it('returns a blob URL for manifest CSV', () => {
    const shipments = [
      { id: 's1', to: 'A', from: 'B', weight: 2, carrier: 'UPS' },
      { id: 's2', to: 'C', from: 'D', weight: 5 },
    ]
    const url = generateManifestCSV(shipments)
    expect(typeof url).toBe('string')
    expect(url).toContain('blob:')
  })

  it('returns a blob URL for rate card CSV', () => {
    const rateCard = [
      { provider: 'UPS', service: 'Ground', cost: 10 },
      { provider: 'DHL', service: 'Express', cost: 20 },
    ]
    const url = exportRateCardCSV(rateCard)
    expect(typeof url).toBe('string')
    expect(url).toContain('blob:')
  })

  it('calculates insurance correctly', () => {
    expect(calculateInsuranceCost(1000, true)).toBeGreaterThanOrEqual(1)
    expect(calculateInsuranceCost(0, true)).toBe(1)
    expect(calculateInsuranceCost(100, false)).toBe(0)
  })

  it('generates HTML and PDF labels as blob URLs', () => {
    const rate = { provider: 'UPS', service: 'Ground', cost: 5 }
    const info = { to: 'X', from: 'Y', weight: 2 }
    const htmlUrl = generateHTMLLabel(rate as any, info as any)
    const pdfUrl = generatePDFLabel(rate as any, info as any)
    expect(typeof htmlUrl).toBe('string')
    expect(typeof pdfUrl).toBe('string')
  })
})
