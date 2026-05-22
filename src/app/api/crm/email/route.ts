import { NextRequest, NextResponse } from 'next/server'
import { addActivity } from '@/lib/services/customers-service'

export async function POST(request: NextRequest) {
  try {
    const { to, templateId, customerId, subject, body } = await request.json()
    if (!to) return NextResponse.json({ error: 'to is required' }, { status: 400 })

    const result = {
      id: `msg_${crypto.randomUUID().slice(0, 8)}`,
      channel: 'email' as const,
      to,
      status: 'delivered' as const,
      deliverabilityScore: 94,
      sentAt: new Date().toISOString(),
      subject: subject || `Template: ${templateId || 'custom'}`,
      body: body || 'Email delivered via DropEase CRM',
    }

    if (customerId) {
      await addActivity({
        customerId,
        type: 'email',
        title: `Email: ${result.subject}`,
        body: result.body,
      })
    }

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}
