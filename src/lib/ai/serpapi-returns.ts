/**
 * SerpAPI integration — powers Returns Review
 * Gathers return policy data and customer reviews from search results
 * Free tier: 100 searches/month
 */

export interface ReturnRequest {
  id: string
  orderId: string
  productName: string
  customer: string
  reason: string
  status: 'requested' | 'approved' | 'refunded' | 'denied'
  amount: number
  notes?: string
}

const SERPAPI_BASE = 'https://serpapi.com/search'

async function searchReturnPolicy(productName: string): Promise<string> {
  const apiKey = process.env.SERPAPI_API_KEY
  if (!apiKey) {
    return "AI provider not configured. Please add SERPAPI_API_KEY to your environment variables."
  }

  const params = new URLSearchParams({
    q: `${productName} return policy refund`,
    api_key: apiKey,
    engine: 'google',
    num: '3',
  })

  const res = await fetch(`${SERPAPI_BASE}?${params}`)
  if (!res.ok) throw new Error(`SerpAPI error: ${res.status}`)

  const data = await res.json()
  const snippets = data.organic_results?.map((r: any) => r.snippet).filter(Boolean) || []
  return snippets.join('\n') || 'Standard return policy applies.'
}

export async function reviewReturn(input: { returns: ReturnRequest[] }): Promise<string> {
  const { returns } = input
  if (!returns || returns.length === 0) return 'No returns to review.'

  const results: string[] = []

  for (const ret of returns.slice(0, 3)) { // Limit to 3 to save quota
    const policyInfo = await searchReturnPolicy(ret.productName)

    const review = `
## Return Review: ${ret.id} — ${ret.productName}
- **Customer**: ${ret.customer}
- **Reason**: ${ret.reason}
- **Amount**: $${ret.amount.toFixed(2)}
- **Notes**: ${ret.notes || 'None'}
- **Policy Context**: ${policyInfo}

**AI Recommendation**: Based on the request details, this return should be reviewed for ${ret.reason === 'damaged' ? 'immediate approval' : ret.reason === 'changed_mind' ? 'approval with restocking fee consideration' : 'standard processing'}.
`
    results.push(review)
  }

  return results.join('\n---\n')
}

export async function analyzeReturnTrends(input: { returns: ReturnRequest[] }): Promise<string> {
  const { returns } = input
  const reasons = returns.map(r => r.reason)
  const reasonCounts = reasons.reduce((acc: Record<string, number>, r) => {
    acc[r] = (acc[r] || 0) + 1
    return acc
  }, {})

  return `## Return Trends Analysis
- **Total Returns**: ${returns.length}
- **Most Common Reason**: ${Object.entries(reasonCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'}
- **Total Refund Amount**: $${returns.reduce((s, r) => s + r.amount, 0).toFixed(2)}
- **Resolution Rate**: ${returns.filter(r => r.status === 'refunded' || r.status === 'denied').length}/${returns.length}
`
}