import { NextRequest, NextResponse } from 'next/server'
import { addActivity } from '@/lib/services/customers-service'

export async function POST(request: NextRequest) {
  try {
    const { to, message, customerId } = await request.json()
    if (!to || !message) return NextResponse.json({ error: 'to and message required' }, { status: 400 })

    const result = {
      id: `sms_${crypto.randomUUID().slice(0, 8)}`,
      channel: 'sms' as const,
      to,
      status: 'delivered' as const,
      deliverabilityScore: 91,
      sentAt: new Date().toISOString(),
    }

    if (customerId) {
      await addActivity({ customerId, type: 'sms', title: 'SMS sent', body: message.slice(0, 160) })
    }

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}
