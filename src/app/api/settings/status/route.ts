import { NextResponse } from "next/server";
import { requireAuthenticatedUserId } from "@/lib/auth/server-user";
import {
  integrationStatus,
  loadIntegrationConfig,
} from "@/lib/integrations/config";

export async function GET() {
  const auth = await requireAuthenticatedUserId();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const config = await loadIntegrationConfig(auth.userId);
  const status = integrationStatus(config);

  return NextResponse.json({
    integrations: status,
    readyForLive:
      status.openrouter &&
      (status.trendaryo || status.cj),
    message: status.openrouter
      ? status.trendaryo
        ? "Store and AI connected — ready for live automations."
        : "AI connected. Add Trendaryo for live order fulfillment."
      : "Add OpenRouter in Settings to enable AI modules.",
  });
}
