import { NextResponse } from "next/server";
import { searchAliExpressProducts, searchZendropProducts } from "@/lib/integrations/placeholder";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const query = String(body.query ?? body.productName ?? "winning product");
  const [zendrop, aliexpress] = await Promise.all([
    searchZendropProducts(query),
    searchAliExpressProducts(query),
  ]);

  return NextResponse.json({
    mode: "placeholder",
    suppliers: [...zendrop.products, ...aliexpress.products],
  });
}
