export interface RetryPolicy {
  maxRetries: number;
  baseDelayMs: number;
  maxDelayMs: number;
}

export const defaultRetryPolicy: RetryPolicy = {
  maxRetries: 3,
  baseDelayMs: 30_000,
  maxDelayMs: 15 * 60_000,
};

export function getRetryDelay(attempt: number, policy: RetryPolicy = defaultRetryPolicy): number {
  const delay = policy.baseDelayMs * 2 ** Math.max(0, attempt - 1);
  return Math.min(delay, policy.maxDelayMs);
}

export function shouldRetry(attempt: number, policy: RetryPolicy = defaultRetryPolicy): boolean {
  return attempt < policy.maxRetries;
}

export function nextRetryAt(attempt: number, now = new Date(), policy: RetryPolicy = defaultRetryPolicy): string {
  return new Date(now.getTime() + getRetryDelay(attempt, policy)).toISOString();
}
