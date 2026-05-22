/**
 * ──────────────────────────────────────────────────────────────────────
 * AI Helper: Z.AI — Product Descriptions, SEO, Competitor Analysis,
 *             Returns Review  (model=glm-4.5-flash, free-quota)
 * Router: src/lib/ai/index.ts  uses this for product_description,
 *         seo_optimization, competitor_analysis, returns_review
 * Env var: ZAI_API_KEY
 * Get key: https://z.ai/manage-apikey/apikey-list
 * ──────────────────────────────────────────────────────────────────────
 * API endpoint:  https://api.z.ai/api/paas/v4/chat/completions
 * Models:  glm-5.1, glm-5-turbo, glm-5, glm-4.7, glm-4.7-flash,
 *          glm-4.5-flash (used here — free tier)
 */
const ZAI_URL = 'https://api.z.ai/api/paas/v4/chat/completions'
const MODEL   = 'glm-4.5-flash'
const MAX_TOKENS = 1024

// ── input / output types ──────────────────────────────────────────────

export interface ProductDescriptionInput {
  productName: string
  niche: string
  features: string[]
  priceRange: { min: number; max: number }
  targetAudience?: string
}
export interface SEOInput {
  productName: string
  niche: string
  currentDescription?: string
  targetKeywords?: string[]
}
export interface CompetitorProduct {
  competitorName: string
  productName: string
  url: string
  currentPrice: number
  ourPrice?: number
}
export interface ReturnRequest {
  id: string
  productName: string
  customer: string
  reason: string
  amount: number
  notes?: string
}

interface GeneratedDescription {
  title: string
  shortDescription: string
  longDescription: string
  bulletPoints: string[]
  seoKeywords: string[]
}
interface SEOOptimization {
  optimizedTitle: string
  metaDescription: string
  h1Heading: string
  recommendedKeywords: string[]
  contentSuggestions: string[]
}

// ── low-level HTTP helper ──────────────────────────────────────────────

function postZAI(messages: Array<{ role: string; content: string }>, maxTokens = MAX_TOKENS, temperature = 0.4, timeoutMs = 60_000): Promise<string> {
  return (async function zaiPost() {
    var timedOut = false
    var timer = setTimeout(function () { timedOut = true }, timeoutMs)
    var ctrl  = new AbortController()
    try {
      var res = await fetch(ZAI_URL, {
        signal: ctrl.signal,
        method:  'POST',
        headers: {
          'Authorization': 'Bearer ' + String(process.env.ZAI_API_KEY ?? ''),
          'Content-Type':  'application/json',
        },
        body: JSON.stringify({ model: MODEL, messages, temperature, max_tokens: maxTokens }),
      })
      if (timedOut) throw new Error('Z.AI request timed out after ' + timeoutMs + 'ms')
      if (!res.ok) {
        var body = await res.json().catch(function () { return {} })
        throw new Error('Z.AI ' + res.status + ': ' + (body.error?.message || body.error?.code || 'unknown error'))
      }
      var data  = await res.json()
      var text  = data.choices?.[0]?.message?.content ?? ''
      if (!text.trim()) throw new Error('Empty response from Z.AI model')
      return text
    } catch (err) {
      throw err
    } finally {
      clearTimeout(timer)
    }
  })()
}

// ── JSON response parser ───────────────────────────────────────────────
//
// Z.AI GLM sometimes wraps responses in fences or appends prose after
// the closing brace.  This helper strips fences, finds the outermost
// balanced JSON value, and parses it.  Trailing prose is discarded.

function extractJson(raw: string): string {
  var s = raw.replace(/^```(?:json)?\s*\n?/m, '').replace(/\n?```\s*$/m, '').trim()
  // find outermost balanced { … } or [ … ]
  var openCh = s.indexOf('{'), bracketCh = s.indexOf('['), useOpen = -1, end = -1
  if (openCh !== -1 && (bracketCh === -1 || openCh < bracketCh)) { useOpen = openCh }
  else if (bracketCh !== -1) { useOpen = bracketCh }
  if (useOpen === -1) return s
  var depth = 0, inStr = false, esc = false
  for (var i = useOpen; i < s.length; i++) {
    var c = s[i]
    if (esc) { esc = false; continue }
    if (c === '\\' && inStr) { esc = true; continue }
    if (c === '"' && !esc) { inStr = !inStr; continue }
    if (inStr) continue
    if (c === '{' || c === '[') depth++
    else if (c === '}' || c === ']') { depth--; if (depth === 0) { end = i + 1; break } }
  }
  return end === -1 ? s : s.slice(useOpen, end)
}

function parseJson(raw: string): unknown {
  try { return JSON.parse(extractJson(raw)) } catch (e: any) {
    throw new Error('JSON parse failed: ' + (e.message || String(e)))
  }
}

// ── 1 · Product Description ────────────────────────────────────────────

export async function generateProductDescriptionWithZAI(input: ProductDescriptionInput): Promise<GeneratedDescription> {
  var prompt =
    'You are an expert e-commerce copywriter. Create a high-converting product description.\n\n' +
    'Product: ' + input.productName + '\n' +
    'Niche: ' + input.niche + '\n' +
    'Key Features: ' + input.features.join(', ') + '\n' +
    'Price Range: $' + input.priceRange.min + ' - $' + input.priceRange.max + '\n' +
    'Target Audience: ' + (input.targetAudience || 'General consumers') + '\n\n' +
    'Return ONLY this JSON — no fences, no extra text:\n' +
    JSON.stringify({
      title: 'SEO-optimised product title (max 70 chars)',
      shortDescription: 'Compelling 1-2 sentence summary',
      longDescription: 'Persuasive 150-200 word description',
      bulletPoints: ['benefit 1', 'benefit 2', 'benefit 3', 'benefit 4', 'benefit 5'],
      seoKeywords: ['keyword1', 'keyword2', 'keyword3', 'keyword4'],
    }, null, 2)
  var text = await postZAI([{ role: 'user', content: prompt }])
  return parseJson(text) as GeneratedDescription
}

// ── 2 · SEO Optimisation ───────────────────────────────────────────────

export async function optimizeSEOWithZAI(input: SEOInput): Promise<SEOOptimization> {
  var prompt =
    'You are an expert SEO specialist. Optimise this product listing for search engines.\n\n' +
    'Product: ' + input.productName + '\n' +
    'Niche: ' + input.niche + '\n' +
    (input.currentDescription ? 'Current Description: ' + input.currentDescription + '\n' : '') +
    (input.targetKeywords   ? 'Target Keywords: ' + input.targetKeywords.join(', ') + '\n' : '') +
    'Return ONLY this JSON — no fences, no extra text:\n' +
    JSON.stringify({
      optimizedTitle: 'SEO title under 60 characters',
      metaDescription: 'Compelling meta description (150-160 chars)',
      h1Heading: 'Main heading for the page',
      recommendedKeywords: ['keyword1', 'keyword2', 'keyword3', 'keyword4', 'keyword5'],
      contentSuggestions: ['suggestion1', 'suggestion2', 'suggestion3'],
    }, null, 2)
  var text = await postZAI([{ role: 'user', content: prompt }])
  return parseJson(text) as SEOOptimization
}

// ── 3 · Competitor Analysis ────────────────────────────────────────────

export async function generateCompetitorAnalysisWithZAI(competitors: CompetitorProduct[]): Promise<string> {
  var list = competitors.map(function (c) {
    return 'Competitor: ' + c.competitorName +
           ' | Product: ' + c.productName +
           ' | Site: ' + c.url +
           ' | Their Price: $' + c.currentPrice +
           ' | Our Price: $' + String(c.ourPrice ?? 'N/A')
  }).join('\n')
  var prompt =
    'You are a competitive intelligence analyst. Here are the tracked competitors:\n\n' +
    list + '\n\n' +
    'Provide a concise analysis (200-300 words) covering:\n' +
    '1. Key pricing threats\n' +
    '2. Market positioning gaps\n' +
    '3. Recommended pricing and marketing actions\n\n' +
    'Return the analysis as plain text only — no JSON, no formatting.'
  return await postZAI([{ role: 'user', content: prompt }], 800, 0.3)
}

// ── 4 · Returns Review ─────────────────────────────────────────────────

export async function reviewReturnsWithZAI(returns: ReturnRequest[]): Promise<string> {
  var list = returns.map(function (r) {
    return r.id + ' | ' + r.productName + ' | Customer: ' + r.customer +
           ' | Reason: ' + r.reason + ' | Amount: $' + r.amount +
           ' | Notes: ' + String(r.notes ?? 'none')
  }).join('\n')
  var prompt =
    'You are a returns analyst. Decide APPROVE, DENY or MANUAL REVIEW for each return.\n' +
    'Give confidence HIGH/MEDIUM/LOW and a single-sentence reason.\n\n' +
    'Format each decision as:\n' +
    'Return ID: <id>\n' +
    'Recommendation: <approve/deny/manual review>\n' +
    'Confidence: <high/medium/low>\n' +
    'Reason: <one line reason>\n\n' +
    'Returns:\n' +
    list
  return await postZAI([{ role: 'user', content: prompt }], 800, 0.1)
}

// ── health probe ───────────────────────────────────────────────────────

export async function pingZAI(): Promise<{ ok: boolean; status: number; detail: string }> {
  var key = String(process.env.ZAI_API_KEY ?? '')
  try {
    var res = await fetch(ZAI_URL, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + key,
        'Content-Type':  'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: 'user', content: 'Reply with exactly: ZAI_OK' }],
        max_tokens: 20,
      }),
    })
    var body = await res.json().catch(function () { return {} })
    if (res.status === 200) return { ok: true, status: 200, detail: 'Z.AI ' + MODEL + ' responding normally' }
    return { ok: false, status: res.status, detail: body.error?.message || JSON.stringify(body).slice(0, 200) }
  } catch (e: any) {
    return { ok: false, status: 0, detail: e.message }
  }
}
