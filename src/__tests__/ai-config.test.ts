import { describe, it, expect } from 'vitest'
import { TASK_AI_MAPPING, FREE_TIER_LIMITS, AI_PROVIDERS } from '@/lib/ai/config'

describe('AI Config', () => {
  it('maps all tasks to providers', () => {
    const tasks = Object.keys(TASK_AI_MAPPING)
    expect(tasks).toContain('order_processing')
    expect(tasks).toContain('product_description')
    expect(tasks).toContain('seo_optimization')
    expect(tasks).toContain('dynamic_pricing')
    expect(tasks).toContain('fraud_detection')
    expect(tasks).toContain('image_analysis')
    expect(tasks).toContain('competitor_analysis')
    expect(tasks).toContain('returns_review')
    expect(tasks.length).toBe(8)
  })

  it('each provider has free tier limit', () => {
    const providers = Object.values(AI_PROVIDERS)
    providers.forEach(p => {
      expect(FREE_TIER_LIMITS[p]).toBeDefined()
      expect(typeof FREE_TIER_LIMITS[p]).toBe('string')
    })
  })

  it('each task maps to a valid provider', () => {
    const validProviders = Object.values(AI_PROVIDERS)
    Object.values(TASK_AI_MAPPING).forEach(p => {
      expect(validProviders).toContain(p)
    })
  })

  it('providers are used efficiently (some may be shared)', () => {
    const usedProviders = Object.values(TASK_AI_MAPPING)
    const unique = new Set(usedProviders)
    // Cohere is used twice (product_description + competitor_analysis)
    // This is intentional to maximize free tier usage
    expect(unique.size).toBeGreaterThanOrEqual(6)
    expect(unique.size).toBeLessThanOrEqual(usedProviders.length)
  })

  it('AI_PROVIDERS values are unique', () => {
    const values = Object.values(AI_PROVIDERS)
    const unique = new Set(values)
    expect(unique.size).toBe(values.length)
  })
})