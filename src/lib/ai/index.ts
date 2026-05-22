/**
 * ──────────────────────────────────────────────────────────────────────────────
 * central task router — pick the right AI automatically
 * ──────────────────────────────────────────────────────────────────────────────
 * Task              AI Provider  Key var                   Pages
 * ───────────────── ──────────── ───────────────────────── ───────────────
 * order_processing     GROQ         GROQ_API_KEY            /orders
 * product_description  ZAI          ZAI_API_KEY              /products
 *                                                                 /bulk-edit
 *                                                                 /business
 * seo_optimization     ZAI          ZAI_API_KEY              /seo
 * dynamic_pricing      OPENROUTER   OPENROUTER_API_KEY      /calculator
 *                                                                 /business
 * fraud_detection      CLOUDFLARE   CLOUDFLARE_AI_API_KEY   /orders
 * image_analysis       HUGGINGFACE  HUGGINGFACE_API_KEY     pdts upload
 * competitor_analysis  ZAI          ZAI_API_KEY              /competitors
 * returns_review       ZAI          ZAI_API_KEY              /returns
 * ───────────────── ──────────── ───────────────────────── ───────────────
 *
 * Env vars live in .env  (git-ignored).
 * Template guide  : .env.example  (safe to keep in git / PRs / docs).
 */
import type { CompetitorProduct } from '@/types'
import type { AutomationTask, AIProvider } from './config'
import { TASK_AI_MAPPING } from './config'
import { processOrderWithGroq, type OrderProcessingInput } from './groq-order-processing'
import {
  generateProductDescriptionWithZAI,
  optimizeSEOWithZAI,
  generateCompetitorAnalysisWithZAI,
  reviewReturnsWithZAI,
  pingZAI,
  type ProductDescriptionInput,
  type SEOInput,
  type ReturnRequest,
} from './zai'
import { getDynamicPricingWithOpenRouter, type PricingInput } from './openrouter-pricing'
import { detectFraudWithCloudflare, type FraudInput } from './cloudflare-fraud'
import { analyzeProductImageWithHuggingFace, type ImageAnalysisInput } from './huggingface-image'
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
  | { task: 'returns_review'; input: { returns?: ReturnRequest[]; competitors?: unknown[] } }

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
      provider === 'zai' ? (
        task === 'product_description' ? generateProductDescriptionWithZAI(anyInput) :
        task === 'seo_optimization'    ? optimizeSEOWithZAI(anyInput) :
        task === 'competitor_analysis' ? generateCompetitorAnalysisWithZAI(competitors) :
        task === 'returns_review'      ? reviewReturnsWithZAI(anyInput.returns || [])
        : generateProductDescriptionWithZAI(anyInput)
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
  zai: {
    generateDescription:      generateProductDescriptionWithZAI,
    optimizeSEO:              optimizeSEOWithZAI,
    analyzeCompetitors:       generateCompetitorAnalysisWithZAI,
    reviewReturns:            reviewReturnsWithZAI,
    ping:                     pingZAI,
  },
  openrouter: { getPricing: getDynamicPricingWithOpenRouter, reviewReturns: reviewReturnsWithOpenRouter as typeof reviewReturnsWithZAI },
  cloudflare: { detectFraud: detectFraudWithCloudflare },
  huggingface: { analyzeImage: analyzeProductImageWithHuggingFace },
}
