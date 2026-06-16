import { describe, it, expect, vi, beforeEach } from 'vitest'
import { rateLimit, rateLimitAsync, getRateLimitKey } from '@/lib/rate-limiter'

describe('Rate Limiter', () => {
  describe('rateLimit (sync)', () => {
    it('allows requests within limit', () => {
      const result = rateLimit('test-key', { maxRequests: 5, windowMs: 60000 })
      expect(result.success).toBe(true)
      expect(result.remaining).toBeGreaterThanOrEqual(0)
    })

    it('blocks requests exceeding limit', () => {
      for (let i = 0; i < 5; i++) {
        rateLimit('block-key', { maxRequests: 5, windowMs: 60000 })
      }
      const result = rateLimit('block-key', { maxRequests: 5, windowMs: 60000 })
      expect(result.success).toBe(false)
      expect(result.remaining).toBe(0)
    })

    it('different keys have independent counters', () => {
      const result1 = rateLimit('key-a', { maxRequests: 1 })
      expect(result1.success).toBe(true)

      const result2 = rateLimit('key-a', { maxRequests: 1 })
      expect(result2.success).toBe(false)

      const result3 = rateLimit('key-b', { maxRequests: 1 })
      expect(result3.success).toBe(true)
    })
  })

  describe('rateLimitAsync', () => {
    it('allows requests within limit', async () => {
      const result = await rateLimitAsync('async-key', { maxRequests: 5, windowMs: 60000 })
      expect(result.success).toBe(true)
    })

    it('blocks requests exceeding limit', async () => {
      for (let i = 0; i < 5; i++) {
        await rateLimitAsync('async-block', { maxRequests: 5 })
      }
      const result = await rateLimitAsync('async-block', { maxRequests: 5 })
      expect(result.success).toBe(false)
    })
  })

  describe('getRateLimitKey', () => {
    it('uses user ID when authenticated', () => {
      const key = getRateLimitKey({
        headers: { get: () => null },
        auth: { userId: 'user-123' },
      })
      expect(key).toBe('user:user-123')
    })

    it('falls back to IP via x-forwarded-for', () => {
      const key = getRateLimitKey({
        headers: { get: (name: string) => name === 'x-forwarded-for' ? '1.2.3.4' : null },
      })
      expect(key).toBe('ip:1.2.3.4')
    })

    it('falls back to unknown when nothing available', () => {
      const key = getRateLimitKey({
        headers: { get: () => null },
      })
      expect(key).toBe('ip:unknown')
    })
  })
})