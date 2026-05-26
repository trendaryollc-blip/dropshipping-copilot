import { NextRequest, NextResponse } from "next/server";
import { requireAuthenticatedUserId } from "@/lib/auth/server-user";
import { getDocument, updateDocument, deleteDocument } from "@/lib/database/operations";
import { getDb } from "@/lib/firebase";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const auth = await requireAuthenticatedUserId();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const db = getDb();
  if (!db) {
    return NextResponse.json({ error: "Firebase not configured" }, { status: 503 });
  }

  try {
    const product = await getDocument<{
      id: string; userId: string; name: string;
      niche?: string; trend?: string; estimatedMargin?: string;
      score?: number; whyItWins?: string; unitCost?: number;
      retailPrice?: number; tags?: string[]; images?: string[];
      createdAt: string; updatedAt: string;
    }>("products", id);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    if (product.userId !== auth.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    return NextResponse.json({ product });
  } catch (err) {
    console.error("Failed to fetch product:", err);
    return NextResponse.json({ error: "Failed to load product" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const auth = await requireAuthenticatedUserId();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  let body: Record<string, unknown> = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const allowed = [
    "name", "niche", "trend", "estimatedMargin", "score", "whyItWins",
    "unitCost", "retailPrice", "supplierId", "supplierName", "tags", "images",
  ];
  const updates: Partial<Record<string, unknown>> = {};
  for (const key of allowed) {
    if (body[key] !== undefined) {
      updates[key] = body[key];
    }
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
  }

  const db = getDb();
  if (!db) {
    return NextResponse.json({ message: "Firebase not configured — update skipped in demo mode" });
  }

  try {
    const existing = await getDocument("products", id);
    if (!existing) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    if ((existing as { userId?: string }).userId !== auth.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await updateDocument("products", id, updates);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Product update failed:", err);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const auth = await requireAuthenticatedUserId();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const db = getDb();
  if (!db) {
    return NextResponse.json({ error: "Firebase not configured" }, { status: 503 });
  }

  try {
    const existing = await getDocument("products", id);
    if (!existing) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    if ((existing as { userId?: string }).userId !== auth.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await deleteDocument("products", id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Product deletion failed:", err);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
