// Centralized AI Configuration
export const AI_PROVIDERS = {
  GROQ: 'groq',
  DEEPSEEK: 'deepseek',
  OPENROUTER: 'openrouter',
  CLOUDFLARE: 'cloudflare',
  MISTRAL: 'mistral',
  SERPAPI: 'serpapi',
  GOOGLE: 'google',
} as const;

export type AIProvider = typeof AI_PROVIDERS[keyof typeof AI_PROVIDERS];

// Fallback chain: when a primary provider fails, try these in order
export const PROVIDER_FALLBACK_CHAIN: Record<string, string[]> = {
  groq: ['google', 'openrouter'],
  deepseek: ['groq', 'openrouter'],
  openrouter: ['google', 'groq'],
  cloudflare: ['google', 'groq'],
  mistral: ['google', 'openrouter'],
  serpapi: ['groq', 'google'],
  google: ['groq', 'openrouter'],
};

// Task to AI Provider Mapping
// Each platform powers exactly ONE task to maximize free tier quotas
export const TASK_AI_MAPPING = {
  order_processing:    AI_PROVIDERS.GROQ,        // Fastest inference for structured data
  product_description: AI_PROVIDERS.GOOGLE,      // Gemini excels at creative text generation
  seo_optimization:    AI_PROVIDERS.DEEPSEEK,    // Strong structured analysis for SEO
  dynamic_pricing:     AI_PROVIDERS.OPENROUTER,  // Access to multiple pricing models
  fraud_detection:     AI_PROVIDERS.CLOUDFLARE,  // Security-optimized infrastructure (Worker AI)
  image_analysis:      AI_PROVIDERS.MISTRAL,     // Pixtral vision capabilities
  competitor_analysis: AI_PROVIDERS.DEEPSEEK,    // Strong structured analysis for competition data
  returns_review:      AI_PROVIDERS.SERPAPI,     // Gather return policy + review data
} as const;

export type AutomationTask = keyof typeof TASK_AI_MAPPING;

// Rate limit tracking
export const FREE_TIER_LIMITS: Record<string, string> = {
  groq: '30 req/min',
  deepseek: '¥5M token free quota',
  openrouter: '$1 free credit',
  cloudflare: '10k req/day',
  mistral: '500k tokens free',
  serpapi: '100 searches/month',
  google: '60 req/min (Gemini free tier)',
};