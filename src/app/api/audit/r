import { NextRequest, NextResponse } from "next/server";
import { requireAuthenticatedUserId } from "@/lib/auth/server-user";
import { getAuditLogs } from "@/lib/database/operations";

export async function GET(request: NextRequest) {
  const auth = await requireAuthenticatedUserId();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  const { userId } = auth;

  const { searchParams } = new URL(request.url);
  const limit = Math.min(Number(searchParams.get("limit") ?? 50), 100);

  try {
    const logs = await getAuditLogs(userId, limit);
    return NextResponse.json({ logs });
  } catch (err) {
    console.error("Audit log fetch error:", err);
    return NextResponse.json({ error: "Failed to load audit logs" }, { status: 500 });
  }
}
