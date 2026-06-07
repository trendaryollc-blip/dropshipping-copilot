/**
 * ──────────────────────────────────────────────────────────────────────
 * AI Helper: OpenRouter  →  Dynamic Pricing Recommendation
 * Used by: Calculator page
 * Env var required: OPENROUTER_API_KEY
 * Get key: https://openrouter.ai/keys
 * ──────────────────────────────────────────────────────────────────────
 * OpenRouter - Smart pricing recommendation engine
 * Best for: Real-time market-aware pricing, profit margin optimisation
 */
import type { CompetitorProduct } from '@/types'

export interface PricingInput {
  productName: string
  currentPrice: number
  competitorPrices: number[]
  demandScore: number       // 0-100
  inventoryLevel: number    // units in stock
  marginTarget?: number     // target profit margin %
}

interface PricingResult {
  suggestedPrice: number
  priceRange: { min: number; max: number }
  reasoning: string
  confidence: 'high' | 'medium' | 'low'
}

/**
 * Get AI-powered dynamic pricing recommendation via OpenRouter
 */
export async function getDynamicPricingWithOpenRouter(
  input: PricingInput
): Promise<PricingResult> {
  const key = process.env.OPENROUTER_API_KEY
  if (!key) {
    return {
      suggestedPrice: input.currentPrice,
      priceRange: { min: input.currentPrice * 0.8, max: input.currentPrice * 1.2 },
      reasoning: "OpenRouter API key not configured. Using default pricing.",
      confidence: 'low',
    }
  }

  const avgCompetitor = input.competitorPrices.length
    ? input.competitorPrices.reduce((a, b) => a + b, 0) / input.competitorPrices.length
    : input.currentPrice

  const prompt = `You are a pricing strategist for an e-commerce store.

Product: ${input.productName}
Current Price: $${input.currentPrice}
Average Competitor Price: $${avgCompetitor.toFixed(2)}
Demand Score: ${input.demandScore}/100
Inventory Level: ${input.inventoryLevel} units
${input.marginTarget ? `Target Margin: ${input.marginTarget}%` : ''}

Return ONLY valid JSON:
{
  "suggestedPrice": 00.00,
  "priceRange": {"min": 00.00, "max": 00.00},
  "reasoning": "One sentence explaining the price",
  "confidence": "high" | "medium" | "low"
}`

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
      max_tokens: 400,
    }),
  })

  if (!res.ok) throw new Error('OpenRouter API error')

  const data = await res.json()
  const content = data.choices?.[0]?.message?.content ?? '{}'
  const cleaned = content.replace(/```json|```/g, '').trim()
  return JSON.parse(cleaned) as PricingResult
}
