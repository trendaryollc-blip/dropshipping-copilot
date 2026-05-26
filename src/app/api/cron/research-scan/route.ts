import { NextRequest, NextResponse } from "next/server";
import {
  getUsersDueForScan,
  runScheduledResearchForUser,
} from "@/lib/schedules/research-scan";

function authorizeCron(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) {
    return process.env.NODE_ENV === "development";
  }

  const authHeader = request.headers.get("authorization");
  if (authHeader === `Bearer ${secret}`) return true;

  return false;
}

export async function GET(request: NextRequest) {
  if (!authorizeCron(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const due = await getUsersDueForScan();
    const results: Array<{
      userId: string;
      status: string;
      message: string;
    }> = [];

    await Promise.all(
      due.map(async ({ userId }) => {
        try {
          const result = await runScheduledResearchForUser(userId);
          results.push({
            userId,
            status: result.status,
            message: result.message,
          });
        } catch (err) {
          results.push({
            userId,
            status: "failed",
            message: err instanceof Error ? err.message : "Scan failed",
          });
        }
      }),
    );

    return NextResponse.json({
      success: true,
      processed: results.length,
      results,
      message:
        results.length === 0
          ? "No users due for a scan right now."
          : `Completed ${results.length} scheduled scan(s).`,
    });
  } catch (error) {
    console.error("Cron research-scan failed:", error);
    return NextResponse.json({ error: "Cron job failed" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  return GET(request);
}
