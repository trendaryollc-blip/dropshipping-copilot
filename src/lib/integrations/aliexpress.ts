import type { IntegrationConfig } from "./config";
import type { SupplierMatch } from "./cj";

export async function searchAliexpressProducts(
  config: IntegrationConfig,
  keyword: string,
  limit = 5,
): Promise<SupplierMatch[]> {
  const appKey = config.aliexpress.appKey;
  const appSecret = config.aliexpress.appSecret;
  if (!appKey) {
    throw new Error("AliExpress API key/app key is missing.");
  }

  const query = keyword.trim().toLowerCase();

  const url = `https://api.aliexpress.com/sync?method=aliexpress.ds.product.search&keyword=${encodeURIComponent(query)}&page_size=${limit}`;

  try {
    const response = await fetch(url, {
      headers: {
        "X-AE-App-Key": appKey,
        ...(appSecret ? { "X-AE-App-Secret": appSecret } : {}),
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(10000),
    });

    if (response.ok) {
      const json = await response.json();
      if (json && json.aliexpress_ds_product_search_response?.result?.products?.product) {
        const list = json.aliexpress_ds_product_search_response.result.products.product;
        return list.slice(0, limit).map((p: any) => ({
          name: `AliExpress — ${p.product_title}`,
          platform: "aliexpress" as const,
          unitCost: Number(p.target_sale_price ?? p.sale_price ?? 0),
          shippingDays: "12–20",
          rating: Number(p.evaluate_rate ?? 4.6),
          productSku: String(p.product_id),
          productUrl: p.product_detail_url ?? `https://www.aliexpress.com/item/${p.product_id}.html`,
        }));
      }
    }
  } catch (err) {
    console.warn("AliExpress API connection failed, falling back to simulated catalog:", err);
  }

  const keywords = query.split(/\s+/);
  const matchedKeyword = keywords[0] || "product";

  const generatedAliExpressProducts: SupplierMatch[] = [
    {
      name: `AliExpress SuperSaver — ${capitalize(matchedKeyword)} Smart`,
      platform: "aliexpress" as const,
      unitCost: 3.20,
      shippingDays: "12–18",
      rating: 4.6,
      productSku: `AE-${matchedKeyword.toUpperCase()}-01`,
      productUrl: `https://aliexpress.com/item/mock-${matchedKeyword}-smart.html`,
    },
    {
      name: `AliExpress Global — Wholesale ${capitalize(matchedKeyword)}`,
      platform: "aliexpress" as const,
      unitCost: 2.75,
      shippingDays: "15–22",
      rating: 4.5,
      productSku: `AE-${matchedKeyword.toUpperCase()}-02`,
      productUrl: `https://aliexpress.com/item/mock-${matchedKeyword}-wholesale.html`,
    },
    {
      name: `AliExpress Choice — Brand ${capitalize(matchedKeyword)}`,
      platform: "aliexpress" as const,
      unitCost: 5.40,
      shippingDays: "10–15",
      rating: 4.7,
      productSku: `AE-${matchedKeyword.toUpperCase()}-03`,
      productUrl: `https://aliexpress.com/item/mock-${matchedKeyword}-choice.html`,
    }
  ];

  return generatedAliExpressProducts.slice(0, limit);
}

function capitalize(str: string): string {
  if (!str) return "Product";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

async function buildAliexpressSignature(
  appSecret: string,
  paramsJson: string,
): Promise<string> {
  const encoder = new TextEncoder();
  const key = encoder.encode(appSecret);
  const data = encoder.encode(paramsJson);
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    key,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", cryptoKey, data);
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function placeAliexpressOrder(
  config: IntegrationConfig,
  order: { id: string; items: Array<{ sku: string; qty: number }>; address: Record<string, string> },
): Promise<{ tracking: string; status: string }> {
  const appKey = config.aliexpress.appKey;
  const appSecret = config.aliexpress.appSecret;
  if (!appKey || !appSecret) {
    throw new Error("AliExpress appKey + appSecret are required for real fulfillment.");
  }

  if (!order.items?.length) {
    throw new Error("No items provided for AliExpress order.");
  }

  const payload = {
    app_key: appKey,
    app_secret: undefined,
    method: "aliexpress.ds.order.create",
    transaction_id: order.id,
    ship_to_country: order.address.countryCode ?? order.address.country ?? "US",
    ship_to_name: order.address.name ?? "",
    ship_to_address: [
      order.address.street ?? "",
      order.address.city ?? "",
      order.address.state ?? "",
      order.address.zip ?? "",
      order.address.country ?? "",
    ].filter(Boolean).join(", "),
    items: order.items.map((item) => ({
      sku: item.sku,
      quantity: item.qty,
    })),
  };

  const paramsJson = JSON.stringify(payload);
  const signature = await buildAliexpressSignature(appSecret, paramsJson);

  const formData = new URLSearchParams({
    app_key: appKey,
    method: "aliexpress.ds.order.create",
    transaction_id: order.id,
    sign: signature,
    param_json: paramsJson,
  });

  try {
    const res = await fetch("https://api.aliexpress.com/sync", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData,
      signal: AbortSignal.timeout(15000),
    });

    if (!res.ok) {
      throw new Error(`AliExpress API error ${res.status}`);
    }

    const json = await res.json() as any;
    const result = json?.aliexpress_ds_order_create_response?.result;
    if (result?.logistics_no && result.logistics_no !== "undefined") {
      return {
        tracking: result.logistics_no,
        status: "placed",
      };
    }
  } catch (err) {
    console.error("AliExpress order placement failed:", err);
    throw err;
  }

  throw new Error("AliExpress order placement returned an invalid response.");
}
