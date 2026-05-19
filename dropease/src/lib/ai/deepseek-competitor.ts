/**
 * ──────────────────────────────────────────────────────────────────────
 * AI Helper: DeepSeek  →  Competitor Analysis
 * Used by: Competitors page
 * Env var required: DEEPSEEK_API_KEY
 * Get key: https://platform.deepseek.com
 * ──────────────────────────────────────────────────────────────────────
 * DeepSeek - Competitive intelligence, market gap analysis
 * Best for: Strategic insights, pricing-positioning recommendations
 */
import type { CompetitorProduct } from '@/types'

/**
 * Generate a SWOT-style competitor strategy brief using DeepSeek
 */
export async function generateCompetitorAnalysisWithDeepSeek(
  competitors: CompetitorProduct[]
) {
  const key = process.env.DEEPSEEK_API_KEY
  if (!key) throw new Error('DEEPSEEK_API_KEY not configured')

  const list = competitors
    .map(
      (c) =>
        `- Competitor: ${c.competitorName} | Product: ${c.productName} | Site: ${c.url} | Their Price: $${c.currentPrice} | Our Price: $${c.ourPrice ?? 'N/A'}`
    )
    .join('\n')

  const prompt = `You are a competitive intelligence analyst. Here are the tracked competitors:

${list}

Provide a concise strategic analysis (200-300 words) covering:
1. Key pricing threats
2. Market positioning gaps
3. Recommended pricing and marketing actions

Return ONLY the analysis as plain text.`

  const res = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 600,
    }),
  })

  if (!res.ok) throw new Error('DeepSeek API error')

  const data = await res.json()
  return data.choices?.[0]?.message?.content ?? 'No analysis returned.'
}
