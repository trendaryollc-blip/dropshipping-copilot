import { NextResponse } from "next/server";
import { requireAuthenticatedUserId } from "@/lib/auth/server-user";
import { getUserAutomations, getUserProducts } from "@/lib/database/operations";
import { getDb } from "@/lib/firebase";
import { loadIntegrationConfig, integrationStatus } from "@/lib/integrations/config";

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

export async function GET() {
  const auth = await requireAuthenticatedUserId();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  const { userId } = auth;

  const config = await loadIntegrationConfig(userId);
  const integrations = integrationStatus(config);

  const fallback = {
    productsScanned: 0,
    suppliersMatched: 0,
    listingsDrafted: 0,
    ordersFulfilled: 0,
    successRate: "—",
    integrations,
    live: false,
    hint: "Connect Firebase and run automations to see live stats.",
  };

  if (!getDb()) {
    return NextResponse.json({
      ...fallback,
      productsScanned: 128,
      suppliersMatched: 34,
      listingsDrafted: 12,
      ordersFulfilled: 47,
      successRate: "98%",
      live: false,
      hint: "Demo stats — configure Firebase for real counts.",
    });
  }

  try {
    const since = daysAgo(7);
    const automations = await getUserAutomations(userId, 200);
    const recent = automations.filter((a) => (a.startedAt ?? a.createdAt) >= since);

    const researchRuns = recent.filter(
      (a) => a.moduleId === "product-research" && a.status === "completed",
    );
    const supplierRuns = recent.filter(
      (a) => a.moduleId === "suppliers" && a.status === "completed",
    );
    const copyRuns = recent.filter(
      (a) => a.moduleId === "copywriting" && a.status === "completed",
    );
    const orderRuns = recent.filter(
      (a) => a.moduleId === "orders" && a.status === "completed",
    );

    let productsFromRuns = 0;
    for (const run of researchRuns) {
      const list = run.output?.products;
      if (Array.isArray(list)) productsFromRuns += list.length;
    }

    const { products } = await getUserProducts(userId);

    let ordersPlaced = 0;
    let ordersFailed = 0;
    for (const run of orderRuns) {
      ordersPlaced += Number(run.output?.placed ?? 0);
      ordersFailed += Number(run.output?.failed ?? 0);
    }

    const totalOrders = ordersPlaced + ordersFailed;
    const successRate =
      totalOrders > 0
        ? `${Math.round((ordersPlaced / totalOrders) * 100)}%`
        : "—";

    return NextResponse.json({
      productsScanned: productsFromRuns || products.length,
      suppliersMatched: supplierRuns.length,
      listingsDrafted: copyRuns.length,
      ordersFulfilled: ordersPlaced,
      successRate,
      integrations,
      live: true,
      hint: "Last 7 days from your automation history.",
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(fallback);
  }
}
