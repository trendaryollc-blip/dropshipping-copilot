import assert from "node:assert/strict";
import test from "node:test";
import { createHmac } from "node:crypto";

function signWebhookPayload(payload, secret) {
  const body = typeof payload === "string" ? payload : JSON.stringify(payload);
  return createHmac("sha256", secret).update(body).digest("hex");
}

function getRetryDelay(attempt, policy = { baseDelayMs: 30000, maxDelayMs: 900000 }) {
  const delay = policy.baseDelayMs * 2 ** Math.max(0, attempt - 1);
  return Math.min(delay, policy.maxDelayMs);
}

test("webhook signature is deterministic", () => {
  const payload = { event: "order.created", id: "order-1" };
  assert.equal(signWebhookPayload(payload, "secret"), signWebhookPayload(payload, "secret"));
  assert.notEqual(signWebhookPayload(payload, "secret"), signWebhookPayload(payload, "other-secret"));
});

test("retry delay backs off and caps", () => {
  assert.equal(getRetryDelay(1), 30000);
  assert.equal(getRetryDelay(2), 60000);
  assert.equal(getRetryDelay(10), 900000);
});
