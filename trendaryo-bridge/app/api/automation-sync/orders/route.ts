import { NextRequest, NextResponse } from 'next/server'
import { verifyDropeaseApiKey, unauthorized } from '../_lib/auth'
import { getAdminDb } from '../_lib/firebase-admin'

/** GET /api/automation-sync/orders */
export async function GET(request: NextRequest) {
  if (!verifyDropeaseApiKey(request)) return unauthorized()
  try {
    const snap = await getAdminDb().collection('orders').get()
    const orders = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    return NextResponse.json(orders)
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}

/** POST /api/automation-sync/orders — create order from automation */
export async function POST(request: NextRequest) {
  if (!verifyDropeaseApiKey(request)) return unauthorized()
  try {
    const orderData = await request.json()
    const docRef = await getAdminDb().collection('orders').add({
      ...orderData,
      status: orderData.status ?? 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      automationSource: 'dropease',
    })
    return NextResponse.json({ id: docRef.id, success: true })
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}
