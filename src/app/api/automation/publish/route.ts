import { NextResponse } from "next/server";
import { requireAuthenticatedUserId } from "@/lib/auth/server-user";
import { loadIntegrationConfig, hasTrendaryo } from "@/lib/integrations/config";
import { createAuditLog } from "@/lib/database/operations";

export async function POST(request: Request) {
  const auth = await requireAuthenticatedUserId();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  const { userId } = auth;

  const body = await request.json().catch(() => ({}));
  const { title, description, bulletPoints, seoKeywords, product, suppliers } = body as Record<string, unknown>;

  const config = await loadIntegrationConfig(userId);

  if (!hasTrendaryo(config)) {
    return NextResponse.json(
      { message: "Trendaryo API not configured. Add your API URL and key in Settings." },
      { status: 422 },
    );
  }

  const baseUrl = config.trendaryo.apiUrl.replace(/\/$/, "");
  const headers: HeadersInit = {
    Authorization: `Bearer ${config.trendaryo.apiKey}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  const productObj = (product as Record<string, unknown> | undefined) ?? {};
  const supplierList = (suppliers as Array<Record<string, unknown>> | undefined) ?? [];

  const payload: Record<string, unknown> = {
    title: title ?? productObj.name ?? "New Product",
    body_html: description ?? "",
    vendor: "Dropship Autopilot",
    product_type: productObj.niche ?? "General",
    tags: Array.isArray(seoKeywords) ? (seoKeywords as string[]).join(", ") : "",
    variants: [
      {
        price: supplierList[0]?.unitCost ?? "0.00",
        requires_shipping: true,
        inventory_policy: "continue",
      },
    ],
    bullet_points: Array.isArray(bulletPoints) ? bulletPoints : [],
    source: "dropship-autopilot",
  };

  try {
    const res = await fetch(`${baseUrl}/products`, {
      method: "POST",
      headers,
      body: JSON.stringify({ product: payload }),
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { message: `Trendaryo rejected the publish request (${res.status}): ${text.slice(0, 200)}` },
        { status: 502 },
      );
    }

    const data = await res.json().catch(() => ({}));
    await createAuditLog({
      userId,
      action: "publish",
      resource: "listings",
      detail: `Published listing "${title ?? "new product"}"`,
      metadata: { title, productId: (data as any)?.id },
    });
    return NextResponse.json({ success: true, product: data });
  } catch (err) {
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Publish failed" },
      { status: 502 },
    );
  }
}
