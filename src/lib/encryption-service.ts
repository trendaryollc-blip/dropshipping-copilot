// Encryption & Data Security Service
// ─── encryptionService uses AES-GCM-256 via the Web Crypto API ─────────────
// ─── apiSecurityService, dataProtectionService, auditLogService follow below

// ============================================================
// Helpers – Web Crypto API (AES-GCM-256)
// ============================================================

interface EncryptedPayload {
  v: string
  alg: string
  iv: string
  data: string
}

async function deriveKey(password: string): Promise<CryptoKey> {
  const enc = new TextEncoder()
  const rawKey = await window.crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveKey"],
  )
  return window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: enc.encode("dropease-salt-v1"),
      iterations: 100_000,
      hash: "SHA-256",
    },
    rawKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  )
}

async function aesGcmEncrypt(plaintext: string, password: string): Promise<string> {
  const key = await deriveKey(password)
  const iv = window.crypto.getRandomValues(new Uint8Array(12))
  const enc = new TextEncoder()
  const cipherBuffer = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    enc.encode(plaintext),
  )
  return JSON.stringify({
    v: "1",
    alg: "AES-GCM",
    iv: arrayBufferToBase64(iv),
    data: arrayBufferToBase64(new Uint8Array(cipherBuffer)),
  } satisfies EncryptedPayload)
}

async function aesGcmDecrypt(envelope: string, password: string): Promise<string> {
  const payload: EncryptedPayload = JSON.parse(envelope)
  if (payload.v !== "1" || payload.alg !== "AES-GCM") {
    throw new Error("Unsupported encryption envelope")
  }
  const key = await deriveKey(password)
  const iv = base64ToArrayBuffer(payload.iv)
  const data = base64ToArrayBuffer(payload.data)
  const plainBuffer = await window.crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    data,
  )
  return new TextDecoder().decode(plainBuffer)
}

function arrayBufferToBase64(buf: Uint8Array): string {
  let binary = ""
  for (let i = 0; i < buf.length; i++) binary += String.fromCharCode(buf[i])
  return btoa(binary)
}

function base64ToArrayBuffer(base64: string): Uint8Array {
  const binary = atob(base64)
  const buf = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) buf[i] = binary.charCodeAt(i)
  return buf
}

// ============================================================
// encryptionService – AES-GCM-256
// ============================================================

const SENSITIVE_FIELDS = new Set<string>([
  "password",
  "api_key",
  "api_secret",
  "credit_card",
  "ssn",
  "bank_account",
])

export const encryptionService = {
  /**
   * Encrypt arbitrary text with AES-GCM-256.
   * @param data  Plain text to encrypt
   * @param key   Encryption password (defaults to app-level key)
   * @returns     AES-GCM JSON envelope string
   */
  async encrypt(data: string, key: string = "dropease-default-key"): Promise<string> {
    if (!data) return ""
    try {
      return await aesGcmEncrypt(data, key)
    } catch (error) {
      console.error("Encryption failed:", error)
      return ""
    }
  },

  /** Decrypt an AES-GCM envelope back to plain text. */
  async decrypt(encryptedData: string, key: string = "dropease-default-key"): Promise<string> {
    if (!encryptedData) return ""
    try {
      return await aesGcmDecrypt(encryptedData, key)
    } catch {
      console.error("Decryption failed: invalid data or wrong key")
      return ""
    }
  },

  /**
   * Encrypt a single field value.
   * Sensitive fields (password, api_key, …) are AES-GCM encrypted.
   * Other fields are JSON-stringified as-is.
   */
  async encryptField(fieldName: string, value: unknown, key: string = "dropease-default-key"): Promise<string> {
    if (SENSITIVE_FIELDS.has(fieldName.toLowerCase())) {
      return this.encrypt(JSON.stringify(value), key)
    }
    return JSON.stringify(value)
  },

  /**
   * Decrypt a previously encrypted field value.
   * @param fieldName     Must match the name used during encryption
   * @param encryptedValue String returned by `encryptField()`
   * @param key           Same key used during encryption
   */
  async decryptField(fieldName: string, encryptedValue: string, key: string = "dropease-default-key"): Promise<unknown> {
    if (SENSITIVE_FIELDS.has(fieldName.toLowerCase()) && encryptedValue.startsWith("{")) {
      try {
        return JSON.parse(await this.decrypt(encryptedValue, key))
      } catch {
        return null
      }
    }
    try {
      return JSON.parse(encryptedValue)
    } catch {
      return encryptedValue
    }
  },

  /** One-way SHA-256 hash (not reversible). */
  async hash(data: string): Promise<string> {
    const enc = new TextEncoder()
    const hashBuffer = await window.crypto.subtle.digest("SHA-256", enc.encode(data))
    return "sha256:" + arrayBufferToBase64(new Uint8Array(hashBuffer))
  },

  /** Generate a cryptographically random hex key.  @param length  Number of bytes (default 32 = 256 bits). */
  async generateKey(length: number = 32): Promise<string> {
    const buf = window.crypto.getRandomValues(new Uint8Array(length))
    return Array.from(buf).map((b) => b.toString(16).padStart(2, "0")).join("")
  },

  async encryptBackup(backupData: string, key: string = "dropease-default-key"): Promise<string> {
    return this.encrypt(backupData, key)
  },

  async decryptBackup(encryptedBackup: string, key: string = "dropease-default-key"): Promise<string> {
    return this.decrypt(encryptedBackup, key)
  },
}

// ============================================================
// apiSecurityService – Rate-limit & threat detection
// ============================================================

interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetAt: string
  retryAfter?: number
}

interface SuspiciousActivityResult {
  flagged: boolean
  score: number
  reason?: string
  recommendedAction?: "warn" | "limit" | "block"
}

interface ThrottleResult {
  delayed: boolean
  delayMs: number
}

interface RateLimitStatus {
  apiCalls: { used: number; limit: number; resetAt: string }
  search: { used: number; limit: number; resetAt: string }
  download: { used: number; limit: number; resetAt: string }
  export: { used: number; limit: number; resetAt: string }
}

type RequestLimitType = "api_calls" | "search" | "download" | "export"
type ActivityType = "rapid_requests" | "bulk_data_access" | "unusual_pattern"
type Priority = "low" | "normal" | "high"

export const apiSecurityService = {
  userRequestTracker: new Map<string, { count: number; resetTime: number }>(),
  ipRequestTracker: new Map<string, { count: number; resetTime: number }>(),

  async shouldRateLimit(
    identifier: string,
    limitType: RequestLimitType = "api_calls",
    _ipAddress?: string,
  ): Promise<RateLimitResult> {
    await new Promise((resolve) => setTimeout(resolve, 50))

    const limits: Record<RequestLimitType, number> = {
      api_calls: 100,
      search: 30,
      download: 10,
      export: 5,
    }

    const limit = limits[limitType]
    const now = Date.now()
    const tracker = this.userRequestTracker.get(identifier) || {
      count: 0,
      resetTime: now + 60_000,
    }

    if (now > tracker.resetTime) {
      tracker.count = 0
      tracker.resetTime = now + 60_000
    }

    tracker.count++
    this.userRequestTracker.set(identifier, tracker)

    const allowed = tracker.count <= limit
    const remaining = Math.max(0, limit - tracker.count)
    const resetAt = new Date(tracker.resetTime).toISOString()

    return {
      allowed,
      remaining,
      resetAt,
      retryAfter: allowed ? undefined : Math.ceil((tracker.resetTime - now) / 1000),
    }
  },

  async detectSuspiciousActivity(
    userId: string,
    activity: ActivityType,
  ): Promise<SuspiciousActivityResult> {
    await new Promise((resolve) => setTimeout(resolve, 200))

    const scores: Record<ActivityType, number> = {
      rapid_requests: 45,
      bulk_data_access: 60,
      unusual_pattern: 35,
    }

    const score = scores[activity] || 0

    return {
      flagged: score > 50,
      score,
      reason: score > 50 ? `Suspicious ${activity.replace(/_/g, " ")} detected` : undefined,
      recommendedAction: score > 70 ? "limit" : score > 50 ? "warn" : undefined,
    }
  },

  async throttleRequest(userId: string, priority: Priority = "normal"): Promise<ThrottleResult> {
    await new Promise((resolve) => setTimeout(resolve, 30))

    const delays: Record<Priority, number> = {
      high: 0,
      normal: Math.random() * 100,
      low: Math.random() * 500,
    }

    const delayMs = delays[priority]
    return {
      delayed: delayMs > 0,
      delayMs: Math.ceil(delayMs),
    }
  },

  async getRateLimitStatus(
    userId: string,
  ): Promise<RateLimitStatus> {
    await new Promise((resolve) => setTimeout(resolve, 100))

    const now = new Date()
    const nextReset = new Date(now.getTime() + 60_000)

    return {
      apiCalls: { used: 34, limit: 100, resetAt: nextReset.toISOString() },
      search: { used: 12, limit: 30, resetAt: nextReset.toISOString() },
      download: { used: 2, limit: 10, resetAt: nextReset.toISOString() },
      export: { used: 1, limit: 5, resetAt: nextReset.toISOString() },
    }
  },

  ipWhitelist: new Set<string>(),

  async addToWhitelist(ipAddress: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 200))
    this.ipWhitelist.add(ipAddress)
  },

  async removeFromWhitelist(ipAddress: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 200))
    this.ipWhitelist.delete(ipAddress)
  },

  async isWhitelisted(ipAddress: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 50))
    return this.ipWhitelist.has(ipAddress)
  },
}

// ============================================================
// dataProtectionService
// ============================================================

export const dataProtectionService = {
  anonymizeUserData(userData: Record<string, unknown>): Record<string, unknown> {
    const anonymized: Record<string, unknown> = { ...userData }

    const piiFields = ["email", "phone", "address", "ssn", "credit_card"]
    piiFields.forEach((field: string) => {
      if (field in anonymized) {
        const value: unknown = anonymized[field]
        if (typeof value === "string") {
          anonymized[field] = `***${value.slice(-4)}`
        }
      }
    })

    return anonymized
  },

  generateAnonymousId(): string {
    return `anon_${Math.random().toString(36).substring(2, 11)}`
  },

  async purgeUserData(
    userId: string,
    daysSinceLastActivity: number = 365,
  ): Promise<{ purged: boolean; recordsDeleted: number }> {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return {
      purged: true,
      recordsDeleted: 247,
    }
  },

  async exportUserData(
    userId: string,
  ): Promise<{ exportId: string; expiresAt: string }> {
    await new Promise((resolve) => setTimeout(resolve, 2000))
    return {
      exportId: `export_${userId}_${Date.now()}`,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    }
  },

  async deleteUserAccount(
    userId: string,
  ): Promise<{ scheduled: boolean; deletionDate: string }> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return {
      scheduled: true,
      deletionDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    }
  },
}

// ============================================================
// auditLogService
// ============================================================

type AuditChange = Record<string, unknown>

interface AuditLogEntry {
  id: string
  userId: string
  action: string
  resource: string
  timestamp: string
  ipAddress: string
  changes?: AuditChange
}

export const auditLogService = {
  logs: [] as AuditLogEntry[],

  async logAction(
    userId: string,
    action: string,
    resource: string,
    ipAddress: string,
    changes?: AuditChange,
  ): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 100))

    this.logs.push({
      id: `log_${Date.now()}`,
      userId,
      action,
      resource,
      timestamp: new Date().toISOString(),
      ipAddress,
      changes,
    })

    if (this.logs.length > 10_000) {
      this.logs = this.logs.slice(-10_000)
    }
  },

  async getAuditLog(
    userId?: string,
    limit: number = 50,
  ): Promise<Array<Omit<AuditLogEntry, "changes">>> {
    await new Promise((resolve) => setTimeout(resolve, 200))

    let logs = this.logs
    if (userId) {
      logs = logs.filter((log) => log.userId === userId)
    }

    return logs
      .slice(-limit)
      .reverse()
      .map(({ changes: _c, ...rest }) => rest)
  },
}
