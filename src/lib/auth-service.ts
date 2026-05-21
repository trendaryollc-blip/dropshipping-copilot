// Authentication & Security Service
import type { User } from "@/types"

// ============================================================
// Helpers – Web Crypto API
// ============================================================

async function otpAt(secret: string, timeStep: number): Promise<string> {
  // RFC 6238 TOTP using HMAC-SHA256
  const keyData = new TextEncoder().encode(secret)
  const key = await window.crypto.subtle.importKey("raw", keyData, { name: "HMAC", hash: "SHA-256" }, false, ["sign"])
  const counter = new ArrayBuffer(8)
  const view = new DataView(counter)
  let steps = BigInt(timeStep)
  for (let i = 7; i >= 0; i--) {
    view.getUint8(i)
  }
  view.setUint8(7, Number(steps & 0xffn))
  view.setUint8(6, Number((steps >> 8n) & 0xffn))
  view.setUint8(5, Number((steps >> 16n) & 0xffn))
  view.setUint8(4, Number((steps >> 24n) & 0xffn))
  view.setUint8(3, Number((steps >> 32n) & 0xffn))
  view.setUint8(2, Number((steps >> 40n) & 0xffn))
  view.setUint8(1, Number((steps >> 48n) & 0xffn))
  view.setUint8(0, Number((steps >> 56n) & 0xffn))
  const signature = await window.crypto.subtle.sign("HMAC", key, counter)
  const hashBytes = new Uint8Array(signature)
  const offset = hashBytes[hashBytes.length - 1] & 0x0f
  const binary =
    ((hashBytes[offset] & 0x7f) << 24) |
    ((hashBytes[offset + 1] & 0xff) << 16) |
    ((hashBytes[offset + 2] & 0xff) << 8) |
    (hashBytes[offset + 3] & 0xff)
  return String(binary % 1_000_000).padStart(6, "0")
}

function generateOtpSecret(): string {
  return Array.from(window.crypto.getRandomValues(new Uint8Array(20)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

function generateRandomSecret(length: number = 32): string {
  return Array.from(window.crypto.getRandomValues(new Uint8Array(length)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

function generateBackupCodes(count: number = 10): string[] {
  const codes: string[] = []
  for (let i = 0; i < count; i++) {
    codes.push(generateRandomSecret(6).toUpperCase())
  }
  return codes
}

// ============================================================
// 2FA / TOTP Service
// ============================================================

export const twoFactorService = {
  async generateSecret(userId: string): Promise<{ secret: string; qrCode: string }> {
    await new Promise((resolve) => setTimeout(resolve, 800))
    const secret = generateOtpSecret()
    return {
      secret,
      qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=otpauth://totp/DropEase:${userId}%3Fsecret%3D${secret}`,
    }
  },

  /** Verify a TOTP code server-side with time-step tolerance (±1 step, ±30 s drift). */
  async verifyCode(secret: string, code: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    if (!/^\d{6}$/.test(code)) return false
    const epoch = Math.floor(Date.now() / 1000)
    const steps = Math.floor(epoch / 30)
    for (let delta = -1; delta <= 1; delta++) {
      const expected = await otpAt(secret, steps + delta)
      if (expected === code) return true
    }
    return false
  },

  async enable2FA(userId: string, secret: string): Promise<{ backup_codes: string[] }> {
    await new Promise((resolve) => setTimeout(resolve, 600))
    return { backup_codes: generateBackupCodes() }
  },

  async disable2FA(userId: string): Promise<{ success: boolean }> {
    await new Promise((resolve) => setTimeout(resolve, 400))
    return { success: true }
  },

  async verifyBackupCode(_userId: string, code: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return /^[A-F0-9]{8}$/.test(code.toUpperCase())
  },
}

// ============================================================
// Password Security Service
// ============================================================

interface PasswordStrength {
  score: number // 0-4
  feedback: string[]
}

export const passwordService = {
  validatePasswordStrength(password: string): PasswordStrength {
    const feedback: string[] = []
    let score = 0

    if (password.length >= 8) score++
    else feedback.push("Password should be at least 8 characters")

    if (password.length >= 12) score++

    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++
    else feedback.push("Use both uppercase and lowercase letters")

    if (/\d/.test(password)) score++
    else feedback.push("Include numbers")

    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++
    else feedback.push("Include special characters")

    return { score: Math.min(score, 4), feedback }
  },

  hashPassword(password: string): string {
    // In production, use bcrypt on the server
    return `hash_${Buffer.from(password).toString("base64")}`
  },

  generatePassword(length: number = 12): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()"
    let password = ""
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return password
  },
}

// ============================================================
// Session Management Service
// ============================================================

interface SessionInfo {
  sessionId: string
  device: string
  ipAddress: string
  createdAt: string
  lastActivity: string
  expiresAt: string
}

export const sessionService = {
  async createSession(userId: string): Promise<{ sessionId: string; expiresAt: string }> {
    await new Promise((resolve) => setTimeout(resolve, 400))
    return {
      sessionId: `sess_${generateRandomSecret().substring(0, 32)}`,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    }
  },

  async validateSession(sessionId: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 200))
    return sessionId.startsWith("sess_") && sessionId.length === 36
  },

  async revokeSession(sessionId: string): Promise<{ success: boolean }> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return { success: true }
  },

  async getActiveSessions(userId: string): Promise<SessionInfo[]> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const offsetHours = (h: number) => Date.now() - h * 60 * 60 * 1000
    const futureHours = (h: number) => Date.now() + h * 60 * 60 * 1000
    return [
      {
        sessionId: "sess_abc123def456",
        device: "Chrome on Windows",
        ipAddress: "192.168.1.100",
        createdAt: new Date(offsetHours(2)).toISOString(),
        lastActivity: new Date(offsetHours(0.083)).toISOString(),
        expiresAt: new Date(futureHours(22)).toISOString(),
      },
      {
        sessionId: "sess_xyz789uvw012",
        device: "Safari on iPhone",
        ipAddress: "203.0.113.45",
        createdAt: new Date(offsetHours(24)).toISOString(),
        lastActivity: new Date(offsetHours(0.5)).toISOString(),
        expiresAt: new Date(futureHours(23)).toISOString(),
      },
    ]
  },
}

// ============================================================
// Login Security Service
// ============================================================

interface LoginAttemptResult {
  blocked: boolean
  attemptsLeft: number
}

interface SuspiciousAttemptInfo {
  timestamp: string
  ipAddress: string
  location: string
  device: string
}

export const loginSecurityService = {
  async recordFailedAttempt(email: string): Promise<LoginAttemptResult> {
    await new Promise((resolve) => setTimeout(resolve, 200))
    return { blocked: false, attemptsLeft: 5 }
  },

  async isAccountLocked(email: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 150))
    return false
  },

  async recordSuccessfulLogin(userId: string, ipAddress: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 200))
    // In prod: reset failed-attempts counter in database
  },

  async getSuspiciousAttempts(userId: string): Promise<SuspiciousAttemptInfo[]> {
    await new Promise((resolve) => setTimeout(resolve, 400))
    return [
      {
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        ipAddress: "198.51.100.42",
        location: "Unknown Country",
        device: "Firefox on Linux",
      },
    ]
  },
}

// ============================================================
// API Rate-Limit Service
// ============================================================

interface RateLimitResult2 {
  allowed: boolean
  remaining: number
  resetAt: string
}

type RateLimitEndpoint = "api" | "login" | "password_reset"

export const rateLimitService = {
  async checkRateLimit(
    identifier: string,
    limitType: RateLimitEndpoint,
  ): Promise<RateLimitResult2> {
    await new Promise((resolve) => setTimeout(resolve, 100))

    const limits: Record<RateLimitEndpoint, { perMinute: number; perHour: number }> = {
      api: { perMinute: 60, perHour: 1000 },
      login: { perMinute: 5, perHour: 20 },
      password_reset: { perMinute: 1, perHour: 3 },
    }

    const { perMinute } = limits[limitType]
    return {
      allowed: true,
      remaining: perMinute,
      resetAt: new Date(Date.now() + 60_000).toISOString(),
    }
  },

  async incrementCounter(_identifier: string, _limitType: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 50))
  },
}
