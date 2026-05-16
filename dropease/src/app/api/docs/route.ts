import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    title: 'DropEase Public API',
    version: '1.0',
    endpoints: [
      { method: 'GET', path: '/api/webhooks', description: 'List registered webhook subscriptions' },
      { method: 'POST', path: '/api/webhooks', description: 'Register a new webhook subscription' },
      { method: 'GET', path: '/api/docs', description: 'Public API documentation endpoint' },
    ],
  })
}
