import { NextResponse } from "next/server";
import { requireAuthenticatedUserId } from "@/lib/auth/server-user";
import { getUserSuppliers, createSupplier } from "@/lib/database/operations";
import { getDb } from "@/lib/firebase";

const DEMO_SUPPLIERS = [
  {
    id: "demo-sup-1",
    name: "Demo Supplier A (AliExpress)",
    platform: "aliexpress",
    unitCost: 4.2,
    shippingDays: "12–18",
    rating: 4.7,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "demo-sup-2",
    name: "Demo Supplier B (CJ Dropshipping)",
    platform: "cj",
    unitCost: 5.1,
    shippingDays: "8–14",
    rating: 4.8,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
];

export async function GET() {
  const auth = await requireAuthenticatedUserId();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  const { userId } = auth;

  if (!getDb()) {
    return NextResponse.json({ suppliers: DEMO_SUPPLIERS, demo: true });
  }

  try {
    const suppliers = await getUserSuppliers(userId);
    return NextResponse.json({ suppliers, demo: false });
  } catch (err) {
    console.error("Failed to fetch suppliers:", err);
    return NextResponse.json({ error: "Failed to load suppliers" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = await requireAuthenticatedUserId();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  const { userId } = auth;

  let body: Record<string, unknown> = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { name, platform, unitCost, shippingDays, rating, productSku, productUrl, sourceProduct } = body;

  if (!name || typeof name !== "string") {
    return NextResponse.json({ error: "Supplier name is required" }, { status: 400 });
  }
  if (!platform || typeof platform !== "string") {
    return NextResponse.json({ error: "Platform is required" }, { status: 400 });
  }

  const db = getDb();
  if (!db) {
    return NextResponse.json({ success: true, id: `demo-${Date.now()}`, demo: true });
  }

  try {
    const id = await createSupplier({
      userId,
      name: String(name).slice(0, 200),
      platform: String(platform).slice(0, 20) as Parameters<typeof createSupplier>[0]["platform"],
      unitCost: Number(unitCost) || 0,
      shippingDays: String(shippingDays ?? "").slice(0, 20),
      rating: Number(rating ?? 0),
      productSku: typeof productSku === "string" ? productSku.slice(0, 100) : undefined,
      productUrl: typeof productUrl === "string" ? productUrl.slice(0, 500) : undefined,
      isActive: true,
      tags: typeof sourceProduct === "string" ? [sourceProduct] : undefined,
    });
    return NextResponse.json({ success: true, id });
  } catch (err) {
    console.error("Failed to save supplier:", err);
    return NextResponse.json({ error: "Failed to save supplier" }, { status: 500 });
  }
}