/**
 * Rate Limiter
 * Supports both in-memory (for development) and Upstash Redis / Vercel KV for production.
 * 
 * In serverless environments (Vercel), the in-memory store resets on every cold start,
 * so we use Vercel KV (Upstash Redis) when available.
 * 
 * Environment variables:
 *   KV_URL / KV_REST_API_URL — set automatically by Vercel KV integration
 *   If not present, falls back to in-memory (suitable for dev only).
 */

interface RateLimitEntry {
  count: number
  resetAt: number
}

// In-memory fallback store (used in dev or when Vercel KV is not configured)
const memoryStore = new Map<string, RateLimitEntry>()

// Cleanup stale entries every 5 minutes (only used by in-memory store)
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    for (const [key, entry] of memoryStore.entries()) {
      if (now > entry.resetAt) memoryStore.delete(key)
    }
  }, 300_000)
}

export interface RateLimitOptions {
  windowMs?: number
  maxRequests?: number
}

export interface RateLimitResult {
  success: boolean
  remaining: number
  resetAt: number
}

const DEFAULT_WINDOW_MS = 60_000 // 1 minute
const DEFAULT_MAX_REQUESTS = 30

/**
 * Check if Vercel KV (Upstash Redis) is available
 */
function isKvConfigured(): boolean {
  return !!(process.env.KV_URL || process.env.KV_REST_API_URL)
}

/**
 * Implements a sliding-window rate limit using Vercel KV.
 */
async function kvRateLimit(
  identifier: string,
  windowMs: number,
  maxRequests: number
): Promise<RateLimitResult> {
  const { kv } = await import('@vercel/kv')
  const now = Date.now()
  const key = `ratelimit:${identifier}`
  
  // Use a Redis sorted set to track requests within the window
  const windowStart = now - windowMs
  
  // Remove old entries
  await kv.zremrangebyscore(key, 0, windowStart)
  
  // Count existing requests
  const count = await kv.zcard(key)
  
  if (count >= maxRequests) {
    // Get the oldest entry's timestamp to calculate reset time
    const oldest = await kv.zrange(key, 0, 0, { rev: false })
    const oldestTime = oldest.length > 0 ? Number(oldest[0]) : now + windowMs
    return {
      success: false,
      remaining: 0,
      resetAt: oldestTime + windowMs,
    }
  }
  
  // Add current request
  await kv.zadd(key, { score: now, member: `${now}-${Math.random()}` })
  // Set TTL on the key
  await kv.expire(key, Math.ceil(windowMs / 1000))
  
  return {
    success: true,
    remaining: maxRequests - count - 1,
    resetAt: now + windowMs,
  }
}

/**
 * In-memory rate limit implementation (dev fallback)
 */
function memoryRateLimit(
  identifier: string,
  windowMs: number,
  maxRequests: number
): RateLimitResult {
  const now = Date.now()
  const entry = memoryStore.get(identifier)

  if (!entry || now > entry.resetAt) {
    memoryStore.set(identifier, { count: 1, resetAt: now + windowMs })
    return { success: true, remaining: maxRequests - 1, resetAt: now + windowMs }
  }

  entry.count++

  if (entry.count > maxRequests) {
    return { success: false, remaining: 0, resetAt: entry.resetAt }
  }

  return { success: true, remaining: maxRequests - entry.count, resetAt: entry.resetAt }
}

export function rateLimit(
  identifier: string,
  options: RateLimitOptions = {}
): RateLimitResult {
  const windowMs = options.windowMs ?? DEFAULT_WINDOW_MS
  const maxRequests = options.maxRequests ?? DEFAULT_MAX_REQUESTS

  // When supported, return a synchronous-compatible wrapper.
  // For true async support, middleware would need to be async (not currently supported by Next.js middleware).
  // For now, use in-memory in middleware and KV in API routes via the async variant.
  return memoryRateLimit(identifier, windowMs, maxRequests)
}

/**
 * Async variant for use in API routes (supports Vercel KV).
 * Use this inside Route Handlers (e.g., `export async function GET()`).
 */
export async function rateLimitAsync(
  identifier: string,
  options: RateLimitOptions = {}
): Promise<RateLimitResult> {
  const windowMs = options.windowMs ?? DEFAULT_WINDOW_MS
  const maxRequests = options.maxRequests ?? DEFAULT_MAX_REQUESTS

  if (isKvConfigured()) {
    return kvRateLimit(identifier, windowMs, maxRequests)
  }
  
  return memoryRateLimit(identifier, windowMs, maxRequests)
}

/**
 * Extract a rate limit key from a request — uses IP or user ID.
 */
export function getRateLimitKey(request: {
  headers: { get: (name: string) => string | null }
  auth?: { userId?: string }
}): string {
  // Prefer authenticated user ID
  if (request.auth?.userId) return `user:${request.auth.userId}`
  // Fall back to IP via headers
  const forwarded = request.headers.get("x-forwarded-for")
  const ip = forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown"
  return `ip:${ip}`
}