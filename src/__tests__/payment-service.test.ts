import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock Stripe
vi.mock('stripe', () => {
  const mockStripe = vi.fn(() => ({
    customers: {
      create: vi.fn().mockResolvedValue({ id: 'cus_123' }),
    },
    checkout: {
      sessions: {
        create: vi.fn().mockResolvedValue({ id: 'cs_test_123', url: 'https://checkout.stripe.com/test' }),
      },
    },
    subscriptions: {
      create: vi.fn().mockResolvedValue({ id: 'sub_123', status: 'active' }),
      cancel: vi.fn().mockResolvedValue({ id: 'sub_123', status: 'canceled' }),
    },
    webhooks: {
      constructEvent: vi.fn().mockReturnValue({ type: 'checkout.session.completed', data: { object: { id: 'cs_test_123' } } }),
    },
  }))
  return { default: mockStripe }
})

// We must set env vars before importing
process.env.STRIPE_SECRET_KEY = 'sk_test_mock'
process.env.STRIPE_WEBHOOK_SECRET = 'whsec_mock'

import paymentService from '@/lib/payment-service'

describe('Payment Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('createCustomer', () => {
    it('creates a customer successfully', async () => {
      const result = await paymentService.createCustomer('test@example.com', 'Test User')
      expect(result.success).toBe(true)
      expect(result.customerId).toBe('cus_123')
    })

    it('returns error when Stripe is not configured', async () => {
      // Temporarily clear the env var
      const oldKey = process.env.STRIPE_SECRET_KEY
      delete process.env.STRIPE_SECRET_KEY

      const result = await paymentService.createCustomer('test@example.com', 'Test User')
      expect(result.success).toBe(false)
      expect(result.error).toContain('not configured')

      process.env.STRIPE_SECRET_KEY = oldKey
    })

    it('handles Stripe API errors', async () => {
      // Mock Stripe to throw an error
      const Stripe = await import('stripe')
      const mockStripe = Stripe.default as any
      mockStripe.mockReturnValue({
        customers: {
          create: vi.fn().mockRejectedValue(new Error('Stripe API error'))
        }
      })

      const result = await paymentService.createCustomer('test@example.com', 'Test User')
      expect(result.success).toBe(false)
      expect(result.error).toContain('Stripe API error')
    })
  })

  describe('createCheckoutSession', () => {
    it('creates a checkout session', async () => {
      const result = await paymentService.createCheckoutSession({
        customerId: 'cus_123',
        priceId: 'price_abc',
        successUrl: 'https://example.com/success',
        cancelUrl: 'https://example.com/cancel',
      })
      expect(result.success).toBe(true)
      expect(result.sessionId).toBe('cs_test_123')
      expect(result.url).toContain('stripe.com')
    })
  })

  describe('createSubscription', () => {
    it('creates a subscription', async () => {
      const result = await paymentService.createSubscription({
        customerId: 'cus_123',
        priceId: 'price_abc',
      })
      expect(result.success).toBe(true)
      expect(result.subscriptionId).toBe('sub_123')
    })
  })

  describe('cancelSubscription', () => {
    it('cancels a subscription', async () => {
      const result = await paymentService.cancelSubscription('sub_123')
      expect(result.success).toBe(true)
      expect(result.subscriptionId).toBe('sub_123')
    })
  })

  describe('handleWebhook', () => {
    it('handles webhook events', async () => {
      const result = await paymentService.handleWebhook(
        JSON.stringify({ type: 'checkout.session.completed' }),
        'test_signature'
      )
      expect(result.success).toBe(true)
      expect(result.eventType).toBe('checkout.session.completed')
    })

    it('fails without webhook secret', async () => {
      const oldSecret = process.env.STRIPE_WEBHOOK_SECRET
      delete process.env.STRIPE_WEBHOOK_SECRET

      const result = await paymentService.handleWebhook('{}', 'sig')
      expect(result.success).toBe(false)
      expect(result.error).toContain('not configured')

      process.env.STRIPE_WEBHOOK_SECRET = oldSecret
    })
  })
})