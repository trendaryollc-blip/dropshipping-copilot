/**
 * Cohere AI integration — powers Product Descriptions & Competitor Analysis
 * Free tier: 100 req/day trial
 */

export interface ProductDescriptionInput {
  productName: string
  niche: string
  features: string[]
  priceRange: { min: number; max: number }
  targetAudience?: string
  tone?: 'professional' | 'casual' | 'persuasive' | 'playful'
}

export interface CompetitorInput {
  competitors: Array<{ name: string; price: number; rating: number; strengths: string[] }>
}

const COHERE_API = 'https://api.cohere.com/v1/generate'

async function callCohere(prompt: string): Promise<string> {
  const apiKey = process.env.COHERE_API_KEY
  if (!apiKey) {
    // Graceful fallback when called from client-side or key not configured
    if (prompt.includes('description') || prompt.includes('Description')) {
      return "This is a placeholder product description. To generate real AI-powered descriptions, please set COHERE_API_KEY in your .env.local file and restart the dev server."
    }
    return "AI provider not configured. Please add COHERE_API_KEY to your environment variables."
  }

  const res = await fetch(COHERE_API, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'command',
      prompt,
      max_tokens: 500,
      temperature: 0.7,
      stop_sequences: ['---'],
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Cohere API error: ${res.status} ${err}`)
  }

  const data = await res.json()
  return data.generations?.[0]?.text?.trim() || ''
}

export async function generateProductDescription(input: ProductDescriptionInput): Promise<string> {
  const { productName, niche, features, priceRange, targetAudience, tone } = input
  const toneGuide = tone || 'professional'
  
  const prompt = `Write a ${toneGuide} product description for "${productName}" in the "${niche}" category.
Key features: ${features.join(', ')}
Price range: $${priceRange.min} - $${priceRange.max}
${targetAudience ? `Target audience: ${targetAudience}` : ''}

Write an engaging, SEO-friendly product description that highlights benefits and drives conversions.
Use short paragraphs, bullet points for features, and a compelling call to action.

Description:
`

  return callCohere(prompt)
}

export async function analyzeCompetitors(input: CompetitorInput): Promise<string> {
  const competitorsText = input.competitors.map(c =>
    `- ${c.name}: $${c.price}, rating ${c.rating}/5, strengths: ${c.strengths.join(', ')}`
  ).join('\n')

  const prompt = `Analyze the following competitors and provide strategic insights:

${competitorsText}

For each competitor, identify:
1. Their key differentiators
2. Pricing strategy
3. Market positioning
4. Gaps/opportunities for our product

Provide actionable recommendations for outperforming them.

Analysis:
`

  return callCohere(prompt)
}