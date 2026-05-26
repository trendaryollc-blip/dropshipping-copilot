import { NextResponse } from "next/server";
import { mockBilling } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json({ mode: "placeholder", billing: mockBilling });
}
