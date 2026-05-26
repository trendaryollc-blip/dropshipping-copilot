import type { NotificationPayload } from "./service";
import { getUser } from "@/lib/database/operations";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.EMAIL_FROM ?? "Dropship Autopilot <autopilot@yourdomain.com>";

interface ResendError {
  message: string;
  statusCode: number;
}

export async function sendEmail(payload: NotificationPayload): Promise<void> {
  if (!RESEND_API_KEY) {
    console.log(`[EMAIL] No RESEND_API_KEY configured. Would send to ${payload.userId}: ${payload.title} — ${payload.message}`);
    return;
  }

  let emailTo = payload.userId;
  try {
    const user = await getUser(payload.userId);
    if (user?.email) {
      emailTo = user.email;
    }
  } catch {
    // fallback to userId
  }

  const subject = `[Dropship Autopilot] ${payload.title}`;
  const text = `${payload.title}\n\n${payload.message}\n\n${payload.data ? JSON.stringify(payload.data, null, 2) : ""}`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: emailTo,
        subject,
        text,
      }),
    });

    if (!res.ok) {
      const err = (await res.json()) as ResendError;
      console.error(`[EMAIL] Resend error ${err.statusCode}: ${err.message}`);
    }
  } catch (err) {
    console.error("[EMAIL] Failed to send email:", err);
  }
}

export function isEmailConfigured(): boolean {
  return Boolean(RESEND_API_KEY);
}