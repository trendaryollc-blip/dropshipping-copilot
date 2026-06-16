import { describe, it, expect } from 'vitest'
import { AI } from '@/lib/ai/index'

describe('AI Index (Task Router)', () => {
  it('exports AI object with runTask method', () => {
    expect(AI).toBeDefined()
    expect(typeof AI.runTask).toBe('function')
  })

  it('exports lazy-loaded provider accessors', () => {
    expect(AI.groq).toBeDefined()
    expect(typeof AI.groq.processOrder).toBe('function')
    expect(AI.cohere).toBeDefined()
    expect(typeof AI.cohere.generateDescription).toBe('function')
    expect(AI.deepseek).toBeDefined()
    expect(typeof AI.deepseek.optimizeSEO).toBe('function')
    expect(AI.openrouter).toBeDefined()
    expect(typeof AI.openrouter.getPricing).toBe('function')
    expect(AI.cloudflare).toBeDefined()
    expect(typeof AI.cloudflare.detectFraud).toBe('function')
    expect(AI.mistral).toBeDefined()
    expect(typeof AI.mistral.analyzeImage).toBe('function')
    expect(AI.serpapi).toBeDefined()
    expect(typeof AI.serpapi.reviewReturns).toBe('function')
  })

  it('runTask throws for unknown tasks', async () => {
    await expect(AI.runTask('unknown' as any, {})).rejects.toThrow()
  })
})