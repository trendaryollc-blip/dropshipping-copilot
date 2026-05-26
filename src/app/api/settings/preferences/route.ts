import { NextRequest, NextResponse } from "next/server";
import { requireAuthenticatedUserId } from "@/lib/auth/server-user";
import { getSettings, saveSettings } from "@/lib/database/operations";
import type { Settings } from "@/lib/database/types";
import { mergeSettings } from "@/lib/settings/defaults";
import { computeNextScanAt } from "@/lib/schedules/research-scan";

export async function GET() {
  const auth = await requireAuthenticatedUserId();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const stored = await getSettings(auth.userId);
    const settings = mergeSettings(stored, auth.userId);
    return NextResponse.json(settings);
  } catch (error) {
    console.error("Failed to load preferences:", error);
    return NextResponse.json(
      { error: "Failed to load preferences" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAuthenticatedUserId();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const body = await request.json();
    const stored = mergeSettings(await getSettings(auth.userId), auth.userId);

    const automation: Settings["automation"] = {
      ...stored.automation,
      ...(typeof body.autoFulfillOrders === "boolean"
        ? { autoFulfillOrders: body.autoFulfillOrders }
        : {}),
      ...(typeof body.autoSyncTracking === "boolean"
        ? { autoSyncTracking: body.autoSyncTracking }
        : {}),
      ...(typeof body.scheduledScans === "boolean"
        ? { scheduledScans: body.scheduledScans }
        : {}),
      ...(body.scanFrequency === "daily" ||
      body.scanFrequency === "weekly" ||
      body.scanFrequency === "monthly"
        ? { scanFrequency: body.scanFrequency }
        : {}),
      ...(typeof body.scanQuery === "string"
        ? { scanQuery: body.scanQuery.trim() }
        : {}),
    };

    if (body.scheduledScans === true && !stored.automation.nextScanAt) {
      automation.nextScanAt = computeNextScanAt(
        new Date(),
        automation.scanFrequency,
      );
    }

    if (body.scheduledScans === false) {
      automation.nextScanAt = undefined;
    }

    const notifications = {
      ...stored.notifications,
      ...(typeof body.email === "boolean" ? { email: body.email } : {}),
      ...(typeof body.slack === "boolean" ? { slack: body.slack } : {}),
      ...(typeof body.slackWebhook === "string" ? { slackWebhook: body.slackWebhook.trim() || undefined } : {}),
    };

    const preferences = {
      ...stored.preferences,
      ...(typeof body.defaultCurrency === "string"
        ? { defaultCurrency: body.defaultCurrency }
        : {}),
      ...(typeof body.timezone === "string" ? { timezone: body.timezone } : {}),
    };

    await saveSettings(auth.userId, {
      notifications,
      automation,
      preferences,
    });

    const updated = mergeSettings(await getSettings(auth.userId), auth.userId);
    return NextResponse.json({ success: true, settings: updated });
  } catch (error) {
    console.error("Failed to save preferences:", error);
    return NextResponse.json(
      { error: "Failed to save preferences" },
      { status: 500 },
    );
  }
}
