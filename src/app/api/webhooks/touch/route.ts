import { NextRequest, NextResponse } from 'next/server'
import webhooksStore from '@/lib/server/webhooks-store'

export async function POST(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const id = url.searchParams.get('id')
    if (!id) {
      const body = await request.json()
      if (!body?.id) return NextResponse.json({ error: 'id required' }, { status: 400 })
      webhooksStore.touchSubscription(body.id)
      return NextResponse.json({ ok: true })
    }
    webhooksStore.touchSubscription(id)
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: 'failed to touch subscription' }, { status: 500 })
  }
}
