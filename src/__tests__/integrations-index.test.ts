import { describe, it, expect, vi } from 'vitest'

// Mock all integration adapters
vi.mock('@/lib/integrations/shopify-adapter', () => ({ default: () => ({ name: 'shopify', connect: vi.fn() }) }))
vi.mock('@/lib/integrations/amazon-adapter', () => ({ default: () => ({ name: 'amazon', connect: vi.fn() }) }))
vi.mock('@/lib/integrations/ebay-adapter', () => ({ default: () => ({ name: 'ebay', connect: vi.fn() }) }))
vi.mock('@/lib/integrations/trustpilot-adapter', () => ({ default: () => ({ name: 'trustpilot', connect: vi.fn() }) }))
vi.mock('@/lib/integrations/trendaryo-api', () => ({ createTrendaryoAPI: () => ({ name: 'trendaryo', connect: vi.fn() }) }))

import { integrationAdapters } from '@/lib/integrations/index'

describe('Integration Adapters Index', () => {
  it('exports all integration adapters', () => {
    expect(integrationAdapters).toBeDefined()
    expect(integrationAdapters.shopify).toBeDefined()
    expect(integrationAdapters.amazon).toBeDefined()
    expect(integrationAdapters.ebay).toBeDefined()
    expect(integrationAdapters.trustpilot).toBeDefined()
    expect(integrationAdapters.trendaryo).toBeDefined()
  })

  it('each adapter has a name', () => {
    Object.entries(integrationAdapters).forEach(([key, adapter]) => {
      expect((adapter as any).name).toBe(key)
    })
  })

  it('each adapter can connect', () => {
    Object.values(integrationAdapters).forEach(adapter => {
      expect(typeof (adapter as any).connect).toBe('function')
    })
  })
})