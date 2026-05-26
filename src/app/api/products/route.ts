import { NextResponse } from "next/server";
import { requireAuthenticatedUserId } from "@/lib/auth/server-user";
import { getUserProducts, createProduct } from "@/lib/database/operations";
import { getDb } from "@/lib/firebase";

// High-quality mock product catalog for Demo Mode when Firebase is not connected
const MOCK_PRODUCTS = [
  {
    id: "mock-prod-1",
    userId: "demo-user",
    name: "Portable Neck Fan — USB Rechargeable",
    niche: "Summer Gadgets",
    trend: "Rising",
    estimatedMargin: "42%",
    score: 87,
    whyItWins: "High summer demand with strong margins on lightweight SKUs. Perfect for impulse buys.",
    unitCost: 4.20,
    retailPrice: 19.99,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "mock-prod-2",
    userId: "demo-user",
    name: "Pet Hair Remover Roller",
    niche: "Pet Supplies",
    trend: "Stable",
    estimatedMargin: "38%",
    score: 81,
    whyItWins: "Evergreen pet niche with repeat purchase potential and passionate audience targeting.",
    unitCost: 3.50,
    retailPrice: 14.99,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "mock-prod-3",
    userId: "demo-user",
    name: "Smart Flame Air Humidifier",
    niche: "Home Decor & Wellness",
    trend: "Explosive",
    estimatedMargin: "60%",
    score: 92,
    whyItWins: "Cozy flame aesthetic that went viral on TikTok, perfect for high-converting video ad creatives.",
    unitCost: 6.50,
    retailPrice: 29.99,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "mock-prod-4",
    userId: "demo-user",
    name: "Magnetic Desk Cable Organizer",
    niche: "Office & Productivity",
    trend: "Rising",
    estimatedMargin: "45%",
    score: 79,
    whyItWins: "Low weight, impulse-buy friendly desk organization product with universal appeal.",
    unitCost: 1.80,
    retailPrice: 9.99,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export async function GET() {
  const auth = await requireAuthenticatedUserId();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const db = getDb();
  if (!db) {
    // Return high-quality mock product list in Demo Mode
    return NextResponse.json({ products: MOCK_PRODUCTS, mode: "demo" });
  }

  try {
    const { products } = await getUserProducts(auth.userId);
    // Sort products by score (descending) then by date
    const sorted = (products).sort(
      (a: { score?: number; createdAt: string }, b: { score?: number; createdAt: string }) => (b.score ?? 0) - (a.score ?? 0) || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return NextResponse.json({ products: sorted, mode: "live" });
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return NextResponse.json(
      { error: "Failed to fetch product library" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const auth = await requireAuthenticatedUserId();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  let body: any = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.name) {
    return NextResponse.json({ error: "Product name is required" }, { status: 400 });
  }

  const db = getDb();
  if (!db) {
    // Simulated success in Demo Mode
    return NextResponse.json({
      success: true,
      message: "Firebase not configured - product saved in local session memory only.",
      product: {
        id: `mock-${Date.now()}`,
        userId: auth.userId,
        name: body.name,
        niche: body.niche ?? "General",
        trend: body.trend ?? "Stable",
        estimatedMargin: body.estimatedMargin ?? "40%",
        score: Number(body.score ?? 75),
        whyItWins: body.whyItWins ?? "General trending product concept.",
        unitCost: Number(body.unitCost ?? 5.00),
        retailPrice: Number(body.retailPrice ?? 15.00),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      mode: "demo"
    });
  }

  try {
    const productId = await createProduct({
      userId: auth.userId,
      name: body.name,
      niche: body.niche,
      trend: body.trend,
      estimatedMargin: body.estimatedMargin,
      score: body.score ? Number(body.score) : undefined,
      whyItWins: body.whyItWins,
      unitCost: body.unitCost ? Number(body.unitCost) : undefined,
      retailPrice: body.retailPrice ? Number(body.retailPrice) : undefined,
      supplierId: body.supplierId,
      supplierName: body.supplierName,
      images: body.images,
      tags: body.tags,
    });

    return NextResponse.json({
      success: true,
      id: productId,
      message: "Product saved to library successfully."
    });
  } catch (error) {
    console.error("Failed to save product:", error);
    return NextResponse.json(
      { error: "Failed to save product to library" },
      { status: 500 }
    );
  }
}
