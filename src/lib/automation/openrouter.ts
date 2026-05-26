import type { IntegrationConfig } from "@/lib/integrations/config";
import { hasOpenRouter } from "@/lib/integrations/config";
import {
  hasOpenRouterKey,
  hasOpenRouterKeyAsync,
  openRouterChatWithConfig,
  parseJsonFromModel,
} from "./openrouter-client";

export { hasOpenRouterKey, hasOpenRouterKeyAsync };

export interface ProductCopyInput {
  productName?: string;
  tone?: string;
}

export interface ProductCopyOutput {
  title: string;
  bullets: string[];
  description: string;
  metaDescription?: string;
}

export interface ResearchProduct {
  name: string;
  niche: string;
  score: number;
  estimatedMargin: string;
  trend: string;
  whyItWins: string;
}

export interface ProductResearchOutput {
  query: string;
  products: ResearchProduct[];
}

export async function generateProductCopy(
  input: ProductCopyInput,
  config?: IntegrationConfig,
): Promise<ProductCopyOutput> {
  const productName = input.productName?.trim() || "consumer product";
  const tone = input.tone?.trim() || "friendly and persuasive";

  const chat = config
    ? (system: string, user: string) =>
        openRouterChatWithConfig(config, system, user)
    : async (system: string, user: string) => {
        const { openRouterChat } = await import("./openrouter-client");
        return openRouterChat(system, user);
      };

  const content = await chat(
    "You write high-converting ecommerce product listings for dropshipping stores. Respond with valid JSON only. No markdown fences.",
    `Write store listing copy for this product.

Product: ${productName}
Brand tone: ${tone}

Return JSON with this exact shape:
{"title":"string","bullets":["string","string","string"],"description":"string","metaDescription":"string"}

Rules:
- Title under 80 characters, benefit-led
- Exactly 3 bullet points, each under 120 characters
- Description 2-3 short paragraphs for a product page
- metaDescription under 160 characters for SEO`,
  );

  const parsed = parseJsonFromModel<ProductCopyOutput>(content);

  if (!parsed.title || !Array.isArray(parsed.bullets) || !parsed.description) {
    throw new Error("Model response missing required copy fields");
  }

  return parsed;
}

export async function generateProductResearch(
  query: string,
  config?: IntegrationConfig,
): Promise<ProductResearchOutput> {
  const q = query.trim() || "general dropshipping";

  const chat = config
    ? (system: string, user: string, temp?: number) =>
        openRouterChatWithConfig(config, system, user, temp ?? 0.8)
    : async (system: string, user: string, temp?: number) => {
        const { openRouterChat } = await import("./openrouter-client");
        return openRouterChat(system, user, temp ?? 0.8);
      };

  const content = await chat(
    "You are a dropshipping product research analyst. Suggest winning products to sell online. Respond with valid JSON only. No markdown fences.",
    `Find 5 winning dropshipping product ideas for: "${q}"

Return JSON:
{
  "query": "${q.replace(/"/g, '\\"')}",
  "products": [
    {
      "name": "product name",
      "niche": "category",
      "score": 85,
      "estimatedMargin": "40%",
      "trend": "Rising|Stable|Declining",
      "whyItWins": "one sentence rationale"
    }
  ]
}

Rules:
- score is 0-100 (higher = better opportunity)
- realistic products for AliExpress/CJ style sourcing
- vary niches related to the query`,
    0.8,
  );

  const parsed = parseJsonFromModel<ProductResearchOutput>(content);

  if (!Array.isArray(parsed.products) || parsed.products.length === 0) {
    throw new Error("Model response missing product list");
  }

  return { query: q, products: parsed.products };
}

export function hasOpenRouterFromConfig(config: IntegrationConfig): boolean {
  return hasOpenRouter(config);
}
