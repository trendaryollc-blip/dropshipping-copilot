import {
  openRouterChatWithConfig,
  parseJsonFromModel,
} from "@/lib/automation/openrouter-client";
import type { IntegrationConfig } from "./config";
import { hasCj, hasOpenRouter } from "./config";
import { searchCjProducts, type SupplierMatch } from "./cj";
import { searchZendropProducts } from "./zendrop";
import { searchAliexpressProducts } from "./aliexpress";

export async function matchSuppliers(
  config: IntegrationConfig,
  productName: string,
): Promise<{ product: string; suppliers: SupplierMatch[]; source: string }> {
  const product = productName.trim() || "consumer product";
  const allSuppliers: SupplierMatch[] = [];
  const sourcesUsed: string[] = [];

  const promises: Promise<void>[] = [];

  // 1. Search CJ if configured
  if (hasCj(config)) {
    promises.push(
      searchCjProducts(config, product, 5)
        .then((res) => {
          if (res.length > 0) {
            allSuppliers.push(...res);
            sourcesUsed.push("CJ");
          }
        })
        .catch((err) => {
          console.error("CJ supplier search failed:", err);
        })
    );
  }

  // 2. Search Zendrop if configured
  if (config.zendrop.apiKey) {
    promises.push(
      searchZendropProducts(config, product, 5)
        .then((res) => {
          if (res.length > 0) {
            allSuppliers.push(...res);
            sourcesUsed.push("Zendrop");
          }
        })
        .catch((err) => {
          console.error("Zendrop supplier search failed:", err);
        })
    );
  }

  // 3. Search AliExpress if configured
  if (config.aliexpress.appKey) {
    promises.push(
      searchAliexpressProducts(config, product, 5)
        .then((res) => {
          if (res.length > 0) {
            allSuppliers.push(...res);
            sourcesUsed.push("AliExpress");
          }
        })
        .catch((err) => {
          console.error("AliExpress supplier search failed:", err);
        })
    );
  }

  // Wait for all active supplier searches to finish
  if (promises.length > 0) {
    await Promise.allSettled(promises);
  }

  // If we found suppliers from any of the direct integrations, return them
  if (allSuppliers.length > 0) {
    // Sort suppliers: best rating first, then lowest unit cost
    const sorted = allSuppliers.sort((a, b) => b.rating - a.rating || a.unitCost - b.unitCost);
    return {
      product,
      suppliers: sorted,
      source: sourcesUsed.join(" + "),
    };
  }

  // 4. Fallback to OpenRouter AI Supplier Recommendation if no direct integrations succeeded
  if (hasOpenRouter(config)) {
    const content = await openRouterChatWithConfig(
      config,
      "You help dropshippers find supplier options. Respond with valid JSON only.",
      `Suggest 3 realistic supplier options for: "${product}"
 
Return JSON:
{"suppliers":[{"name":"string","platform":"aliexpress|cj|zendrop","unitCost":4.5,"shippingDays":"10-18","rating":4.6}]}
 
Use plausible USD unit costs and shipping day ranges.`,
      0.5,
    );

    const parsed = parseJsonFromModel<{
      suppliers: Array<{
        name: string;
        platform: string;
        unitCost: number;
        shippingDays: string;
        rating: number;
      }>;
    }>(content);

    const suppliers: SupplierMatch[] = (parsed.suppliers ?? []).map((s) => ({
      name: s.name,
      platform:
        s.platform === "cj" || s.platform === "zendrop" || s.platform === "aliexpress"
          ? s.platform
          : "ai",
      unitCost: s.unitCost,
      shippingDays: s.shippingDays,
      rating: s.rating,
    }));

    if (suppliers.length > 0) {
      return { product, suppliers, source: "ai" };
    }
  }

  throw new Error(
    "No supplier integrations configured. Add CJ, Zendrop, AliExpress, or OpenRouter keys in Settings.",
  );
}
