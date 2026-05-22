import { NextRequest, NextResponse } from 'next/server'

const GLOBAL_KEY = '__dropease_finance_store__'

interface FinanceStore {
  productCosts: Array<{ productId: string; cogs: number; shipping: number; otherCost: number }>
  adSpend: Array<{ provider: string; spend: number; period: string }>
  currency: string
  fxRate: number
}

function getFinanceStore(): FinanceStore {
  const g = globalThis as typeof globalThis & { [GLOBAL_KEY]?: FinanceStore }
  if (!g[GLOBAL_KEY]) {
    g[GLOBAL_KEY] = { productCosts: [], adSpend: [], currency: 'USD', fxRate: 1 }
  }
  return g[GLOBAL_KEY]!
}

export async function GET(request: NextRequest) {
  const action = request.nextUrl.searchParams.get('action')
  const store = getFinanceStore()
  if (action === 'forecast') {
    const base = store.productCosts.length * 120 || 500
    return NextResponse.json({
      forecast: [
        { month: 'Jun', revenue: base * 1.1, net: base * 0.25 },
        { month: 'Jul', revenue: base * 1.2, net: base * 0.28 },
        { month: 'Aug', revenue: base * 1.15, net: base * 0.26 },
      ],
    })
  }
  return NextResponse.json(store)
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const g = globalThis as typeof globalThis & { [GLOBAL_KEY]?: FinanceStore }
    g[GLOBAL_KEY] = { ...getFinanceStore(), ...body }
    return NextResponse.json(g[GLOBAL_KEY])
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}
