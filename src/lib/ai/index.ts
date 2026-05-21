/**
 * ──────────────────────────────────────────────────────────────────────────────
 * central task router — pick the right AI automatically
 * ──────────────────────────────────────────────────────────────────────────────
 * Task              AI Provider  Key var                   Pages
 * ───────────────── ──────────── ───────────────────────── ───────────────
 * order_processing     GROQ         GROQ_API_KEY            /orders
 * product_description  GOOGLE       GOOGLE_AI_API_KEY       /products
 *                                                                 /bulk-edit
 *                                                                 /business
 * seo_optimization     DEEPSEEK     DEEPSEEK_API_KEY        /seo
 * dynamic_pricing      OPENROUTER   OPENROUTER_API_KEY      /calculator
 *                                                                 /business
 * fraud_detection      CLOUDFLARE   CLOUDFLARE_AI_API_KEY   /orders
 * image_analysis       HUGGINGFACE  HUGGINGFACE_API_KEY     pdts upload
 * competitor_analysis  DEEPSEEK     DEEPSEEK_API_KEY        /competitors
 * returns_review       OPENROUTER   OPENROUTER_API_KEY      /returns
 * ───────────────── ──────────── ───────────────────────── ───────────────
 *
 * Env vars live in .env  (git-ignored).
 * Template guide  : .env.example  (safe to keep in git / PRs / docs).
 */
import type { CompetitorProduct } from '@/types'
import { TASK_AI_MAPPING, type AIProvider } from './config'
export type { AIProvider }
import { processOrderWithGroq, type OrderProcessingInput } from './groq-order-processing'
import { generateProductDescriptionWithGemini, type ProductDescriptionInput } from './gemini-description'
import { optimizeSEOWithDeepSeek, type SEOInput } from './deepseek-seo'
import { getDynamicPricingWithOpenRouter, type PricingInput } from './openrouter-pricing'
import { detectFraudWithCloudflare, type FraudInput } from './cloudflare-fraud'
import { analyzeProductImageWithHuggingFace, type ImageAnalysisInput } from './huggingface-image'
import { generateCompetitorAnalysisWithDeepSeek } from './deepseek-competitor'
import { reviewReturnsWithOpenRouter } from './openrouter-returns'

/**
 * Discriminated union of all runTask input shapes, keyed by task name.
 */
type TaskInput =
  | { task: 'order_processing'; input: OrderProcessingInput }
  | { task: 'product_description'; input: ProductDescriptionInput }
  | { task: 'seo_optimization'; input: SEOInput }
  | { task: 'dynamic_pricing'; input: PricingInput }
  | { task: 'fraud_detection'; input: FraudInput }
  | { task: 'image_analysis'; input: ImageAnalysisInput }
  | { task: 'competitor_analysis'; input: { competitors: CompetitorProduct[] } }
  | { task: 'returns_review'; input: { returns?: unknown[]; competitors?: unknown[] } }

export const AI = {
  /**
   * Automatically routes to the best AI for the given task
   */
  async runTask(task: AutomationTask, input: TaskInput["task"] extends typeof task ? TaskInput["input"] : never) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const anyInput: any = input
    const provider = TASK_AI_MAPPING[task]
    const competitors =
      task === 'competitor_analysis' && Array.isArray(anyInput?.competitors)
        ? anyInput.competitors
        : []

    const result: unknown =
      provider === 'groq' ? processOrderWithGroq(anyInput) :
      provider === 'google' ? generateProductDescriptionWithGemini(anyInput) :
      provider === 'deepseek' ? (
        task === 'competitor_analysis' ? generateCompetitorAnalysisWithDeepSeek(competitors) : optimizeSEOWithDeepSeek(anyInput)
      ) :
      provider === 'openrouter' ? (
        task === 'returns_review' ? reviewReturnsWithOpenRouter(anyInput.returns || anyInput.competitors || []) : getDynamicPricingWithOpenRouter(anyInput)
      ) :
      provider === 'cloudflare' ? detectFraudWithCloudflare(anyInput) :
      provider === 'huggingface' ? analyzeProductImageWithHuggingFace(anyInput) :
      (() => { throw new Error(`No AI provider configured for task: ${task}`) })()

    return result
  },

  // Direct access to individual AIs ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  groq: { processOrder: processOrderWithGroq },
  google: { generateDescription: generateProductDescriptionWithGemini },
  deepseek: { optimizeSEO: optimizeSEOWithDeepSeek, analyzeCompetitors: generateCompetitorAnalysisWithDeepSeek },
  openrouter: { getPricing: getDynamicPricingWithOpenRouter, reviewReturns: reviewReturnsWithOpenRouter },
  cloudflare: { detectFraud: detectFraudWithCloudflare },
  huggingface: { analyzeImage: analyzeProductImageWithHuggingFace },
}
