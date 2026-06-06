/**
 * Mistral AI integration — powers Image Analysis (Pixtral vision)
 * Free tier: 500k tokens
 */

export interface ImageAnalysisInput {
  imageUrl: string
  productName: string
}

const MISTRAL_API = 'https://api.mistral.ai/v1/chat/completions'

async function callMistral(messages: Array<{ role: string; content: string | Array<{ type: string; text?: string; image_url?: { url: string } }> }>): Promise<string> {
  const apiKey = process.env.MISTRAL_API_KEY
  if (!apiKey) throw new Error('MISTRAL_API_KEY not configured')

  const res = await fetch(MISTRAL_API, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'pixtral-12b-2409',
      messages,
      max_tokens: 500,
      temperature: 0.3,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Mistral API error: ${res.status} ${err}`)
  }

  const data = await res.json()
  return data.choices?.[0]?.message?.content?.trim() || ''
}

export async function analyzeProductImage(input: ImageAnalysisInput): Promise<string> {
  const { imageUrl, productName } = input

  const messages = [
    {
      role: 'user',
      content: [
        {
          type: 'text',
          text: `Analyze this product image for "${productName}". Describe:
1. What the product looks like (colors, materials, design)
2. Quality assessment based on the image
3. What setting it's shown in (lifestyle, studio, white background)
4. Suggestions for improving the product photo
5. SEO-friendly alt text suggestion

Be specific and actionable.`,
        },
        {
          type: 'image_url',
          image_url: { url: imageUrl },
        },
      ],
    },
  ]

  return callMistral(messages as any)
}