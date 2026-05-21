export type JobPayload = Record<string, unknown>

export interface QueueJob {
  id: string
  type: string
  payload: JobPayload
  status: 'pending' | 'running' | 'failed' | 'completed'
  attempts: number
  lastError?: string
}

const jobs: QueueJob[] = []

export function enqueueJob(type: string, payload: JobPayload = {}) {
  const job: QueueJob = { id: crypto.randomUUID(), type, payload, status: 'pending', attempts: 0 }
  jobs.push(job)
  return job
}

export async function processJobs() {
  const processed: QueueJob[] = []
  for (const job of jobs.filter(j => j.status === 'pending' || j.status === 'failed')) {
    job.status = 'running'
    job.attempts += 1
    try {
      // Simulate work
      await new Promise(r => setTimeout(r, 200))
      job.status = 'completed'
    } catch (e) {
      job.status = 'failed'
      job.lastError = (e as Error).message
    }
    processed.push({ ...job })
  }
  return processed
}

export function listJobs() { return [...jobs] }

export default { enqueueJob, processJobs, listJobs }
