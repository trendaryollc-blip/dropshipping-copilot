import { NextRequest, NextResponse } from "next/server";
import { mockOrders } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json({ orders: mockOrders, demo: true });
}

export async function PATCH(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  return NextResponse.json({ success: true, mode: "placeholder", order: { id: body.id, ...body.updates } });
}
