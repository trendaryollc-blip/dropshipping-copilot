import { NextRequest, NextResponse } from 'next/server'
import {
  getAutomationRules,
  getAutomationRuleById,
  createAutomationRule,
  updateAutomationRule,
  deleteAutomationRule,
  enableAutomationRule,
  disableAutomationRule,
  getActiveAutomationRules,
  getAutomationRulesByType,
  getFulfillmentRules,
  getPriceMonitoringRules,
  getEmailMarketingRules,
  getInventoryRules
} from '@/lib/services/automation-service'
import type { AutomationRule } from '@/types'

// GET /api/automation - Get all automation rules or filtered rules
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type')
    const active = searchParams.get('active')
    const id = searchParams.get('id')

    if (id) {
      const rule = await getAutomationRuleById(id)
      if (!rule) {
        return NextResponse.json({ error: 'Automation rule not found' }, { status: 404 })
      }
      return NextResponse.json(rule)
    }

    if (active === 'true') {
      const rules = await getActiveAutomationRules()
      return NextResponse.json(rules)
    }

    if (type === 'fulfillment') {
      const rules = await getFulfillmentRules()
      return NextResponse.json(rules)
    }

    if (type === 'price_monitoring') {
      const rules = await getPriceMonitoringRules()
      return NextResponse.json(rules)
    }

    if (type === 'email_marketing') {
      const rules = await getEmailMarketingRules()
      return NextResponse.json(rules)
    }

    if (type === 'inventory') {
      const rules = await getInventoryRules()
      return NextResponse.json(rules)
    }

    if (type) {
      const rules = await getAutomationRulesByType(type as AutomationRule['type'])
      return NextResponse.json(rules)
    }

    const rules = await getAutomationRules()
    return NextResponse.json(rules)
  } catch (error) {
    console.error('Error fetching automation rules:', error)
    return NextResponse.json(
      { error: 'Failed to fetch automation rules', message: (error as Error).message },
      { status: 500 }
    )
  }
}

// POST /api/automation - Create a new automation rule
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...ruleData } = body as AutomationRule

    // Validate required fields
    if (!ruleData.type || !ruleData.name) {
      return NextResponse.json(
        { error: 'Missing required fields: type, name' },
        { status: 400 }
      )
    }

    const ruleId = await createAutomationRule(ruleData)
    return NextResponse.json({ id: ruleId, ...ruleData }, { status: 201 })
  } catch (error) {
    console.error('Error creating automation rule:', error)
    return NextResponse.json(
      { error: 'Failed to create automation rule', message: (error as Error).message },
      { status: 500 }
    )
  }
}

// PUT /api/automation - Update an automation rule
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, enable, disable, ...updates } = body as Partial<AutomationRule> & { id?: string; enable?: boolean; disable?: boolean }

    if (!id) {
      return NextResponse.json({ error: 'Automation rule ID is required' }, { status: 400 })
    }

    if (enable === true) {
      await enableAutomationRule(id)
      return NextResponse.json({ id, enabled: true, status: 'active' })
    }

    if (disable === true) {
      await disableAutomationRule(id)
      return NextResponse.json({ id, enabled: false, status: 'paused' })
    }

    await updateAutomationRule(id, updates)
    return NextResponse.json({ id, ...updates })
  } catch (error) {
    console.error('Error updating automation rule:', error)
    return NextResponse.json(
      { error: 'Failed to update automation rule', message: (error as Error).message },
      { status: 500 }
    )
  }
}

// DELETE /api/automation - Delete an automation rule
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Automation rule ID is required' }, { status: 400 })
    }

    await deleteAutomationRule(id)
    return NextResponse.json({ message: 'Automation rule deleted successfully' })
  } catch (error) {
    console.error('Error deleting automation rule:', error)
    return NextResponse.json(
      { error: 'Failed to delete automation rule', message: (error as Error).message },
      { status: 500 }
    )
  }
}
