import { NextRequest, NextResponse } from "next/server";
import { requireAuthenticatedUserId } from "@/lib/auth/server-user";
import { getUserAutomations, deleteUserAutomations } from "@/lib/database/operations";
import { getDb } from "@/lib/firebase";

const DEMO_HISTORY = [
  {
    id: "demo-1",
    moduleId: "product-research",
    status: "completed" as const,
    message: "Found 3 product ideas for \"summer gadgets\".",
    startedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    completedAt: new Date(Date.now() - 1000 * 60 * 29).toISOString(),
    input: { query: "summer gadgets" },
  },
  {
    id: "demo-2",
    moduleId: "suppliers",
    status: "completed" as const,
    message: "Found 2 supplier options via AI.",
    startedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 2 + 1000 * 5).toISOString(),
    input: { productName: "Portable Neck Fan" },
  },
  {
    id: "demo-3",
    moduleId: "copywriting",
    status: "completed" as const,
    message: "Listing copy generated via OpenRouter.",
    startedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 5 + 1000 * 8).toISOString(),
    input: { productName: "Pet Hair Remover Roller" },
  },
  {
    id: "demo-4",
    moduleId: "full-pipeline",
    status: "completed" as const,
    message: "Full pipeline completed for \"Magnetic Cable Organizer Clips\".",
    startedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 + 1000 * 45).toISOString(),
    input: { query: "desk accessories" },
  },
  {
    id: "demo-5",
    moduleId: "orders",
    status: "completed" as const,
    message: "Fetched 3 unfulfilled orders from Trendaryo.",
    startedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 48 + 1000 * 3).toISOString(),
    input: { autoPlace: "false" },
  },
];

export async function GET(request: NextRequest) {
  const auth = await requireAuthenticatedUserId();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  const { userId } = auth;

  const { searchParams } = new URL(request.url);
  const limit = Math.min(Number(searchParams.get("limit") ?? 50), 100);
  const moduleId = searchParams.get("module") ?? "";

  if (!getDb()) {
    const filtered = moduleId
      ? DEMO_HISTORY.filter((h) => h.moduleId === moduleId)
      : DEMO_HISTORY;
    return NextResponse.json({ runs: filtered.slice(0, limit), demo: true });
  }

  try {
    const all = await getUserAutomations(userId, limit);
    const filtered = moduleId ? all.filter((a) => a.moduleId === moduleId) : all;
    return NextResponse.json({
      runs: filtered.map((a) => ({
        id: a.id,
        moduleId: a.moduleId,
        status: a.status,
        message: a.message,
        startedAt: a.startedAt,
        completedAt: a.completedAt,
        input: a.input,
        steps: a.steps ?? [],
        output: a.output ?? {},
      })),
      demo: false,
    });
  } catch (err) {
    console.error("History fetch error:", err);
    return NextResponse.json({ error: "Failed to load history" }, { status: 500 });
  }
}

export async function DELETE() {
  const auth = await requireAuthenticatedUserId();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  const { userId } = auth;

  if (!getDb()) {
    return NextResponse.json({ success: true });
  }

  try {
    await deleteUserAutomations(userId);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("History clear error:", err);
    return NextResponse.json({ error: "Failed to clear history" }, { status: 500 });
  }
}
