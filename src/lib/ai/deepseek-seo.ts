/**
 * ──────────────────────────────────────────────────────────────────────
 * AI Helper: DeepSeek  →  SEO Optimization
 * Used by: SEO page
 * Env var required: DEEPSEEK_API_KEY
 * Get key: https://platform.deepseek.com
 * ──────────────────────────────────────────────────────────────────────
 * DeepSeek - Structured SEO data, keyword research, technical content
 * Best for: Keyword-driven SEO output, content strategy suggestions
 */

export interface SEOInput {
  productName: string
  niche: string
  currentDescription?: string
  targetKeywords?: string[]
}

interface SEOOptimization {
  optimizedTitle: string
  metaDescription: string
  h1Heading: string
  recommendedKeywords: string[]
  contentSuggestions: string[]
}

/**
 * Optimise a product listing for search engines using DeepSeek
 */
export async function optimizeSEOWithDeepSeek(
  input: SEOInput
): Promise<SEOOptimization> {
  const key = process.env.DEEPSEEK_API_KEY
  if (!key) throw new Error('DEEPSEEK_API_KEY not configured')

  const prompt = `You are an expert SEO specialist. Optimise this product for search engines.

Product: ${input.productName}
Niche: ${input.niche}
${input.currentDescription ? `Current Description: ${input.currentDescription}` : ''}
${input.targetKeywords ? `Target Keywords: ${input.targetKeywords.join(', ')}` : ''}

Return ONLY valid JSON:
{
  "optimizedTitle": "SEO title under 60 characters",
  "metaDescription": "Compelling meta description (150-160 chars)",
  "h1Heading": "Main heading for the page",
  "recommendedKeywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "contentSuggestions": ["suggestion1", "suggestion2", "suggestion3"]
}`

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
      max_tokens: 800,
    }),
  })

  if (!res.ok) {
    const body = (await res.json().catch(() => ({})))
    throw new Error(`DeepSeek API ${res.status}: ${body.error?.message || 'unknown error'}`)
  }

  const data = await res.json()
  const content = data.choices?.[0]?.message?.content
  if (!content) throw new Error('DeepSeek returned no content in response')
  const parsed = JSON.parse(content.replace(/```json|```/g, '').trim())
  return parsed as SEOOptimization
}
