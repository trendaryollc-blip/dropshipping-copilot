import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/firebase";

export async function GET(request: NextRequest) {
  const checks: Record<string, string> = {};

  if (getDb()) {
    checks.firebase = "connected";
  } else {
    checks.firebase = "demo-mode";
  }

  if (process.env.FIREBASE_PROJECT_ID && process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
    checks.auth = "configured";
  } else {
    checks.auth = "demo-mode";
  }

  checks.openrouter = process.env.OPENROUTER_API_KEY ? "configured" : "not-set";
  checks.trendaryo =
    process.env.TRENDARYO_API_URL && process.env.TRENDARYO_API_KEY
      ? "configured"
      : "not-set";
  checks.cj = process.env.CJ_API_KEY ? "configured" : "not-set";

  const response = NextResponse.json(
    {
      status: "ok",
      checks,
      timestamp: new Date().toISOString(),
    },
    { status: 200 },
  );

  response.headers.set("Cache-Control", "no-store");
  return response;
}