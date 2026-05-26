import { NextResponse } from "next/server";
import { requireAuthenticatedUserId } from "@/lib/auth/server-user";
import { createSupplier } from "@/lib/database/operations";
import { getDb } from "@/lib/firebase";

export async function POST(request: Request) {
  const auth = await requireAuthenticatedUserId();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  const { userId } = auth;

  let body: Record<string, unknown> = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { url } = body;
  if (!url || typeof url !== "string") {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  const parsedUrl = new URL(url);
  const hostname = parsedUrl.hostname.replace(/^www\./, "").toLowerCase();

  let name = parsedUrl.pathname.split("/").filter(Boolean).pop()?.replace(/-/g, " ").replace(/_/g, " ") || "Imported Supplier";
  name = name.charAt(0).toUpperCase() + name.slice(1);

  let platform: "cj" | "zendrop" | "aliexpress" | "custom" = "custom";
  if (hostname.includes("aliexpress")) platform = "aliexpress";
  else if (hostname.includes("zendrop")) platform = "zendrop";
  else if (hostname.includes("cj") || hostname.includes("cjdropshipping")) platform = "cj";

  if (!getDb()) {
    return NextResponse.json({ success: true, id: `demo-import-${Date.now()}`, demo: true });
  }

  try {
    const id = await createSupplier({
      userId,
      name: name.slice(0, 200),
      platform,
      unitCost: 0,
      shippingDays: "",
      rating: 0,
      productUrl: url.slice(0, 500),
      isActive: true,
    });
    return NextResponse.json({ success: true, id });
  } catch (err) {
    console.error("Failed to import supplier:", err);
    return NextResponse.json({ error: "Failed to import supplier" }, { status: 500 });
  }
}