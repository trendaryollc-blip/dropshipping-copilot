import type { IntegrationConfig } from "./config";

export interface TrendaryoOrder {
  id: string;
  status: string;
  customerName?: string;
  customerEmail?: string;
  tracking?: string;
  totalAmount?: number;
  currency?: string;
  items?: Array<{ productName: string; quantity: number; sku?: string }>;
}

function baseUrl(config: IntegrationConfig): string {
  return config.trendaryo.apiUrl.replace(/\/$/, "");
}

function headers(config: IntegrationConfig): HeadersInit {
  return {
    Authorization: `Bearer ${config.trendaryo.apiKey}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  };
}

async function parseJson<T>(response: Response): Promise<T> {
  const text = await response.text();
  if (!response.ok) {
    throw new Error(
      `Trendaryo API error (${response.status}): ${text.slice(0, 300)}`,
    );
  }
  if (!text) return {} as T;
  return JSON.parse(text) as T;
}

function normalizeOrders(payload: unknown): TrendaryoOrder[] {
  if (Array.isArray(payload)) {
    return payload.map(normalizeOrder);
  }
  if (payload && typeof payload === "object") {
    const obj = payload as Record<string, unknown>;
    const list =
      obj.orders ?? obj.data ?? obj.items ?? obj.results ?? obj.unfulfilled;
    if (Array.isArray(list)) {
      return list.map(normalizeOrder);
    }
  }
  return [];
}

function normalizeOrder(raw: unknown): TrendaryoOrder {
  const o = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const id = String(o.id ?? o.orderId ?? o.order_id ?? o.number ?? "unknown");
  const status = String(o.status ?? o.fulfillmentStatus ?? "pending");
  const tracking =
    (o.trackingNumber as string) ??
    (o.tracking as string) ??
    (o.tracking_number as string);

  return {
    id,
    status,
    customerName: o.customerName as string | undefined,
    customerEmail: o.customerEmail as string | undefined,
    tracking,
    totalAmount: typeof o.totalAmount === "number" ? o.totalAmount : undefined,
    currency: o.currency as string | undefined,
    items: Array.isArray(o.items)
      ? (o.items as Array<Record<string, unknown>>).map((item) => ({
          productName: String(item.productName ?? item.name ?? "Item"),
          quantity: Number(item.quantity ?? 1),
          sku: item.sku as string | undefined,
        }))
      : undefined,
  };
}

/** Fetch orders that need fulfillment from the Trendaryo store API. */
export async function fetchUnfulfilledOrders(
  config: IntegrationConfig,
): Promise<TrendaryoOrder[]> {
  const url = `${baseUrl(config)}/orders?status=unfulfilled`;
  const ctrl1 = new AbortController();
  const t1 = setTimeout(() => ctrl1.abort(), 12000);
  const response = await fetch(url, {
    headers: headers(config),
    cache: "no-store",
    signal: ctrl1.signal,
  });
  clearTimeout(t1);

  const data = await parseJson<unknown>(response);
  const orders = normalizeOrders(data);
  if (orders.length > 0) return orders;

  // Fallback path used by some storefront backends
  const ctrl2 = new AbortController();
  const t2 = setTimeout(() => ctrl2.abort(), 12000);
  const alt = await fetch(`${baseUrl(config)}/orders/unfulfilled`, {
    headers: headers(config),
    cache: "no-store",
    signal: ctrl2.signal,
  });
  clearTimeout(t2);
  if (alt.ok) {
    return normalizeOrders(await parseJson(alt));
  }

  return orders;
}

/** Mark an order as fulfilled and optionally attach tracking. */
export async function fulfillOrder(
  config: IntegrationConfig,
  orderId: string,
  trackingNumber?: string,
): Promise<{ success: boolean; tracking?: string }> {
  const body = trackingNumber
    ? { status: "fulfilled", trackingNumber, tracking: trackingNumber }
    : { status: "fulfilled" };

  const ctrl3 = new AbortController();
  const t3 = setTimeout(() => ctrl3.abort(), 12000);
  const response = await fetch(`${baseUrl(config)}/orders/${orderId}/fulfill`, {
    method: "POST",
    headers: headers(config),
    body: JSON.stringify(body),
    signal: ctrl3.signal,
  });
  clearTimeout(t3);

  if (!response.ok) {
    const ctrl4 = new AbortController();
    const t4 = setTimeout(() => ctrl4.abort(), 12000);
    const patch = await fetch(`${baseUrl(config)}/orders/${orderId}`, {
      method: "PATCH",
      headers: headers(config),
      body: JSON.stringify(body),
      signal: ctrl4.signal,
    });
    clearTimeout(t4);
    if (!patch.ok) {
      const detail = await patch.text();
      throw new Error(
        `Failed to fulfill order ${orderId}: ${detail.slice(0, 200)}`,
      );
    }
  }

  return { success: true, tracking: trackingNumber };
}
