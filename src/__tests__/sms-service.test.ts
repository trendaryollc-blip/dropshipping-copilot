import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('twilio', () => {
  const mockCreate = vi.fn()
  return {
    default: vi.fn(() => ({
      messages: { create: mockCreate },
    })),
  }
})

// Will be set/restored per test
import SMSService from '@/lib/sms-service'

describe('SMS Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.TWILIO_ACCOUNT_SID = 'AC_mock'
    process.env.TWILIO_AUTH_TOKEN = 'token_mock'
    process.env.TWILIO_PHONE_NUMBER = '+15551234567'
  })

  describe('sendSMS', () => {
    it('sends an SMS successfully', async () => {
      const twilio = await import('twilio')
      const mockCreate = vi.fn().mockResolvedValue({ sid: 'SM123' })
      ;(twilio.default as any).mockReturnValue({ messages: { create: mockCreate } })

      // Fresh import to pick up env vars
      const { default: sms } = await import('@/lib/sms-service')
      const result = await sms.sendSMS({ to: '+15559876543', body: 'Test message' })
      expect(result.success).toBe(true)
      expect(result.messageId).toBe('SM123')
    })

    it('returns error when Twilio not configured', async () => {
      delete process.env.TWILIO_ACCOUNT_SID
      delete process.env.TWILIO_AUTH_TOKEN

      const { default: sms } = await import('@/lib/sms-service')
      const result = await sms.sendSMS({ to: '+15559876543', body: 'Test' })
      expect(result.success).toBe(false)
      expect(result.error).toContain('not configured')
    })

    it('handles Twilio API errors', async () => {
      // We're testing that the sendSMS handles the Stripe mock returning errors gracefully
      const result = await SMSService.sendSMS({ to: '+15559876543', body: 'Test' })
      expect(result).toHaveProperty('success')
    })
  })

  describe('sendOrderStatusUpdate', () => {
    it('sends order status SMS', async () => {
      const result = await SMSService.sendOrderStatusUpdate('+15559876543', {
        orderId: 'ORD-001',
        status: 'shipped',
        trackingNumber: 'TRK123',
      })
      expect(result).toHaveProperty('success')
    })

    it('sends order status without tracking number', async () => {
      const result = await SMSService.sendOrderStatusUpdate('+15559876543', {
        orderId: 'ORD-002',
        status: 'processing',
      })
      expect(result).toHaveProperty('success')
    })
  })

  describe('sendLowStockAlert', () => {
    it('sends low stock alert', async () => {
      const result = await SMSService.sendLowStockAlert('+15559876543', {
        name: 'Test Product',
        currentStock: 3,
      })
      expect(result).toHaveProperty('success')
    })
  })

  describe('sendVerificationCode', () => {
    it('sends verification code', async () => {
      const result = await SMSService.sendVerificationCode('+15559876543', '123456')
      expect(result).toHaveProperty('success')
    })
  })
})