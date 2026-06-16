import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock twilio
vi.mock('twilio', () => {
  const mockTwilio = vi.fn((sid: string, token: string) => ({
    messages: {
      create: vi.fn().mockResolvedValue({ sid: 'SM123' }),
    },
  }))
  return { default: mockTwilio }
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
      const result = await SMSService.sendSMS({ to: '+15559876543', body: 'Test message' })
      expect(result.success).toBe(true)
      expect(result.messageId).toBe('SM123')
    })

    it('returns error when Twilio not configured', async () => {
      delete process.env.TWILIO_ACCOUNT_SID
      delete process.env.TWILIO_AUTH_TOKEN

      const result = await SMSService.sendSMS({ to: '+15559876543', body: 'Test message' })
      expect(result.success).toBe(false)
      expect(result.error).toContain('not configured')
    })

    it('handles Twilio API errors', async () => {
      // Mock Twilio to throw an error
      const twilio = await import('twilio')
      ;(twilio.default as any).mockReturnValue({
        messages: {
          create: vi.fn().mockRejectedValue(new Error('Twilio error'))
        }
      })

      const result = await SMSService.sendSMS({ to: '+15559876543', body: 'Test message' })
      expect(result.success).toBe(false)
      expect(result.error).toContain('Twilio error')
    })
  })

  describe('sendOrderStatusUpdate', () => {
    it('sends order status update', async () => {
      const result = await SMSService.sendOrderStatusUpdate('+15559876543', 'ORD-001', 'shipped')
      expect(result.success).toBe(true)
      expect(result.messageId).toBe('SM123')
    })
  })

  describe('edge cases', () => {
    it('handles invalid phone numbers', async () => {
      const result = await SMSService.sendSMS({ to: 'invalid', body: 'Test' })
      expect(result.success).toBe(false)
      expect(result.error).toContain('invalid')
    })

    it('handles empty message', async () => {
      const result = await SMSService.sendSMS({ to: '+15559876543', body: '' })
      expect(result.success).toBe(false)
      expect(result.error).toContain('empty')
    })
  })
})