export type JobPayload = Record<string, unknown>

export interface QueueJob {
  id: string
  type: string
  payload: JobPayload
  status: 'pending' | 'running' | 'failed' | 'completed'
  attempts: number
  maxAttempts: number
  lastError?: string
  nextRetryAt?: number
  createdAt: string
  completedAt?: string
}

const GLOBAL_KEY = '__dropease_queue__'
const MAX_ATTEMPTS = 5
const BASE_DELAY_MS = 500

function getJobs(): QueueJob[] {
  const g = globalThis as typeof globalThis & { [GLOBAL_KEY]?: QueueJob[] }
  if (!g[GLOBAL_KEY]) g[GLOBAL_KEY] = []
  return g[GLOBAL_KEY]!
}

export function enqueueJob(type: string, payload: JobPayload = {}, maxAttempts = MAX_ATTEMPTS) {
  const job: QueueJob = {
    id: crypto.randomUUID(),
    type,
    payload,
    status: 'pending',
    attempts: 0,
    maxAttempts,
    createdAt: new Date().toISOString(),
  }
  getJobs().push(job)
  return job
}

function backoffMs(attempt: number) {
  return BASE_DELAY_MS * Math.pow(2, attempt)
}

async function runJob(job: QueueJob) {
  await new Promise((r) => setTimeout(r, 200))
  if (job.type === 'import' || job.type === 'export') {
    // simulate streaming bulk work
    const chunks = (job.payload.chunks as number) || 3
    for (let i = 0; i < chunks; i++) {
      await new Promise((r) => setTimeout(r, 50))
    }
  }
}

export async function processJobs() {
  const jobs = getJobs()
  const now = Date.now()
  const processed: QueueJob[] = []

  for (const job of jobs) {
    if (job.status === 'completed') continue
    if (job.status === 'failed' && job.nextRetryAt && job.nextRetryAt > now) continue
    if (job.attempts >= job.maxAttempts && job.status === 'failed') continue

    job.status = 'running'
    job.attempts += 1
    try {
      await runJob(job)
      job.status = 'completed'
      job.completedAt = new Date().toISOString()
      job.lastError = undefined
    } catch (e) {
      job.lastError = (e as Error).message
      if (job.attempts >= job.maxAttempts) {
        job.status = 'failed'
      } else {
        job.status = 'failed'
        job.nextRetryAt = now + backoffMs(job.attempts)
      }
    }
    processed.push({ ...job })
  }
  return processed
}

export function listJobs() {
  return [...getJobs()]
}

export function getJobStats() {
  const jobs = getJobs()
  return {
    total: jobs.length,
    pending: jobs.filter((j) => j.status === 'pending').length,
    running: jobs.filter((j) => j.status === 'running').length,
    failed: jobs.filter((j) => j.status === 'failed').length,
    completed: jobs.filter((j) => j.status === 'completed').length,
  }
}

export default { enqueueJob, processJobs, listJobs, getJobStats }
