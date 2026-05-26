import { getSettings } from "@/lib/database/operations";
import { loadIntegrationConfig } from "@/lib/integrations/config";
import { sendEmail } from "./resend";

export interface NotificationPayload {
  type: "automation-complete" | "order-update" | "scan-summary" | "error";
  title: string;
  message: string;
  userId: string;
  data?: Record<string, unknown>;
}

export async function sendNotification(payload: NotificationPayload): Promise<void> {
  try {
    const settings = await getSettings(payload.userId);
    const notifications = settings?.notifications;
    if (!notifications) return;

    const promises: Promise<void>[] = [];

    if (notifications.slack && notifications.slackWebhook) {
      promises.push(sendToSlack(notifications.slackWebhook, payload));
    }

    if (notifications.email) {
      promises.push(sendEmail(payload));
    }

    await Promise.allSettled(promises);
  } catch (err) {
    console.error("Notification send failed (non-fatal):", err);
  }
}

async function sendToSlack(webhook: string, payload: NotificationPayload) {
  const text = `*${payload.title}*\n${payload.message}\n${payload.data ? JSON.stringify(payload.data, null, 2) : ""}`;
  await fetch(webhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
}
