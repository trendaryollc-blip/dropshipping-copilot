/**
 * ──────────────────────────────────────────────────────────────────────
 * AI Helper: AIMLAPI + Google Gemini  →  Product Description Generator
 * Used in: Products page · Bulk Edit page · Business page
 * Env var: GOOGLE_AI_API_KEY holds the AIMLAPI key
 * Get key: https://aimlapi.com/app/keys
 * ──────────────────────────────────────────────────────────────────────
 */
export interface ProductDescriptionInput {
  productName: string
  niche: string
  features: string[]
  priceRange: { min: number; max: number }
  targetAudience?: string
}

interface GeneratedDescription {
  title: string
  shortDescription: string
  longDescription: string
  bulletPoints: string[]
  seoKeywords: string[]
}

const API_URL = 'https://api.aimlapi.com/v1/chat/completions'
/** AIMLAPI routes `google/gemini-2.0-flash` through their own gateway. */
const MODEL   = 'google/gemini-2.0-flash'

export async function generateProductDescriptionWithGemini(
  input: ProductDescriptionInput
): Promise<GeneratedDescription> {
  const key = String(process.env.GOOGLE_AI_API_KEY ?? '')
  if (!key) throw new Error('GOOGLE_AI_API_KEY (AIMLAPI key) is not set')

  const prompt = `You are an expert e-commerce copywriter. Create a high-converting product description for this item.

Product: ${input.productName}
Niche: ${input.niche}
Key Features: ${input.features.join(', ')}
Price Range: $${input.priceRange.min} - $${input.priceRange.max}
Target Audience: ${input.targetAudience || 'General consumers'}

Return ONLY valid JSON — no markdown fences, no extra text:
{
  "title": "SEO-optimised product title (max 70 chars)",
  "shortDescription": "Compelling 1-2 sentence summary",
  "longDescription": "Persuasive 150-200 word description",
  "bulletPoints": ["benefit 1", "benefit 2", "benefit 3", "benefit 4", "benefit 5"],
  "seoKeywords": ["keyword1", "keyword2", "keyword3", "keyword4"]
}`

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + key,
      'Content-Type':  'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'user', content: prompt },
      ],
      temperature: 0.4,
      max_tokens: 1024,
    }),
  })

  if (!res.ok) {
    const body = (await res.json().catch(() => ({})))
    const msg = body.error?.message || body.message || 'unknown error'
    throw new Error(`AIMLAPI ${res.status}: ${msg}`)
  }

  const data  = await res.json()
  const text  = data.choices?.[0]?.message?.content
  if (!text) throw new Error('Empty response from model')
  const cleaned = text.replace(/```json|```/g, '').trim()
  return JSON.parse(cleaned) as GeneratedDescription
}
