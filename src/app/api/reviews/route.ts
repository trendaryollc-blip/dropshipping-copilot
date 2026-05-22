import { NextRequest, NextResponse } from 'next/server'
import { getDataStore } from '@/lib/server/data-store'
import type { ProductReview } from '@/types'

export async function GET() {
  return NextResponse.json({ reviews: getDataStore().reviews })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    if (body.action === 'bulk' && Array.isArray(body.reviews)) {
      getDataStore().reviews = body.reviews as ProductReview[]
      return NextResponse.json({ ok: true, count: body.reviews.length })
    }
    const review: ProductReview = {
      id: `rev_${crypto.randomUUID().slice(0, 8)}`,
      ...body,
      createdAt: body.createdAt || new Date().toISOString(),
      moderated: body.moderated || 'pending',
      replies: body.replies || [],
    }
    getDataStore().reviews.unshift(review)
    return NextResponse.json(review, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...updates } = await request.json()
    const store = getDataStore()
    const idx = store.reviews.findIndex((r) => r.id === id)
    if (idx < 0) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    store.reviews[idx] = { ...store.reviews[idx], ...updates }
    return NextResponse.json(store.reviews[idx])
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}
