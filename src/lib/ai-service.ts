"use client"

import { toast } from "sonner"

export interface AIAnalysis {
  productTitle: string
  category: string
  features: string[]
  price: number
  competition: 'low' | 'medium' | 'high'
  trending: boolean
  recommendedPrice: number
  marketDemand: 'low' | 'medium' | 'high'
  keywords: string[]
  competitorPrices: Array<{ name: string; price: number }>
}

export interface AIDescriptionRequest {
  productName: string
  category: string
  features: string[]
  targetAudience: string
  tone: 'professional' | 'casual' | 'persuasive' | 'playful'
  keywords: string[]
}

export interface AIPriceOptimization {
  currentPrice: number
  competitorPrices: number[]
  marketPosition: 'budget' | 'mid-range' | 'premium'
  demandLevel: number
  seasonality: 'high' | 'medium' | 'low'
  recommendedPrice: number
  priceStrategy: string
}

export interface AICompetitorAnalysis {
  topCompetitors: Array<{ name: string; pricingStrategy: string; marketShare: string; strengths: string; weaknesses: string }>
  marketInsights: string
  recommendations: string[]
}

class AIService {
  private apiKey: string | null = null
  private baseUrl = 'https://api.openai.com/v1'

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY || null
  }

  private async callAI(prompt: string): Promise<string> {
    if (!this.apiKey) {
      // Mock AI response for development
      return this.getMockResponse(prompt)
    }

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 1000,
          temperature: 0.7
        })
      })

      const data = await response.json()
      return data.choices[0]?.message?.content || 'AI response unavailable'
    } catch (error) {
      console.error('AI service error:', error)
      toast.error('AI service temporarily unavailable')
      return 'AI service temporarily unavailable'
    }
  }

  private getMockResponse(prompt: string): string {
    if (prompt.includes('analyze product')) {
      return JSON.stringify({
        analysis: {
          trending: true,
          competition: 'medium',
          marketDemand: 'high',
          recommendedPrice: 29.99,
          keywords: ['wireless', 'earbuds', 'bluetooth', 'noise cancelling'],
          competitorPrices: [
            { name: 'Competitor A', price: 34.99 },
            { name: 'Competitor B', price: 27.99 }
          ]
        }
      })
    }

    if (prompt.includes('generate description')) {
      return `Experience premium sound quality with our latest wireless earbuds. Featuring advanced noise cancellation technology, crystal-clear Bluetooth 5.0 connectivity, and up to 8 hours of battery life. Perfect for music lovers, professionals, and anyone who demands superior audio performance on the go.`
    }

    if (prompt.includes('optimize price')) {
      return JSON.stringify({
        currentPrice: 24.99,
        competitorPrices: [19.99, 29.99, 34.99],
        marketPosition: 'mid-range',
        demandLevel: 85,
        seasonality: 'high',
        recommendedPrice: 27.99,
        priceStrategy: 'Competitive pricing with value positioning'
      })
    }

    return 'AI mock response'
  }

  async analyzeProduct(productTitle: string, category: string): Promise<AIAnalysis> {
    const prompt = `Analyze this product for dropshipping: "${productTitle}" in category "${category}". 
    Provide analysis including:
    - Market demand level (low/medium/high)
    - Competition level (low/medium/high) 
    - Trending status (true/false)
    - Recommended price point
    - Target keywords for SEO
    - Competitor price range
    Return as JSON.`

    const response = await this.callAI(prompt)
    
    try {
      return JSON.parse(response)
    } catch {
      // Return mock analysis if JSON parsing fails
      return {
        productTitle,
        category,
        features: ['High Quality', 'Popular Choice', 'Great Value'],
        price: 24.99,
        competition: 'medium',
        trending: true,
        recommendedPrice: 27.99,
        marketDemand: 'high',
        keywords: ['trending', 'bestseller', 'popular'],
        competitorPrices: [
          { name: 'Market Leader', price: 29.99 },
          { name: 'Budget Option', price: 19.99 }
        ]
      }
    }
  }

  async generateDescription(request: AIDescriptionRequest): Promise<string> {
    const prompt = `Generate a compelling product description for:
    Product: ${request.productName}
    Category: ${request.category}
    Features: ${request.features.join(', ')}
    Target Audience: ${request.targetAudience}
    Tone: ${request.tone}
    Keywords: ${request.keywords.join(', ')}
    
    Make it persuasive, highlight key benefits, and include SEO keywords naturally.
    Keep it under 200 words.`

    return this.callAI(prompt)
  }

  async optimizePrice(currentPrice: number, category: string): Promise<AIPriceOptimization> {
    const prompt = `Optimize pricing for a product in ${category} category currently priced at $${currentPrice}.
    Consider:
    - Market positioning
    - Competitor pricing
    - Demand elasticity
    - Profit margins
    - Seasonal factors
    
    Return pricing strategy and recommended price as JSON.`

    const response = await this.callAI(prompt)
    
    try {
      return JSON.parse(response)
    } catch {
      // Return mock optimization if JSON parsing fails
      return {
        currentPrice,
        competitorPrices: [currentPrice * 0.8, currentPrice * 1.2, currentPrice * 1.5],
        marketPosition: 'mid-range',
        demandLevel: 75,
        seasonality: 'medium',
        recommendedPrice: currentPrice * 1.1,
        priceStrategy: 'Value-based pricing with competitive positioning'
      }
    }
  }

  async analyzeCompetition(productTitle: string, category: string): Promise<AICompetitorAnalysis> {
    const prompt = `Analyze competition for "${productTitle}" in ${category} category.
    Provide:
    - Top 3 competitors
    - Their pricing strategies
    - Market share estimates
    - Strengths/weaknesses
    Return as JSON.`

    const response = await this.callAI(prompt)

    try {
      const parsed = JSON.parse(response)
      // Validate minimal shape before returning
      if (parsed && Array.isArray(parsed.topCompetitors)) {
        return parsed as AICompetitorAnalysis
      }
      throw new Error("Missing topCompetitors array in AI response")
    } catch {
      // Return safe mock fallback if JSON parsing fails or shape is invalid
      return {
        topCompetitors: [
          { name: 'Market Leader A', pricingStrategy: 'Premium pricing', marketShare: '30%', strengths: 'Brand recognition', weaknesses: 'High prices' },
          { name: 'Budget Player B', pricingStrategy: 'Low-cost leader', marketShare: '22%', strengths: 'Low prices', weaknesses: 'Poor quality' },
          { name: 'Direct Rival C', pricingStrategy: 'Competitive parity', marketShare: '18%', strengths: 'Fast shipping', weaknesses: 'Limited inventory' },
        ],
        marketInsights: 'Moderate competition with room for differentiation on quality and service.',
        recommendations: [
          'Focus on a specific price-tier gap between premium and budget options',
          'Emphasize faster shipping and better customer support',
          ' Bundle complementary products to increase perceived value',
        ],
      }
    }
  }
}

export const aiService = new AIService()
export default aiService
