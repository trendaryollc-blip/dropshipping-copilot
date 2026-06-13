/**
 * verify-keys.ts - Module for checking AI provider API key health
 * Used by the /api/health endpoint to report which keys are configured.
 */

// Note: dotenv/config removed - Vercel sets env vars directly on platform

export interface KeyStatus {
  valid: boolean;
  error?: string;
}

export interface KeyHealthReport {
  [provider: string]: KeyStatus;
}

/**
 * Verify which AI provider API keys are set in environment variables
 * This does NOT actually call the APIs - just checks if keys are present
 */
export async function verifyAllKeys(): Promise<KeyHealthReport> {
  const report: KeyHealthReport = {};

  const providers: Array<{ name: string; envKey: string }> = [
    { name: 'zai', envKey: 'ZAI_API_KEY' },
    { name: 'groq', envKey: 'GROQ_API_KEY' },
    { name: 'cloudflare', envKey: 'CLOUDFLARE_AI_API_KEY' },
    { name: 'huggingface', envKey: 'HUGGINGFACE_API_KEY' },
    { name: 'openrouter', envKey: 'OPENROUTER_API_KEY' },
    { name: 'deepseek', envKey: 'DEEPSEEK_API_KEY' },
    { name: 'google', envKey: 'GOOGLE_AI_API_KEY' },
    { name: 'openai', envKey: 'NEXT_PUBLIC_OPENAI_API_KEY' },
  ];

  for (const provider of providers) {
    const key = process.env[provider.envKey] || '';
    report[provider.name] = {
      valid: key.length > 0,
      error: key.length > 0 ? undefined : `${provider.envKey} is not set`,
    };
  }

  // Firebase check
  report['firebase'] = {
    valid: !!(process.env.NEXT_PUBLIC_FIREBASE_API_KEY && process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID),
    error: (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY || !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID)
      ? 'NEXT_PUBLIC_FIREBASE_API_KEY or NEXT_PUBLIC_FIREBASE_PROJECT_ID not set'
      : undefined,
  };

  // Trendaryo check
  report['trendaryo'] = {
    valid: !!(process.env.TRENDARYO_API_KEY && process.env.TRENDARYO_API_URL),
    error: (!process.env.TRENDARYO_API_KEY || !process.env.TRENDARYO_API_URL)
      ? 'TRENDARYO_API_KEY or TRENDARYO_API_URL not set'
      : undefined,
  };

  return report;
}