// Centralized AI Configuration
export const AI_PROVIDERS = {
  GROQ: 'groq',
  COHERE: 'cohere',
  DEEPSEEK: 'deepseek',
  OPENROUTER: 'openrouter',
  CLOUDFLARE: 'cloudflare',
  MISTRAL: 'mistral',
  SERPAPI: 'serpapi',
} as const;

export type AIProvider = typeof AI_PROVIDERS[keyof typeof AI_PROVIDERS];

// Task to AI Provider Mapping
// Each platform powers exactly ONE task to maximize free tier quotas
export const TASK_AI_MAPPING = {
  order_processing:    AI_PROVIDERS.GROQ,        // Fastest inference for structured data
  product_description: AI_PROVIDERS.COHERE,       // Best creative text generation
  seo_optimization:    AI_PROVIDERS.DEEPSEEK,      // Strong at structured analysis
  dynamic_pricing:     AI_PROVIDERS.OPENROUTER,    // Access to multiple pricing models
  fraud_detection:     AI_PROVIDERS.CLOUDFLARE,    // Security-optimized infrastructure
  image_analysis:      AI_PROVIDERS.MISTRAL,       // Pixtral vision capabilities
  competitor_analysis: AI_PROVIDERS.COHERE,        // Excellent at classification & analysis
  returns_review:      AI_PROVIDERS.SERPAPI,       // Gather return policy + review data
} as const;

export type AutomationTask = keyof typeof TASK_AI_MAPPING;

// Rate limit tracking
export const FREE_TIER_LIMITS: Record<string, string> = {
  groq: '30 req/min',
  cohere: '100 req/day (trial)',
  deepseek: '¥5M token free quota',
  openrouter: '$1 free credit',
  cloudflare: '10k req/day',
  mistral: '500k tokens free',
  serpapi: '100 searches/month',
};