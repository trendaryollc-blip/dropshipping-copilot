import { NextResponse } from 'next/server'

export function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

/** Validates DropEase → Trendaryo `x-api-key` header. */
export function verifyDropeaseApiKey(request: Request): boolean {
  const expected = process.env.DROPEASE_API_KEY
  if (!expected) return false
  const provided = request.headers.get('x-api-key')
  return provided === expected
}
