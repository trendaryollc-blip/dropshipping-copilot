import { NextRequest, NextResponse } from 'next/server'
import { verifyDropeaseApiKey, unauthorized } from '../_lib/auth'
import { getAdminDb } from '../_lib/firebase-admin'

/** GET /api/automation-sync/products — list products for DropEase sync */
export async function GET(request: NextRequest) {
  if (!verifyDropeaseApiKey(request)) return unauthorized()
  try {
    const snap = await getAdminDb().collection('products').get()
    const products = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    return NextResponse.json(products)
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}
