import { NextResponse } from "next/server";
import { mockWebhooks } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json({ mode: "placeholder", webhooks: mockWebhooks });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  return NextResponse.json({ success: true, mode: "placeholder", webhook: { id: `webhook-${Date.now()}`, failureCount: 0, isActive: true, ...body } });
}
