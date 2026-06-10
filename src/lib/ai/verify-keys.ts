/**
 * verify-keys.ts - Module for checking AI provider API key health
 * Used by the /api/health endpoint to report which keys are configured.
 */

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
    { name: 'openrouter', envKey: 'OPENROUTER_API_KEY' },
    { name: 'deepseek', envKey: 'DEEPSEEK_API_KEY' },
    { name: 'google', envKey: 'GOOGLE_AI_API_KEY' },
    { name: 'mistral', envKey: 'MISTRAL_API_KEY' },
    { name: 'serpapi', envKey: 'SERPAPI_API_KEY' },
    { name: 'scraperapi', envKey: 'SCRAPER_API_KEY' },
    { name: 'apify', envKey: 'APIFY_TOKEN' },
    { name: 'scrape_do', envKey: 'SCRAPE_DO_TOKEN' },
    { name: 'zendrop', envKey: 'ZENDROP_API_KEY' },
  ];

  for (const provider of providers) {
    const key = process.env[provider.envKey] || '';
    report[provider.name] = {
      valid: key.length > 0,
      error: key.length > 0 ? undefined : `${provider.envKey} is not set`,
    };
  }

  // Cloudflare account ID check
  if (report['cloudflare']?.valid) {
    report['cloudflare_account'] = {
      valid: !!(process.env.CLOUDFLARE_ACCOUNT_ID),
      error: !process.env.CLOUDFLARE_ACCOUNT_ID ? 'CLOUDFLARE_ACCOUNT_ID is not set' : undefined,
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