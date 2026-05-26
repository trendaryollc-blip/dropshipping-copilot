import { NextResponse } from "next/server";
import { mockAnalytics } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json({ mode: "placeholder", analytics: mockAnalytics });
}
