import type { IntegrationConfig } from "./config";
import { hasOpenRouter } from "./config";
import { openRouterChatWithConfig } from "@/lib/automation/openrouter-client";

export interface MetaTrend {
  keyword: string;
  trends: Array<{ headline: string; spend: string; score: number }>;
  source: string;
}

function generateDemoTrends(keyword: string, limit = 5): MetaTrend["trends"] {
  const templates: Array<() => { headline: string; spend: string; score: number }> = [
    () => ({ headline: keyword + " - The Ultimate Buyer Guide for 2026", spend: "high", score: 87 }),
    () => ({ headline: "Why Everyone Is Buying " + keyword + " in 2026", spend: "high", score: 91 }),
    () => ({ headline: "Top 5 " + keyword + " Trends You Can not Ignore This Summer", spend: "medium", score: 78 }),
    () => ({ headline: keyword + " That Went Viral on TikTok - Here Is Why", spend: "high", score: 94 }),
    () => ({ headline: "Best Budget " + keyword + " Under $50 - Real Reviews", spend: "medium", score: 82 }),
    () => ({ headline: keyword + " Dropshipped: What Suppliers Do not Tell You", spend: "low", score: 71 }),
    () => ({ headline: "I Tried " + keyword + " for 30 Days - Honest Review", spend: "high", score: 88 }),
    () => ({ headline: keyword + " on Amazon: The Secret to 10K per Month in Sales", spend: "medium", score: 76 }),
    () => ({ headline: "Unboxing " + keyword + " - Is It Worth the Hype?", spend: "low", score: 69 }),
    () => ({ headline: keyword + " Reseller Success Story: $8K in 60 Days", spend: "medium", score: 84 }),
  ];

  const shuffled = templates.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, limit).map((t, i) => {
    const r = t();
    return { ...r, score: Math.max(50, r.score - i * 2) };
  });
}

export async function fetchMetaTrends(
  config: IntegrationConfig,
  keyword: string,
  limit = 5,
): Promise<MetaTrend> {
  const key = config.meta.apiKey;
  const query = keyword.trim() || "dropshipping";

  if (key && hasOpenRouter(config)) {
    try {
      const aiResult = await openRouterChatWithConfig(
        config,
        "You are a Meta/Facebook ad performance analyst. Respond with valid JSON only.",
        "Analyze current high-performing Meta/Facebook ads for " + query + ". Return " + limit + " ad headlines with estimated spend level (low/medium/high) and a 0-100 opportunity score. Respond ONLY as JSON: { \"trends\": [{ \"headline\": \"...\", \"spend\": \"medium\", \"score\": 82 }] }",
        0.5,
      );
      const parsed = JSON.parse(aiResult || "{}");
      if (parsed.trends?.length) {
        return { keyword: query, trends: parsed.trends.slice(0, limit), source: "meta+ai" };
      }
    } catch (e) {
      console.warn("Meta AI trend enhancement failed:", e);
    }
  }

  return {
    keyword: query,
    trends: generateDemoTrends(query, limit),
    source: key ? "meta+ai-fallback" : "meta-demo",
  };
}
