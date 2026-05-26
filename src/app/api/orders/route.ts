import { NextRequest, NextResponse } from "next/server";
import { requireAuthenticatedUserId } from "@/lib/auth/server-user";
import { getUserOrders, searchOrders, createOrder } from "@/lib/database/operations";
import { getDb } from "@/lib/firebase";

export async function GET(request: NextRequest) {
  const auth = await requireAuthenticatedUserId();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") ?? "";
  const status = searchParams.get("status") ?? "all";
  const limit = Math.min(Number(searchParams.get("limit") ?? 50), 100);
  const cursor = searchParams.get("cursor") ?? undefined;

  const db = getDb();
  if (!db) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  try {
    if (search.trim()) {
      const orders = await searchOrders(auth.userId, search.trim(), status);
      return NextResponse.json({ orders, mode: "live" });
    }

    const { orders, cursor: nextCursor } = await getUserOrders(auth.userId, limit, cursor);

    const filtered =
      status === "all"
        ? orders
        : orders.filter((order) => order.status === status);

    return NextResponse.json({
      orders: filtered,
      cursor: nextCursor,
      mode: "live",
    });
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
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

  const { orderNumber, customer, items, totals, status = "pending" } = body;

  if (!orderNumber || !customer || !items || !totals) {
    return NextResponse.json(
      { error: "orderNumber, customer, items, and totals are required" },
      { status: 400 }
    );
  }

  const db = getDb();
  if (!db) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  try {
    const orderId = await createOrder({
      userId: auth.userId,
      orderNumber,
      status,
      customer,
      items,
      totals,
      trackingNumbers: [],
      supplierOrders: [],
    });

    return NextResponse.json({ success: true, id: orderId }, { status: 201 });
  } catch (error) {
    console.error("Failed to create order:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
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

  const { orderIds, updates } = body;

  if (!orderIds || !Array.isArray(orderIds) || !updates) {
    return NextResponse.json(
      { error: "orderIds (array) and updates are required" },
      { status: 400 }
    );
  }

  const db = getDb();
  if (!db) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  try {
    const { bulkUpdateOrders } = await import("@/lib/database/operations");
    await bulkUpdateOrders(orderIds, updates);
    return NextResponse.json({ success: true, updated: orderIds.length });
  } catch (error) {
    console.error("Failed to bulk update orders:", error);
    return NextResponse.json({ error: "Failed to update orders" }, { status: 500 });
  }
}

