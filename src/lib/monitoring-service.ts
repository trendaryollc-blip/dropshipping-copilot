export function initMonitoring(dsn?: string) {
  console.info('Monitoring initialized', { dsn, timestamp: new Date().toISOString() })
}

export function captureException(error: unknown, context?: Record<string, unknown>) {
  console.error('Captured exception', { error, context, timestamp: new Date().toISOString() })
}

export function captureMessage(message: string, context?: Record<string, unknown>) {
  console.info('Captured message', { message, context, timestamp: new Date().toISOString() })
}

export function wrapAsync<T extends Array<unknown>, R>(fn: (...args: T) => Promise<R>) {
  return async (...args: T) => {
    try {
      return await fn(...args)
    } catch (error) {
      captureException(error, { args })
      throw error
    }
  }
}
