/**
 * ──────────────────────────────────────────────────────────────────────
 * AI Helper: DeepSeek  →  Returns AI Auto-Review
 * Used by: Returns page
 * Env var required: DEEPSEEK_API_KEY
 * Get key: https://platform.deepseek.com
 * ──────────────────────────────────────────────────────────────────────
 * DeepSeek - Returns decision assistant
 * Best for: Approve / deny / manual-review recommendations per return item
 */

import type { ReturnRequest } from '@/types'

interface ReturnDecision {
  id: string
  recommendation: 'approve' | 'deny' | 'review'
  confidence: 'high' | 'medium' | 'low'
  reasons: string[]
  suggestedAction: string
}

/**
 * Analyse all pending returns and recommend approve / deny / manual review
 */
export async function analyzeReturnsWithDeepSeek(
  returns: ReturnRequest[]
): Promise<ReturnDecision[]> {
  const key = process.env.DEEPSEEK_API_KEY
  if (!key) throw new Error('DEEPSEEK_API_KEY not configured')

  const list = returns
    .map(
      (r) =>
        `ID: ${r.id} | Product: ${r.productName} | Customer: ${r.customer} | Reason: ${r.reason} | Status: ${r.status} | Amount: $${r.amount} | Notes: ${r.notes ?? 'none'}`
    )
    .join('\n')

  const prompt = `You are a returns analyst. For each return listed, decide whether to APPROVE, DENY, or FLAG FOR MANUAL REVIEW. Rate confidence HIGH/MEDIUM/LOW. Give 2 short reasons and a 1-sentence suggested action.

Return format (one JSON array element per return):
[
  {
    "id": "RET-001",
    "recommendation": "approve",
    "confidence": "high",
    "reasons": ["reason 1", "reason 2"],
    "suggestedAction": "1 sentence action"
  }
]

Returns:
${list}

Return ONLY valid JSON array.`

  const res = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.1,
      max_tokens: 1200,
    }),
  })

  if (!res.ok) {
    const body = (await res.json().catch(() => ({})))
    throw new Error(`DeepSeek API ${res.status}: ${body.error?.message || 'unknown error'}`)
  }

  const data = await res.json()
  const raw = data.choices?.[0]?.message?.content ?? '[]'
  const cleaned = raw.replace(/```json|```/g, '').trim()
  return JSON.parse(cleaned) as ReturnDecision[]
}
