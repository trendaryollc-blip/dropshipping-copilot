import { NextRequest, NextResponse } from 'next/server'

const OPENAPI = {
  openapi: '3.0.3',
  info: {
    title: 'DropEase Public API',
    version: '2.0.0',
    description: 'REST API for DropEase dropshipping automation platform',
  },
  servers: [{ url: '/api', description: 'Current deployment' }],
  paths: {
    '/products': { get: { summary: 'List products' }, post: { summary: 'Create product' } },
    '/orders': { get: { summary: 'List orders' }, post: { summary: 'Create order' } },
    '/suppliers': { get: { summary: 'List suppliers' } },
    '/customers': { get: { summary: 'List CRM contacts' }, put: { summary: 'Bulk upsert contacts' }, post: { summary: 'Create contact or activity' } },
    '/crm/email': { post: { summary: 'Send CRM email' } },
    '/crm/sms': { post: { summary: 'Send CRM SMS' } },
    '/reviews': { get: { summary: 'List reviews' }, post: { summary: 'Create review' }, put: { summary: 'Update review' } },
    '/finance': { get: { summary: 'Finance state / forecast' }, put: { summary: 'Update finance state' } },
    '/shipping/rates': { post: { summary: 'Real-time shipping rates by zone' } },
    '/webhooks': { get: { summary: 'List webhooks' }, post: { summary: 'Register webhook' } },
    '/webhooks/trigger': { post: { summary: 'Trigger webhook delivery' } },
    '/queue/enqueue': { post: { summary: 'Enqueue background job' } },
    '/queue/process': { get: { summary: 'Process queue with retry/backoff' } },
    '/trendaryo/sync-prices': { post: { summary: 'Sync prices from Trendaryo' } },
    '/automation': { get: { summary: 'Automation rules' } },
  },
  components: {
    securitySchemes: {
      ApiKeyAuth: { type: 'apiKey', in: 'header', name: 'x-api-key' },
    },
  },
}

export async function GET(request: NextRequest) {
  const format = request.nextUrl.searchParams.get('format')
  if (format === 'openapi' || format === 'json') {
    return NextResponse.json(OPENAPI)
  }
  return NextResponse.json({
    title: OPENAPI.info.title,
    version: OPENAPI.info.version,
    openapi: '/api/docs?format=openapi',
    endpoints: Object.entries(OPENAPI.paths).flatMap(([path, methods]) =>
      Object.keys(methods).map((method) => ({
        method: method.toUpperCase(),
        path: `/api${path}`,
        summary: (methods as Record<string, { summary: string }>)[method].summary,
      }))
    ),
  })
}
