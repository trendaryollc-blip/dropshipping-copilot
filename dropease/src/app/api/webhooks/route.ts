import { NextRequest, NextResponse } from 'next/server'
import webhooksStore from '@/lib/server/webhooks-store'

export async function GET() {
  return NextResponse.json({ subscriptions: webhooksStore.listSubscriptions() })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { provider, url } = body || {}
  if (!provider || !url) {
    return NextResponse.json({ error: 'provider and url are required' }, { status: 400 })
  }
  const subscription = webhooksStore.addSubscription(provider, url)
  return NextResponse.json({ subscription, success: true })
}
