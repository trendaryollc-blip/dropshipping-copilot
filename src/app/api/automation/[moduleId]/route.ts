import { NextRequest, NextResponse } from "next/server";
import {
  persistAutomationRun,
  persistResearchProducts,
} from "@/lib/automation/persist";
import { runAutomation } from "@/lib/automation/runner";
import type { ResearchProduct } from "@/lib/automation/openrouter";
import type { AutomationModuleId } from "@/lib/automation/types";
import { requireAuthenticatedUserId } from "@/lib/auth/server-user";
import { createAuditLog } from "@/lib/database/operations";

const validModules: AutomationModuleId[] = [
  "product-research",
  "suppliers",
  "copywriting",
  "orders",
  "full-pipeline",
];

export async function POST(
  request: Request,
  context: { params: Promise<{ moduleId: string }> },
) {
  const { moduleId } = await context.params;

  if (!validModules.includes(moduleId as AutomationModuleId)) {
    return NextResponse.json({ error: "Invalid module" }, { status: 400 });
  }

  if (request.headers.get("content-type")?.includes("application/json")) {
    const contentLength = request.headers.get("content-length");
    if (contentLength && parseInt(contentLength, 10) > 100 * 1024) {
      return NextResponse.json(
        { error: "Request body too large (max 100KB)" },
        { status: 413 },
      );
    }
  }

  let input: Record<string, unknown> = {};
  try {
    input = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON in request body" },
      { status: 400 },
    );
  }

  const auth = await requireAuthenticatedUserId();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  const { userId } = auth;

  const result = await runAutomation(
    moduleId as AutomationModuleId,
    input,
    userId,
  );

  if (
    result.moduleId === "product-research" &&
    result.status === "completed" &&
    Array.isArray(result.output.products)
  ) {
    await persistResearchProducts(
      userId,
      result.output.products as ResearchProduct[],
    );
  }

  await persistAutomationRun(userId, input, result);

  await createAuditLog({
    userId,
    action: "run",
    resource: moduleId as AutomationModuleId,
    detail: result.message,
    metadata: { status: result.status, steps: result.steps.length },
  });

  if (result.status === "failed") {
    return NextResponse.json(result, { status: 502 });
  }
  return NextResponse.json(result);
}
