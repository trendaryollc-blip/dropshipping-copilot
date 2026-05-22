import { NextResponse } from 'next/server'
import { createTrendaryoAPI } from '@/lib/integrations/trendaryo-api'

/**
 * GET /api/trendaryo/test-connection
 * Checks TRENDARYO_API_URL + TRENDARYO_API_KEY against live Trendaryo automation-sync API.
 */
export async function GET() {
  const url = process.env.TRENDARYO_API_URL || ''
  const keySet = Boolean(process.env.TRENDARYO_API_KEY)

  if (!keySet) {
    return NextResponse.json(
      {
        ok: false,
        error: 'TRENDARYO_API_KEY is not set in .env.local',
        hint: 'Run: npm run setup:trendaryo-key',
      },
      { status: 400 },
    )
  }

  if (!url) {
    return NextResponse.json(
      { ok: false, error: 'TRENDARYO_API_URL is not set' },
      { status: 400 },
    )
  }

  const api = createTrendaryoAPI()
  const conn = await api.connect({})

  if (!conn.connected) {
    return NextResponse.json({ ok: false, error: 'API key header missing on client' }, { status: 400 })
  }

  try {
    const products = await api.getAllProducts()
    const count = Array.isArray(products)
      ? products.length
      : (products as { data?: unknown[] })?.data?.length ?? 0
    return NextResponse.json({
      ok: true,
      baseUrl: url,
      endpoint: `${url}/api/automation-sync/products`,
      productCount: count,
      message: 'Connected to Trendaryo automation-sync API',
    })
  } catch (error) {
    const message = (error as Error).message || String(error)
    const is401 = message.includes('401') || message.toLowerCase().includes('unauthorized')
    return NextResponse.json(
      {
        ok: false,
        baseUrl: url,
        error: message,
        hint: is401
          ? 'Keys mismatch: set DROPEASE_API_KEY on trendaryo.com Vercel to the same value as TRENDARYO_API_KEY here.'
          : 'Deploy trendaryo-bridge routes on trendaryo.com (see trendaryo-bridge/README.md)',
      },
      { status: is401 ? 401 : 502 },
    )
  }
}
