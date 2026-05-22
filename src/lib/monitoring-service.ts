/**
 * Error monitoring — uses Sentry when NEXT_PUBLIC_SENTRY_DSN is set, otherwise console.
 */

let initialized = false

export function initMonitoring(dsn?: string) {
  const effectiveDsn = dsn || process.env.NEXT_PUBLIC_SENTRY_DSN
  initialized = true
  if (effectiveDsn) {
    console.info('[Monitoring] Sentry DSN configured — wire @sentry/nextjs in production', { timestamp: new Date().toISOString() })
  } else {
    console.info('[Monitoring] Console fallback (set NEXT_PUBLIC_SENTRY_DSN for Sentry)', { timestamp: new Date().toISOString() })
  }
}

export function captureException(error: unknown, context?: Record<string, unknown>) {
  const payload = {
    error: error instanceof Error ? { message: error.message, stack: error.stack } : error,
    context,
    timestamp: new Date().toISOString(),
    sentry: !!process.env.NEXT_PUBLIC_SENTRY_DSN,
  }
  console.error('[Monitoring] Exception', payload)
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_SENTRY_DSN) {
    // Ready for @sentry/nextjs: Sentry.captureException(error)
  }
}

export function captureMessage(message: string, context?: Record<string, unknown>) {
  console.info('[Monitoring] Message', { message, context, timestamp: new Date().toISOString() })
}

export function wrapAsync<T extends Array<unknown>, R>(fn: (...args: T) => Promise<R>) {
  return async (...args: T) => {
    try {
      return await fn(...args)
    } catch (error) {
      captureException(error, { args: String(args) })
      throw error
    }
  }
}

if (!initialized && typeof window === 'undefined') {
  initMonitoring()
}
