import crypto from "crypto";

export function signWebhookPayload(payload: unknown, secret: string): string {
  const body = typeof payload === "string" ? payload : JSON.stringify(payload);
  return crypto.createHmac("sha256", secret).update(body).digest("hex");
}

export function verifyWebhookSignature(payload: unknown, signature: string, secret: string): boolean {
  const expected = signWebhookPayload(payload, secret);
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}

export function buildWebhookHeaders(payload: unknown, secret: string) {
  return {
    "content-type": "application/json",
    "x-dropship-signature": signWebhookPayload(payload, secret),
    "x-dropship-timestamp": new Date().toISOString(),
  };
}
