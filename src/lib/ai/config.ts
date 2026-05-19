// Centralized AI Configuration
export const AI_PROVIDERS = {
  GROQ: 'groq',
  GOOGLE: 'google',
  DEEPSEEK: 'deepseek',
  OPENROUTER: 'openrouter',
  CLOUDFLARE: 'cloudflare',
  HUGGINGFACE: 'huggingface',
} as const;

export type AIProvider = typeof AI_PROVIDERS[keyof typeof AI_PROVIDERS];

// Task to AI Provider Mapping
export const TASK_AI_MAPPING = {
  order_processing: AI_PROVIDERS.GROQ,
  product_description: AI_PROVIDERS.GOOGLE,
  seo_optimization: AI_PROVIDERS.DEEPSEEK,
  dynamic_pricing: AI_PROVIDERS.OPENROUTER,
  fraud_detection: AI_PROVIDERS.CLOUDFLARE,
  image_analysis: AI_PROVIDERS.HUGGINGFACE,
  competitor_analysis: AI_PROVIDERS.DEEPSEEK,
  returns_review: AI_PROVIDERS.OPENROUTER,
} as const;

export type AutomationTask = keyof typeof TASK_AI_MAPPING;
