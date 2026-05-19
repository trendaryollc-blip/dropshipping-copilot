import { NextRequest, NextResponse } from 'next/server'
import webhooksStore from '@/lib/server/webhooks-store'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { provider, event, payload } = body || {}
    if (!provider || !event) return NextResponse.json({ error: 'provider and event required' }, { status: 400 })
    const results = await webhooksStore.deliverWebhookToProvider(provider, event, payload)
    return NextResponse.json({ delivered: results.length, results })
  } catch (e) {
    return NextResponse.json({ error: 'failed to trigger webhooks' }, { status: 500 })
  }
}
