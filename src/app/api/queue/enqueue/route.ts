import { NextRequest, NextResponse } from 'next/server'
import queue from '@/lib/server/queue'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, payload } = body || {}
    if (!type) return NextResponse.json({ error: 'type required' }, { status: 400 })
    const job = queue.enqueueJob(type, payload)
    return NextResponse.json({ job })
  } catch (e) {
    return NextResponse.json({ error: 'failed to enqueue' }, { status: 500 })
  }
}
