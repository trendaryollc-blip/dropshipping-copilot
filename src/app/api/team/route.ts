import { NextResponse } from "next/server";
import { mockTeamMembers } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json({ mode: "placeholder", members: mockTeamMembers, invitations: [] });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  return NextResponse.json({ success: true, mode: "placeholder", invitation: { id: `invite-${Date.now()}`, status: "pending", ...body } });
}
