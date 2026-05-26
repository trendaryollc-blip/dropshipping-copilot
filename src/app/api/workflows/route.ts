import { NextResponse } from "next/server";
import { mockWorkflows } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json({ mode: "placeholder", workflows: mockWorkflows });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  return NextResponse.json({ success: true, mode: "placeholder", workflow: { id: `workflow-${Date.now()}`, runCount: 0, isActive: true, ...body } });
}
