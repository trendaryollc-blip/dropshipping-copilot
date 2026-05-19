/**
 * ──────────────────────────────────────────────────────────────────────
 * AI Helper: OpenRouter  →  Returns AI Auto-Review
 * Used by: Returns page
 * Env var required: OPENROUTER_API_KEY
 * Get key: https://openrouter.ai/keys
 * ──────────────────────────────────────────────────────────────────────
 * OpenRouter - Returns decision assistant (alternative to DeepSeek)
 * Best for: Fallback returns analysis, or when using OpenRouter model pool
 */

import type { ReturnRequest } from '@/types'

/**
 * Analyse all pending returns and recommend approve / deny / manual review
 */
export async function reviewReturnsWithOpenRouter(returns: ReturnRequest[]) {
  const key = process.env.OPENROUTER_API_KEY
  if (!key) throw new Error('OPENROUTER_API_KEY not configured')

  const list = returns
    .map(
      (r) =>
        `- ${r.id} | ${r.productName} | Customer: ${r.customer} | Reason: ${r.reason} | Amount: $${r.amount} | Notes: ${r.notes ?? 'none'}`
    )
    .join('\n')

  const prompt = `You are a returns analyst. For each return listed, decide: APPROVE, DENY or MANUAL REVIEW. Give confidence HIGH/MEDIUM/LOW and a 1-line reason.

Format each decision as:
Return ID: <id>
Recommendation: <approve/deny/manual review>
Confidence: <high/medium/low>
Reason: <short reason>

Returns:
${list}`

  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: 'openrouter/auto',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.1,
      max_tokens: 800,
    }),
  })

  if (!res.ok) throw new Error('OpenRouter API error')

  const data = await res.json()
  return data.choices?.[0]?.message?.content ?? 'No analysis returned.'
}
