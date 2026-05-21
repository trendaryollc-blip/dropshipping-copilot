/**
 * ──────────────────────────────────────────────────────────────────────
 * AI Helper: Google Gemini  →  Product Description Generator
 * Used by: Products page · Bulk Edit page · Business page
 * Env var required: GOOGLE_AI_API_KEY
 * Get key: https://aistudio.google.com/apikey
 * ──────────────────────────────────────────────────────────────────────
 * Google Gemini - High-Quality Product Description Generation
  * Best for: Long-form, persuasive, SEO-optimised product content
  */
let genAI: unknown = null

function getGeminiClient(): { getGenerativeModel: (cfg: { model: string }) => { generateContent: (prompt: string) => Promise<{ response: { text: () => string }> }> } } {
  if (!genAI) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const GAI = require('@google/generative-ai') as { GoogleGenerativeAI: new (cfg: { apiKey: string }) => { getGenerativeModel: (cfg: { model: string }) => { generateContent: (prompt: string) => Promise<{ response: { text: () => string } > } } } }
    genAI = new GAI.GoogleGenerativeAI({ apiKey: String(process.env.GOOGLE_AI_API_KEY ?? '') })
  }
  return genAI as { getGenerativeModel: (cfg: { model: string }) => { generateContent: (prompt: string) => Promise<{ response: { text: () => string } > } } }
}

interface ProductDescriptionInput {
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

/**
 * Generate a full product description pack using Gemini
 */
export async function generateProductDescriptionWithGemini(
  input: ProductDescriptionInput
): Promise<GeneratedDescription> {
  try {
    const model = getGeminiClient().getGenerativeModel({ model: 'gemini-1.5-flash' })

    const prompt = `You are an expert e-commerce copywriter. Create a high-converting product description for this item.

Product: ${input.productName}
Niche: ${input.niche}
Key Features: ${input.features.join(', ')}
Price Range: $${input.priceRange.min} - $${input.priceRange.max}
Target Audience: ${input.targetAudience || 'General consumers'}

Return ONLY valid JSON:
{
  "title": "SEO-optimised product title (max 70 chars)",
  "shortDescription": "Compelling 1-2 sentence summary",
  "longDescription": "Persuasive 150-200 word description",
  "bulletPoints": ["benefit 1", "benefit 2", "benefit 3", "benefit 4", "benefit 5"],
  "seoKeywords": ["keyword1", "keyword2", "keyword3", "keyword4"]
}`
    const result = await model.generateContent(prompt)
    const response = result.response.text()
    const cleaned = response.replace(/```json|```/g, '').trim()
    return JSON.parse(cleaned) as GeneratedDescription
  } catch (error) {
    console.error('Gemini Description Error:', error)
    return {
      title: input.productName,
      shortDescription: `Premium ${input.niche.toLowerCase()} solution.`,
      longDescription: `Discover the perfect ${input.productName}. Designed for those who value quality and performance.`,
      bulletPoints: input.features.slice(0, 5),
      seoKeywords: [input.niche.toLowerCase(), input.productName.toLowerCase()],
    }
  }
}
