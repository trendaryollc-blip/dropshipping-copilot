// Centralized AI Configuration
export const AI_PROVIDERS = {
  GROQ: 'groq',
  GOOGLE: 'google',
  ZAI: 'zai',
  DEEPSEEK: 'deepseek',
  OPENROUTER: 'openrouter',
  CLOUDFLARE: 'cloudflare',
  HUGGINGFACE: 'huggingface',
} as const;

export type AIProvider = typeof AI_PROVIDERS[keyof typeof AI_PROVIDERS];

// Task to AI Provider Mapping
// DeepSeek & OpenRouter keys are present but accounts lack balance/credits.
// Z.AI (free-quota) is used as the working fallback for those tasks.
export const TASK_AI_MAPPING = {
  order_processing:    AI_PROVIDERS.GROQ,
  product_description: AI_PROVIDERS.ZAI,       // was: google/aimlapi (out of funds)
  seo_optimization:    AI_PROVIDERS.ZAI,       // was: deepseek (402 Insufficient Balance)
  dynamic_pricing:     AI_PROVIDERS.OPENROUTER,
  fraud_detection:     AI_PROVIDERS.CLOUDFLARE,
  image_analysis:      AI_PROVIDERS.HUGGINGFACE,
  competitor_analysis: AI_PROVIDERS.ZAI,       // was: deepseek (402 Insufficient Balance)
  returns_review:      AI_PROVIDERS.ZAI,       // was: openrouter (works but Z.AI is free-quota)
} as const;

export type AutomationTask = keyof typeof TASK_AI_MAPPING;
