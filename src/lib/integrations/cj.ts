import type { IntegrationConfig } from "./config";

export interface SupplierMatch {
  name: string;
  platform: "cj" | "zendrop" | "aliexpress" | "ai" | "custom";
  unitCost: number;
  shippingDays: string;
  rating: number;
  productSku?: string;
  productUrl?: string;
}

const CJ_BASE = "https://developers.cjdropshipping.com/api2.0/v1";

interface CjListResponse {
  data?: {
    list?: Array<Record<string, unknown>>;
    content?: Array<Record<string, unknown>>;
  };
  result?: Array<Record<string, unknown>>;
}

export async function searchCjProducts(
  config: IntegrationConfig,
  keyword: string,
  limit = 5,
): Promise<SupplierMatch[]> {
  const keyWord = encodeURIComponent(keyword.trim() || "dropshipping");
  const url = `${CJ_BASE}/product/listV2?page=1&size=${Math.min(limit, 20)}&keyWord=${keyWord}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  const response = await fetch(url, {
    headers: {
      "CJ-Access-Token": config.cj.apiKey,
      Accept: "application/json",
    },
    cache: "no-store",
    signal: controller.signal,
  });

  clearTimeout(timeout);

  const text = await response.text();
  if (!response.ok) {
    throw new Error(`CJ API error (${response.status}): ${text.slice(0, 300)}`);
  }

  const json = JSON.parse(text) as CjListResponse;
  const list =
    json.data?.list ??
    json.data?.content ??
    json.result ??
    [];

  return list.slice(0, limit).map((item) => {
    const name = String(
      item.productNameEn ?? item.productName ?? item.name ?? "CJ Product",
    );
    const sellPrice = Number(item.sellPrice ?? item.price ?? 0);
    const listedNum = Number(item.listedNum ?? item.saleCount ?? 0);

    return {
      name: `CJ — ${name}`,
      platform: "cj" as const,
      unitCost: sellPrice || 0,
      shippingDays: "8–15",
      rating: Math.min(5, 4 + Math.min(listedNum / 1000, 0.9)),
      productSku: item.productSku as string | undefined,
      productUrl: item.productUrl as string | undefined,
    };
  });
}
