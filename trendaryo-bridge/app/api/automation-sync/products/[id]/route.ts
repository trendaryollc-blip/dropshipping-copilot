import { NextRequest, NextResponse } from 'next/server'
import { verifyDropeaseApiKey, unauthorized } from '../../_lib/auth'
import { getAdminDb } from '../../_lib/firebase-admin'

/** PATCH /api/automation-sync/products/:id — update price/stock */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!verifyDropeaseApiKey(request)) return unauthorized()
  const { id } = await params
  try {
    const body = (await request.json()) as { price?: number; stock?: number }
    const updates: Record<string, unknown> = { updatedAt: new Date().toISOString() }
    if (body.price !== undefined) updates.price = body.price
    if (body.stock !== undefined) updates.stock = body.stock
    updates.automationLastSyncedAt = new Date().toISOString()
    updates.automationSource = 'dropease'

    await getAdminDb().collection('products').doc(id).update(updates)
    return NextResponse.json({ success: true, id })
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}
