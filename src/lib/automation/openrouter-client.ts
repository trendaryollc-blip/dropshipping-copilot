import type { IntegrationConfig } from "@/lib/integrations/config";
import { loadIntegrationConfig } from "@/lib/integrations/config";

export async function openRouterChat(
  system: string,
  user: string,
  temperature = 0.7,
): Promise<string> {
  const config = await loadIntegrationConfig();
  return openRouterChatWithConfig(config, system, user, temperature);
}

export async function openRouterChatWithConfig(
  config: IntegrationConfig,
  system: string,
  user: string,
  temperature = 0.7,
): Promise<string> {
  const apiKey = config.openrouter.apiKey;
  if (!apiKey) {
    throw new Error(
      "OpenRouter API key is not set. Add it in Settings or OPENROUTER_API_KEY in .env.local.",
    );
  }

  const model = config.openrouter.model || "openai/gpt-4o-mini";

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60000);

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": config.openrouter.siteUrl,
      "X-Title": "Dropship Autopilot",
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      temperature,
    }),
    signal: controller.signal,
  });

  clearTimeout(timeout);

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(
      `OpenRouter request failed (${response.status}): ${detail.slice(0, 300)}`,
    );
  }

  const data = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
  };

  const content = data.choices?.[0]?.message?.content?.trim();
  if (!content) {
    throw new Error("OpenRouter returned an empty response");
  }

  return content;
}

export function parseJsonFromModel<T>(raw: string): T {
  const trimmed = raw.trim().replace(/^```json\s*/i, "").replace(/```\s*$/, "");
  return JSON.parse(trimmed) as T;
}

export function hasOpenRouterKey(): boolean {
  return Boolean(process.env.OPENROUTER_API_KEY?.trim());
}

export async function hasOpenRouterKeyAsync(): Promise<boolean> {
  const config = await loadIntegrationConfig();
  return Boolean(config.openrouter.apiKey);
}
