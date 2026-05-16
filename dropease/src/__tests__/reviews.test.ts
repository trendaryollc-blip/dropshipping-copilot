import { describe, it, expect } from 'vitest'
import { sentimentAnalysisPlaceholder, detectDuplicates } from '@/lib/reviews-service'

describe('reviews service', () => {
  it('returns sentiment labels', () => {
    const s = sentimentAnalysisPlaceholder('good product')
    expect(['positive','neutral','negative']).toContain(s.label)
  })

  it('detects duplicates by body prefix', () => {
    const reviews = [
      { id: 'r1', body: 'Nice item', productId: 'p1' },
      { id: 'r2', body: 'Nice item and fast', productId: 'p1' },
      { id: 'r3', body: 'Different', productId: 'p2' },
    ]
    const d = detectDuplicates(reviews as any)
    expect(d.length).toBeGreaterThan(0)
  })
})
