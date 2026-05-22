import { NextRequest, NextResponse } from 'next/server'
import {
  getCustomers,
  getCustomerById,
  upsertCustomers,
  createCustomer,
  getActivities,
  addActivity,
  getSegments,
  getAutomations,
  getAuditLog,
  getGdprRequests,
  addGdprRequest,
} from '@/lib/services/customers-service'
import type { CustomerProfile } from '@/types'

export async function GET(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get('id')
    const resource = request.nextUrl.searchParams.get('resource')

    if (resource === 'activities') {
      const customerId = request.nextUrl.searchParams.get('customerId') ?? undefined
      return NextResponse.json({ activities: await getActivities(customerId) })
    }
    if (resource === 'segments') return NextResponse.json({ segments: await getSegments() })
    if (resource === 'automations') return NextResponse.json({ automations: await getAutomations() })
    if (resource === 'audit') return NextResponse.json({ audit: await getAuditLog() })
    if (resource === 'gdpr') return NextResponse.json({ requests: await getGdprRequests() })

    if (id) {
      const customer = await getCustomerById(id)
      if (!customer) return NextResponse.json({ error: 'Not found' }, { status: 404 })
      return NextResponse.json(customer)
    }

    const customers = await getCustomers()
    return NextResponse.json({ customers })
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const action = body.action as string | undefined

    if (action === 'activity') {
      const activity = await addActivity(body.activity)
      return NextResponse.json(activity, { status: 201 })
    }
    if (action === 'gdpr') {
      const req = await addGdprRequest(body.request)
      return NextResponse.json(req, { status: 201 })
    }

    const id = await createCustomer(body as Omit<CustomerProfile, 'id'>)
    return NextResponse.json({ id }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const customers = (body.customers || body) as CustomerProfile[]
    await upsertCustomers(customers)
    return NextResponse.json({ ok: true, count: customers.length })
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}
