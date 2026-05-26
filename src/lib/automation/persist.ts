import { createAutomation, createProduct } from "@/lib/database/operations";
import { getDb } from "@/lib/firebase";
import type { ResearchProduct } from "./openrouter";
import type { AutomationJobResult } from "./types";

export async function persistAutomationRun(
  userId: string,
  input: Record<string, unknown>,
  result: AutomationJobResult,
): Promise<string | null> {
  if (!getDb()) return null;

  try {
    const id = await createAutomation({
      userId,
      moduleId: result.moduleId,
      status: result.status === "failed" ? "failed" : "completed",
      input,
      output: result.output,
      steps: result.steps.map((s) => ({
        ...s,
        status: s.status === "idle" ? "completed" : s.status,
      })),
      message: result.message,
      startedAt: result.startedAt,
      completedAt: result.completedAt,
    });
    return id;
  } catch (err) {
    console.error("Failed to persist automation run:", err);
    return null;
  }
}

export async function persistResearchProducts(
  userId: string,
  products: ResearchProduct[],
): Promise<number> {
  if (!getDb() || products.length === 0) return 0;

  const seen = new Set<string>();
  let saved = 0;

  for (const p of products) {
    if (!p.name || seen.has(p.name)) continue;
    seen.add(p.name);

    try {
      await createProduct({
        userId,
        name: p.name,
        niche: p.niche,
        trend: p.trend,
        estimatedMargin: p.estimatedMargin,
        score: p.score,
        whyItWins: p.whyItWins,
      });
      saved += 1;
    } catch (err) {
      console.error("Failed to save product:", p.name, err);
    }
  }
  return saved;
}
