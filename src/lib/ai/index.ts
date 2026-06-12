/**
 * ──────────────────────────────────────────────────────────────────────────────
 * Central task router — pick the right AI automatically (one platform per task)
 * ──────────────────────────────────────────────────────────────────────────────
 *
 * All provider imports are dynamic to avoid bundling unused SDKs.
 * Each provider is only loaded when its specific task is invoked.
 */
import type { AutomationTask } from './config'
import { TASK_AI_MAPPING } from './config'

// Re-export types only (no runtime cost)
export type { AutomationTask } from './config'

export const AI = {
  /**
   * Automatically routes to the best AI for the given task
   * One platform per task — maximizes free quota across all providers
   */
  async runTask(task: AutomationTask, input: any) {
    const provider = TASK_AI_MAPPING[task]

    switch (provider) {
      case 'groq': {
        const { processOrderWithGroq } = await import('./groq-order-processing')
        return processOrderWithGroq(input)
      }
      case 'cohere': {
        if (task === 'product_description') {
          const { generateProductDescription } = await import('./cohere')
          return generateProductDescription(input)
        }
        if (task === 'competitor_analysis') {
          const { analyzeCompetitors } = await import('./cohere')
          return analyzeCompetitors(input)
        }
        throw new Error(`Unknown cohere task: ${task}`)
      }
      case 'deepseek': {
        const { optimizeSEO } = await import('./deepseek-seo')
        return optimizeSEO(input)
      }
      case 'openrouter': {
        const { getDynamicPricingWithOpenRouter } = await import('./openrouter-pricing')
        return getDynamicPricingWithOpenRouter(input)
      }
      case 'cloudflare': {
        const { detectFraudWithCloudflare } = await import('./cloudflare-fraud')
        return detectFraudWithCloudflare(input)
      }
      case 'mistral': {
        const { analyzeProductImage } = await import('./mistral')
        return analyzeProductImage(input)
      }
      case 'serpapi': {
        const { reviewReturn } = await import('./serpapi-returns')
        return reviewReturn(input)
      }
      default:
        throw new Error(`No AI provider configured for task: ${task}`)
    }
  },

  // Direct access to individual AIs — lazy-loaded
  get groq() {
    return {
      processOrder: async (input: any) => {
        const { processOrderWithGroq } = await import('./groq-order-processing')
        return processOrderWithGroq(input)
      }
    }
  },
  get cohere() {
    return {
      generateDescription: async (input: any) => {
        const { generateProductDescription } = await import('./cohere')
        return generateProductDescription(input)
      },
      analyzeCompetitors: async (input: any) => {
        const { analyzeCompetitors } = await import('./cohere')
        return analyzeCompetitors(input)
      }
    }
  },
  get deepseek() {
    return {
      optimizeSEO: async (input: any) => {
        const { optimizeSEO } = await import('./deepseek-seo')
        return optimizeSEO(input)
      }
    }
  },
  get openrouter() {
    return {
      getPricing: async (input: any) => {
        const { getDynamicPricingWithOpenRouter } = await import('./openrouter-pricing')
        return getDynamicPricingWithOpenRouter(input)
      }
    }
  },
  get cloudflare() {
    return {
      detectFraud: async (input: any) => {
        const { detectFraudWithCloudflare } = await import('./cloudflare-fraud')
        return detectFraudWithCloudflare(input)
      }
    }
  },
  get mistral() {
    return {
      analyzeImage: async (input: any) => {
        const { analyzeProductImage } = await import('./mistral')
        return analyzeProductImage(input)
      }
    }
  },
  get serpapi() {
    return {
      reviewReturns: async (input: any) => {
        const { reviewReturn } = await import('./serpapi-returns')
        return reviewReturn(input)
      }
    }
  },
}