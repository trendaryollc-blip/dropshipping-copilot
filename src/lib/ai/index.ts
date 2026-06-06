/**
 * ──────────────────────────────────────────────────────────────────────────────
 * Central task router — pick the right AI automatically (one platform per task)
 * ──────────────────────────────────────────────────────────────────────────────
 * Task                 AI Platform    Free Tier             Env Var
 * ───────────────────  ────────────  ────────────────────  ───────────────────
 * order_processing     Groq          30 req/min            GROQ_API_KEY
 * product_description  Cohere        100 req/day trial     COHERE_API_KEY
 * seo_optimization     DeepSeek      ¥5M token free        DEEPSEEK_API_KEY
 * dynamic_pricing      OpenRouter    $1 free credit        OPENROUTER_API_KEY
 * fraud_detection      Cloudflare    10k req/day           CLOUDFLARE_AI_API_KEY
 * image_analysis       Mistral       500k tokens free      MISTRAL_API_KEY
 * competitor_analysis  Cohere        100 req/day trial     COHERE_API_KEY
 * returns_review       SerpAPI       100 searches/month    SERPAPI_API_KEY
 * ───────────────────  ────────────  ────────────────────  ───────────────────
 *
 * Env vars live in .env (git-ignored).
 */
import type { AutomationTask } from './config'
import { TASK_AI_MAPPING } from './config'
import { processOrderWithGroq, type OrderProcessingInput } from './groq-order-processing'
import { generateProductDescription, analyzeCompetitors, type ProductDescriptionInput, type CompetitorInput } from './cohere'
import { optimizeSEO, type SEOInput } from './deepseek-seo'
import { getDynamicPricingWithOpenRouter, type PricingInput } from './openrouter-pricing'
import { detectFraudWithCloudflare, type FraudInput } from './cloudflare-fraud'
import { analyzeProductImage, type ImageAnalysisInput } from './mistral'
import { reviewReturn, type ReturnRequest } from './serpapi-returns'

type TaskInput =
  | { task: 'order_processing'; input: OrderProcessingInput }
  | { task: 'product_description'; input: ProductDescriptionInput }
  | { task: 'seo_optimization'; input: SEOInput }
  | { task: 'dynamic_pricing'; input: PricingInput }
  | { task: 'fraud_detection'; input: FraudInput }
  | { task: 'image_analysis'; input: ImageAnalysisInput }
  | { task: 'competitor_analysis'; input: CompetitorInput }
  | { task: 'returns_review'; input: { returns: ReturnRequest[] } }

export const AI = {
  /**
   * Automatically routes to the best AI for the given task
   * One platform per task — maximizes free quota across all providers
   */
  async runTask(task: AutomationTask, input: any) {
    const provider = TASK_AI_MAPPING[task]

    switch (provider) {
      case 'groq':
        return processOrderWithGroq(input as OrderProcessingInput)

      case 'cohere':
        if (task === 'product_description') {
          return generateProductDescription(input as ProductDescriptionInput)
        }
        if (task === 'competitor_analysis') {
          return analyzeCompetitors(input as CompetitorInput)
        }
        throw new Error(`Unknown cohere task: ${task}`)

      case 'deepseek':
        return optimizeSEO(input as SEOInput)

      case 'openrouter':
        return getDynamicPricingWithOpenRouter(input as PricingInput)

      case 'cloudflare':
        return detectFraudWithCloudflare(input as FraudInput)

      case 'mistral':
        return analyzeProductImage(input as ImageAnalysisInput)

      case 'serpapi':
        return reviewReturn(input as { returns: ReturnRequest[] })

      default:
        throw new Error(`No AI provider configured for task: ${task}`)
    }
  },

  // Direct access to individual AIs
  groq: { processOrder: processOrderWithGroq },
  cohere: {
    generateDescription: generateProductDescription,
    analyzeCompetitors,
  },
  deepseek: { optimizeSEO },
  openrouter: { getPricing: getDynamicPricingWithOpenRouter },
  cloudflare: { detectFraud: detectFraudWithCloudflare },
  mistral: { analyzeImage: analyzeProductImage },
  serpapi: { reviewReturns: reviewReturn },
}