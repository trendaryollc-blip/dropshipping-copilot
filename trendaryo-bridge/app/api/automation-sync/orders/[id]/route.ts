import { NextRequest, NextResponse } from 'next/server'
import { verifyDropeaseApiKey, unauthorized } from '../../_lib/auth'
import { getAdminDb } from '../../_lib/firebase-admin'

/** PATCH /api/automation-sync/orders/:id — update order status */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!verifyDropeaseApiKey(request)) return unauthorized()
  const { id } = await params
  try {
    const { status } = (await request.json()) as { status: string }
    await getAdminDb().collection('orders').doc(id).update({
      status,
      updatedAt: new Date().toISOString(),
    })
    return NextResponse.json({ success: true, id })
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}
