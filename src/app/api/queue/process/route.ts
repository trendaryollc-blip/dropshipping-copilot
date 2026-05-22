import { NextResponse } from 'next/server'
import queue from '@/lib/server/queue'
import webhooksStore from '@/lib/server/webhooks-store'

export async function GET() {
  try {
    const processed = await queue.processJobs()
    // For any completed sync jobs, trigger webhooks if payload includes provider
    for (const job of processed) {
      if (job.type === 'sync' && job.status === 'completed' && job.payload?.provider) {
        const payload = job.payload as Record<string, unknown>
        await webhooksStore.deliverWebhookToProvider(
          String(payload.provider),
          'integration.sync',
          { info: 'background sync completed', payload },
        )
      }
    }
    return NextResponse.json({ processed })
  } catch (e) {
    return NextResponse.json({ error: 'failed to process queue' }, { status: 500 })
  }
}
