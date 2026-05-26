import { persistAutomationRun, persistResearchProducts } from "@/lib/automation/persist";
import type { ResearchProduct } from "@/lib/automation/openrouter";
import { runAutomation } from "@/lib/automation/runner";
import type { AutomationJobResult } from "@/lib/automation/types";
import type { Settings } from "@/lib/database/types";
import { getSettings, saveSettings } from "@/lib/database/operations";
import { mergeSettings } from "@/lib/settings/defaults";
import { sendNotification } from "@/lib/notifications/service";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

const inProgress = new Set<string>();

export function frequencyToDays(
  frequency: Settings["automation"]["scanFrequency"],
): number {
  switch (frequency) {
    case "daily":
      return 1;
    case "monthly":
      return 30;
    default:
      return 7;
  }
}

export function computeNextScanAt(
  from: Date,
  frequency: Settings["automation"]["scanFrequency"],
): string {
  const next = new Date(from.getTime() + frequencyToDays(frequency) * MS_PER_DAY);
  return next.toISOString();
}

export function isScanDue(settings: Settings, now = new Date()): boolean {
  if (!settings.automation.scheduledScans) return false;

  if (settings.automation.nextScanAt) {
    return now >= new Date(settings.automation.nextScanAt);
  }

  if (!settings.automation.lastScanAt) return true;

  const last = new Date(settings.automation.lastScanAt);
  const next = new Date(
    last.getTime() + frequencyToDays(settings.automation.scanFrequency) * MS_PER_DAY,
  );
  return now >= next;
}

export async function runScheduledResearchForUser(
  userId: string,
  query?: string,
): Promise<AutomationJobResult> {
  if (inProgress.has(userId)) {
    return {
      moduleId: "product-research",
      status: "failed",
      message: "A scan is already running for this user.",
      output: {},
      steps: [],
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    };
  }

  inProgress.add(userId);

  try {
    const settings = mergeSettings(await getSettings(userId), userId);
    const scanQuery =
      query?.trim() ||
      settings.automation.scanQuery?.trim() ||
      "trending dropshipping products";

    const result = await runAutomation(
      "product-research",
      { query: scanQuery, scheduled: true },
      userId,
    );

    await persistAutomationRun(userId, { query: scanQuery, scheduled: true }, result);

    if (
      result.status === "completed" &&
      Array.isArray(result.output.products)
    ) {
      await persistResearchProducts(
        userId,
        result.output.products as ResearchProduct[],
      );
    }

    const now = new Date();
    await saveSettings(userId, {
      automation: {
        ...settings.automation,
        lastScanAt: now.toISOString(),
        nextScanAt: computeNextScanAt(now, settings.automation.scanFrequency),
        scanQuery,
      },
    });

    try {
      await sendNotification({
        type: "scan-summary",
        title: "Scheduled Research Scan Complete",
        message: result.message,
        userId,
        data: { productsFound: (result.output.products as any[])?.length || 0 },
      });
    } catch (notifyErr) {
      console.error("Failed to send scan notification:", notifyErr);
    }

    return result;
  } finally {
    inProgress.delete(userId);
  }
}

export async function getUsersDueForScan(): Promise<
  Array<{ userId: string; settings: Settings }>
> {
  const { getDb } = await import("@/lib/firebase");
  const db = getDb();
  if (!db) return [];

  const snapshot = await db
    .collection("settings")
    .where("automation.scheduledScans", "==", true)
    .get();

  const due: Array<{ userId: string; settings: Settings }> = [];

  for (const doc of snapshot.docs) {
    const raw = doc.data() as Partial<Settings>;
    const userId = raw.userId ?? doc.id;
    const settings = mergeSettings(raw, userId);
    if (isScanDue(settings)) {
      due.push({ userId, settings });
    }
  }

  return due;
}
