import { NextRequest, NextResponse } from "next/server";
import { requireAuthenticatedUserId } from "@/lib/auth/server-user";
import { runScheduledResearchForUser } from "@/lib/schedules/research-scan";

export async function POST(request: NextRequest) {
  const auth = await requireAuthenticatedUserId();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  let query: string | undefined;
  try {
    const body = await request.json();
    if (typeof body.query === "string") query = body.query;
  } catch {
    // optional body
  }

  try {
    const result = await runScheduledResearchForUser(auth.userId, query);
    if (result.status === "failed") {
      return NextResponse.json(result, { status: 502 });
    }
    return NextResponse.json(result);
  } catch (error) {
    console.error("Scheduled run failed:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Scheduled scan failed",
      },
      { status: 500 },
    );
  }
}
