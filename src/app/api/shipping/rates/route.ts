import { NextRequest, NextResponse } from 'next/server'

const ZONE_MULTIPLIERS: Record<string, number> = {
  domestic: 1,
  eu: 1.35,
  asia: 1.5,
  oceania: 1.6,
  americas: 1.2,
}

export async function POST(request: NextRequest) {
  try {
    const { origin, destination, weight, zone = 'domestic', packages = 1 } = await request.json()
    const mult = ZONE_MULTIPLIERS[zone as string] ?? 1.25
    const base = Math.max(3, Math.round((weight || 1) * 2 * mult * packages))
    const rates = [
      { provider: 'UPS', service: 'Ground', cost: Number((base * 0.9).toFixed(2)), estimatedDelivery: '3-5 days', insured: false, zone },
      { provider: 'DHL', service: 'Express', cost: Number((base * 1.2).toFixed(2)), estimatedDelivery: '1-3 days', insured: true, zone },
      { provider: 'FedEx', service: 'Economy', cost: Number((base * 0.8).toFixed(2)), estimatedDelivery: '4-6 days', insured: false, zone },
    ]
    return NextResponse.json({ origin, destination, weight, zone, packages, rates, cached: false })
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}
