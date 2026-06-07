/**
 * ──────────────────────────────────────────────────────────────────────
 * AI Helper: Cloudflare  →  Fraud Detection
 * Used by: Orders page
 * Env vars required: CLOUDFLARE_AI_API_KEY  ·  CLOUDFLARE_ACCOUNT_ID
 * Get token: https://dash.cloudflare.com → Account → API Tokens
 * ──────────────────────────────────────────────────────────────────────
 * Cloudflare Workers AI - Fraud risk scoring
 * Best for: Instant risk flags without reaching a third-party LLM
 */

export interface FraudInput {
  orderAmount: number
  customerEmail: string
  shippingCountry: string
  billingCountry?: string
  itemsCount?: number
}

interface FraudResult {
  riskScore: number          // 0-100
  riskLevel: 'low' | 'medium' | 'high'
  flags: string[]
  recommendation: 'approve' | 'review' | 'block'
}

/**
 * Detect potential order fraud via Cloudflare Workers AI
 */
export async function detectFraudWithCloudflare(
  input: FraudInput
): Promise<FraudResult> {
  const key = process.env.CLOUDFLARE_AI_API_KEY
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID
  if (!key || !accountId) {
    return { riskScore: 0, riskLevel: 'low', flags: [], recommendation: 'approve' }
  }

  const prompt = `You are a fraud analyst. Rate this order 0-100 and return JSON.

Order: $${input.orderAmount} | Email: ${input.customerEmail} | Ship: ${input.shippingCountry}${input.billingCountry ? ` | Bill: ${input.billingCountry}` : ''}

Return ONLY JSON:
{
  "riskScore": 0-100,
  "riskLevel": "low" | "medium" | "high",
  "flags": ["flag1", "flag2"],
  "recommendation": "approve" | "review" | "block"
}`

  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/@cf/meta/llama-3.1-8b-instruct`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, max_tokens: 300 }),
    }
  )

  if (!res.ok) throw new Error('Cloudflare AI error')

  const data = await res.json()
  const content: string = data.result?.response ?? '{}'
  const cleaned = content.replace(/```json|```/g, '').trim()
  return JSON.parse(cleaned) as FraudResult
}
