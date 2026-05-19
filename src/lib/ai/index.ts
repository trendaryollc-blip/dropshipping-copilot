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
import { TASK_AI_MAPPING, type AutomationTask, type AIProvider } from './config'
export type { AutomationTask, AIProvider }
import { processOrderWithGroq } from './groq-order-processing'
import { generateProductDescriptionWithGemini } from './gemini-description'
import { optimizeSEOWithDeepSeek } from './deepseek-seo'
import { getDynamicPricingWithOpenRouter } from './openrouter-pricing'
import { detectFraudWithCloudflare } from './cloudflare-fraud'
import { analyzeProductImageWithHuggingFace } from './huggingface-image'
import { generateCompetitorAnalysisWithDeepSeek } from './deepseek-competitor'
import { reviewReturnsWithOpenRouter } from './openrouter-returns'

export const AI = {
  /**
   * Automatically routes to the best AI for the given task
   */
  async runTask(task: AutomationTask, input: any) {
    const provider = TASK_AI_MAPPING[task]
    const competitors =
      task === 'competitor_analysis' && Array.isArray(input?.competitors)
        ? input.competitors
        : []

    switch (provider) {
      case 'groq':
        return processOrderWithGroq(input)
      case 'google':
        return generateProductDescriptionWithGemini(input)
      case 'deepseek':
        if (task === 'competitor_analysis') return generateCompetitorAnalysisWithDeepSeek(competitors)
        return optimizeSEOWithDeepSeek(input)
      case 'openrouter':
        if (task === 'returns_review') return reviewReturnsWithOpenRouter(input.returns || input.competitors || [])
        return getDynamicPricingWithOpenRouter(input)
      case 'cloudflare':
        return detectFraudWithCloudflare(input)
      case 'huggingface':
        return analyzeProductImageWithHuggingFace(input)
      default:
        throw new Error(`No AI provider configured for task: ${task}`)
    }
  },

  // Direct access to individual AIs ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  groq: { processOrder: processOrderWithGroq },
  google: { generateDescription: generateProductDescriptionWithGemini },
  deepseek: { optimizeSEO: optimizeSEOWithDeepSeek, analyzeCompetitors: generateCompetitorAnalysisWithDeepSeek },
  openrouter: { getPricing: getDynamicPricingWithOpenRouter, reviewReturns: reviewReturnsWithOpenRouter },
  cloudflare: { detectFraud: detectFraudWithCloudflare },
  huggingface: { analyzeImage: analyzeProductImageWithHuggingFace },
}
