import { DEFAULT_USER_ID } from "@/lib/constants";
import { getApiKeys } from "@/lib/database/operations";
import { getDb } from "@/lib/firebase";

export interface IntegrationConfig {
  openrouter: { apiKey: string; model: string; siteUrl: string };
  trendaryo: { apiUrl: string; apiKey: string };
  cj: { apiKey: string };
  zendrop: { apiKey: string };
  aliexpress: { appKey: string; appSecret: string };
  meta: { apiKey: string };
}

function env(key: string): string {
  return process.env[key]?.trim() ?? "";
}

function buildFromEnv(): IntegrationConfig {
  return {
    openrouter: {
      apiKey: env("OPENROUTER_API_KEY"),
      model: env("OPENROUTER_MODEL") || "openai/gpt-4o-mini",
      siteUrl: env("OPENROUTER_SITE_URL") || "http://localhost:3000",
    },
    trendaryo: {
      apiUrl: env("TRENDARYO_API_URL") || env("STORE_API_URL"),
      apiKey: env("TRENDARYO_API_KEY") || env("STORE_API_KEY"),
    },
    cj: { apiKey: env("CJ_API_KEY") || env("SUPPLIER_API_KEY") },
    zendrop: { apiKey: env("ZENDROP_API_KEY") },
    aliexpress: { appKey: env("ALIEXPRESS_APP_KEY"), appSecret: env("ALIEXPRESS_APP_SECRET") ?? "" },
    meta: { apiKey: env("META_API_KEY") || env("RESEARCH_API_KEY") },
  };
}

function mergeConfig(
  base: IntegrationConfig,
  stored: Partial<Record<string, string>>,
): IntegrationConfig {
  return {
    openrouter: {
      apiKey: stored.openrouter_api_key || base.openrouter.apiKey,
      model: stored.openrouter_model || base.openrouter.model,
      siteUrl: base.openrouter.siteUrl,
    },
    trendaryo: {
      apiUrl: stored.trendaryo_api_url || base.trendaryo.apiUrl,
      apiKey: stored.trendaryo_api_key || base.trendaryo.apiKey,
    },
    cj: { apiKey: stored.cj_api_key || base.cj.apiKey },
    zendrop: { apiKey: stored.zendrop_api_key || base.zendrop.apiKey },
    aliexpress: { appKey: stored.aliexpress_app_key || base.aliexpress.appKey, appSecret: stored.aliexpress_secret_key || base.aliexpress.appSecret },
    meta: { apiKey: stored.meta_api_key || base.meta.apiKey },
  };
}

export async function loadIntegrationConfig(
  userId: string = DEFAULT_USER_ID,
): Promise<IntegrationConfig> {
  const base = buildFromEnv();

  if (!getDb()) {
    return base;
  }

  try {
    const stored = await getApiKeys(userId);
    if (!stored) return base;

    const { id: _id, userId: _uid, createdAt, updatedAt, ...keys } = stored;
    return mergeConfig(base, keys as Partial<Record<string, string>>);
  } catch {
    return base;
  }
}

export function hasOpenRouter(config: IntegrationConfig): boolean {
  return Boolean(config.openrouter.apiKey);
}

export function hasTrendaryo(config: IntegrationConfig): boolean {
  return Boolean(config.trendaryo.apiUrl && config.trendaryo.apiKey);
}

export function hasCj(config: IntegrationConfig): boolean {
  return Boolean(config.cj.apiKey);
}

export function integrationStatus(config: IntegrationConfig) {
  return {
    openrouter: hasOpenRouter(config),
    trendaryo: hasTrendaryo(config),
    cj: hasCj(config),
    zendrop: Boolean(config.zendrop.apiKey),
    aliexpress: Boolean(config.aliexpress.appKey),
    meta: Boolean(config.meta.apiKey),
  };
}
