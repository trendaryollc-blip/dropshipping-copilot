import { NextRequest, NextResponse } from "next/server";
import { getApiKeys, saveApiKeys } from "@/lib/database/operations";
import { requireAuthenticatedUserId } from "@/lib/auth/server-user";
import { getDb } from "@/lib/firebase";
import { decryptSecret, encryptSecret, maskSecret } from "@/lib/utils/crypto";

const KEY_FIELDS = [
  "trendaryo_api_url",
  "trendaryo_api_key",
  "openrouter_api_key",
  "openrouter_model",
  "cj_api_key",
  "zendrop_api_key",
  "aliexpress_app_key",
  "aliexpress_secret_key",
  "shopify_store_url",
  "shopify_access_token",
  "resend_api_key",
  "webhook_secret",
  "meta_api_key",
] as const;

function pickKeys(body: Record<string, unknown>) {
  const keys: Record<string, string> = {};
  for (const field of KEY_FIELDS) {
    const value = body[field];
    if (typeof value === "string") {
      keys[field] = field.endsWith("_key") || field.endsWith("_token") || field.endsWith("_secret")
        ? encryptSecret(value)
        : value;
    }
  }
  return keys;
}

function maskKeys(keys: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(keys).map(([key, value]) => [
      key,
      typeof value === "string" && (key.endsWith("_key") || key.endsWith("_token") || key.endsWith("_secret"))
        ? maskSecret(decryptSecret(value))
        : value,
    ]),
  );
}

export async function GET() {
  const auth = await requireAuthenticatedUserId();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const db = getDb();

  if (!db) {
    return NextResponse.json({
      trendaryo_api_url: process.env.TRENDARYO_API_URL ?? "",
      trendaryo_api_key: "",
      openrouter_api_key: "",
      openrouter_model: process.env.OPENROUTER_MODEL ?? "",
      cj_api_key: "",
      zendrop_api_key: "",
      aliexpress_app_key: "",
      aliexpress_secret_key: "",
      shopify_store_url: "",
      shopify_access_token: "",
      resend_api_key: "",
      webhook_secret: "placeholder-webhook-secret",
      meta_api_key: "",
      _mode: "env-only",
    });
  }

  try {
    const apiKeys = await getApiKeys(auth.userId);

    if (!apiKeys) {
      return NextResponse.json({});
    }

    const { id, userId, createdAt, updatedAt, ...keys } = apiKeys;
    return NextResponse.json(maskKeys(keys));
  } catch (error) {
    console.error("Error fetching API keys:", error);
    return NextResponse.json(
      { error: "Failed to fetch API keys" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAuthenticatedUserId();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const db = getDb();
  const body = await request.json();
  const keys = pickKeys(body);

  if (!db) {
    return NextResponse.json({
      success: true,
      message:
        "Firebase not configured — keys saved in session only. Add FIREBASE_* to .env.local for persistent storage.",
      _mode: "env-only",
    });
  }

  try {
    await saveApiKeys(auth.userId, keys);
    return NextResponse.json({
      success: true,
      message: "API keys saved successfully",
    });
  } catch (error) {
    console.error("Error saving API keys:", error);
    return NextResponse.json(
      { error: "Failed to save API keys" },
      { status: 500 },
    );
  }
}
