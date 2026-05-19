export interface QueueJob {
  id: string
  type: string
  payload: Record<string, unknown>
  status: 'pending' | 'running' | 'failed' | 'completed'
  attempts: number
  lastError?: string
  nextRetryAt?: string
}

const queue: QueueJob[] = []

export function enqueueJob(type: string, payload: Record<string, unknown>) {
  const job: QueueJob = {
    id: crypto.randomUUID(),
    type,
    payload,
    status: 'pending',
    attempts: 0,
  }
  queue.push(job)
  return job
}

export function getQueueJobs(): QueueJob[] {
  return [...queue]
}

export async function processQueue() {
  for (const job of queue.filter((item) => item.status === 'pending' || item.status === 'failed')) {
    job.status = 'running'
    job.attempts += 1
    try {
      await new Promise((resolve) => setTimeout(resolve, 200))
      job.status = 'completed'
      job.lastError = undefined
      job.nextRetryAt = undefined
    } catch (error) {
      job.status = 'failed'
      job.lastError = (error as Error).message
      job.nextRetryAt = new Date(Date.now() + Math.pow(2, job.attempts) * 1000).toISOString()
    }
  }
  return getQueueJobs()
}

export function clearQueue() {
  queue.length = 0
}
