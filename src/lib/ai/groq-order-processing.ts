/**
 * ────────────────────────────────────────────────────────────────────────────────
 * AI Helper: Groq  →  Order Processing (auto-approve)  ·  Fraud Detection → Orders
 * Env var required: GROQ_API_KEY
 * Get key: https://console.groq.com
 * ────────────────────────────────────────────────────────────────────────────────
 * Groq - Ultra-fast LLM inference
 * Best for: Real-time order logic, instant fraud flagging
 */
import Groq from 'groq-sdk'

let groq: Groq | null = null

function getGroqClient(): Groq | null {
  if (!process.env.GROQ_API_KEY) return null
  if (!groq) {
    groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    })
  }
  return groq
}

export interface OrderProcessingInput {
  orderId: string
  customerName: string
  totalAmount: number
  items: Array<{ name: string; quantity: number; price: number }>
  shippingCountry?: string
}

interface OrderDecision {
  shouldAutoProcess: boolean
  riskLevel: 'low' | 'medium' | 'high'
  reason: string
  recommendedAction: string
}

/**
 * Auto-process or flag an order using Groq LLM
 */
export async function processOrderWithGroq(
  input: OrderProcessingInput
): Promise<OrderDecision> {
  try {
    const prompt = `You are an expert e-commerce order processing AI. Analyse this order and decide if it should be auto-processed.

Order Details:
- Order ID: ${input.orderId}
- Customer: ${input.customerName}
- Total: $${input.totalAmount}
- Items: ${input.items.map((i) => `${i.name} x${i.quantity}`).join(', ')}
- Shipping Country: ${input.shippingCountry || 'Not specified'}

Respond ONLY with valid JSON:
{
  "shouldAutoProcess": boolean,
  "riskLevel": "low" | "medium" | "high",
  "reason": "short explanation",
  "recommendedAction": "what to do next"
}`

     const client = getGroqClient()
     if (!client) {
       return {
         shouldAutoProcess: false,
         riskLevel: 'medium',
         reason: 'GROQ_API_KEY not configured - manual review required',
         recommendedAction: 'Send to manual review queue',
       }
     }
     const completion = await client.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.1,
      max_tokens: 300,
    })

    const response = completion.choices[0]?.message?.content
    if (!response) throw new Error('No response from Groq')

    const parsed = JSON.parse(response)
    return parsed as OrderDecision
  } catch (error) {
    console.error('Groq Order Processing Error:', error)
    return {
      shouldAutoProcess: false,
      riskLevel: 'medium',
      reason: 'AI analysis failed - manual review required',
      recommendedAction: 'Send to manual review queue',
    }
  }
}
