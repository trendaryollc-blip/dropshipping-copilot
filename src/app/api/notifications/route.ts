import { NextResponse } from "next/server";
import { mockNotifications } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json({ mode: "placeholder", notifications: mockNotifications });
}

export async function PATCH() {
  return NextResponse.json({ success: true, mode: "placeholder" });
}
