/**
 * DeepSeek AI integration — powers SEO Optimization
 * Free tier: ¥5M token free quota (strong at structured analysis)
 */

export interface SEOInput {
  productName: string
  niche?: string
  targetKeywords?: string[]
}

const DEEPSEEK_API = 'https://api.deepseek.com/v1/chat/completions'

async function callDeepSeek(messages: Array<{ role: string; content: string }>): Promise<string> {
  const apiKey = process.env.DEEPSEEK_API_KEY
  if (!apiKey) throw new Error('DEEPSEEK_API_KEY not configured')

  const res = await fetch(DEEPSEEK_API, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages,
      max_tokens: 800,
      temperature: 0.3,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`DeepSeek API error: ${res.status} ${err}`)
  }

  const data = await res.json()
  return data.choices?.[0]?.message?.content?.trim() || ''
}

export async function optimizeSEO(input: SEOInput): Promise<{ optimizedTitle: string; metaDescription: string }> {
  const { productName, niche, targetKeywords } = input

  const messages = [
    {
      role: 'system',
      content: 'You are an SEO expert specializing in e-commerce product listings. Return only valid JSON with "optimizedTitle" and "metaDescription" fields.',
    },
    {
      role: 'user',
      content: `Generate SEO-optimized meta tags for:
Product: ${productName}
Category: ${niche || 'General'}
Target Keywords: ${targetKeywords?.join(', ') || 'Auto-detect'}

Requirements:
- Title: 50-60 characters, include main keyword
- Meta Description: 150-160 characters, compelling with CTA
- Include primary keyword near the beginning`,
    },
  ]

  const result = await callDeepSeek(messages)
  
  try {
    const parsed = JSON.parse(result)
    return {
      optimizedTitle: parsed.optimizedTitle || parsed.title || productName,
      metaDescription: parsed.metaDescription || parsed.description || '',
    }
  } catch {
    // Fallback: extract from text
    const lines = result.split('\n')
    return {
      optimizedTitle: lines[0]?.replace(/^Title[:\s]*/i, '').trim() || productName,
      metaDescription: lines[1]?.replace(/^Description[:\s]*/i, '').trim() || '',
    }
  }
}