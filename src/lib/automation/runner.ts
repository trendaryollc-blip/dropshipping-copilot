import { DEFAULT_USER_ID } from "@/lib/constants";
import {
  hasCj,
  hasOpenRouter,
  hasTrendaryo,
  loadIntegrationConfig,
} from "@/lib/integrations/config";
import { matchSuppliers } from "@/lib/integrations/suppliers";
import { fetchUnfulfilledOrders, fulfillOrder } from "@/lib/integrations/trendaryo";
import {
  generateProductCopy,
  generateProductResearch,
} from "./openrouter";
import { fetchMetaTrends } from "@/lib/integrations/meta";
import type { AutomationJobResult, AutomationModuleId } from "./types";
import { sendNotification } from "@/lib/notifications/service";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const mockProducts = [
  {
    name: "Portable Neck Fan — USB Rechargeable",
    niche: "Summer gadgets",
    score: 87,
    estimatedMargin: "42%",
    trend: "Rising",
    whyItWins: "High summer demand with strong margins on lightweight SKUs.",
  },
  {
    name: "Pet Hair Remover Roller",
    niche: "Pet supplies",
    score: 81,
    estimatedMargin: "38%",
    trend: "Stable",
    whyItWins: "Evergreen pet niche with repeat purchase potential.",
  },
  {
    name: "Magnetic Cable Organizer Clips",
    niche: "Desk accessories",
    score: 79,
    estimatedMargin: "45%",
    trend: "Rising",
    whyItWins: "Low weight, impulse-buy friendly desk organization product.",
  },
];

function failed(
  moduleId: AutomationModuleId,
  startedAt: string,
  message: string,
  label = "Run automation",
): AutomationJobResult {
  return {
    moduleId,
    status: "failed",
    startedAt,
    completedAt: new Date().toISOString(),
    steps: [{ id: "1", label, status: "failed" }],
    output: {},
    message,
  };
}

export async function runAutomation(
  moduleId: AutomationModuleId,
  input: Record<string, unknown> = {},
  userId: string = DEFAULT_USER_ID,
): Promise<AutomationJobResult> {
  const startedAt = new Date().toISOString();
  const config = await loadIntegrationConfig(userId);

  const completed = (
    partial: Omit<AutomationJobResult, "moduleId" | "startedAt" | "completedAt">,
  ): AutomationJobResult => {
    const result: AutomationJobResult = {
      moduleId,
      startedAt,
      completedAt: new Date().toISOString(),
      ...partial,
    };

    // Fire notification (non-blocking)
    if (result.status === "completed") {
      sendNotification({
        type: "automation-complete",
        title: `${getModuleName(moduleId)} completed`,
        message: result.message,
        userId,
        data: { moduleId, outputSummary: Object.keys(result.output || {}).slice(0, 3) },
      });
    }
    return result;
  };

  function getModuleName(id: AutomationModuleId): string {
    return id.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase());
  }

  switch (moduleId) {
    case "product-research": {
      const query =
        (typeof input.query === "string" && input.query) ||
        (typeof input.productName === "string" && input.productName) ||
        "";

      if (hasOpenRouter(config)) {
        try {
          // NEW: Pull live Meta ad trends when key is configured
          let metaTrends: any = null;
          try {
            metaTrends = await fetchMetaTrends(config, query, 4);
          } catch {}

          const research = await generateProductResearch(query, config);
          return completed({
            status: "completed",
            message: `Found ${research.products.length} product ideas for "${research.query}".` + (metaTrends ? " (enhanced with Meta ad trends)" : ""),
            steps: [
              { id: "1", label: "Analyze niche & trends", status: "completed" },
              { id: "2", label: "Score opportunities", status: "completed" },
              { id: "3", label: "Rank winning products", status: "completed" },
            ],
            output: { ...research, savedToLibrary: true, metaTrends },
          });
        } catch (err) {
          return failed(
            moduleId,
            startedAt,
            err instanceof Error ? err.message : "Product research failed",
            "Research products",
          );
        }
      }

      await delay(300);
      return completed({
        status: "completed",
        message:
          "Demo results shown. Add OpenRouter API key in Settings for live AI research.",
        steps: [
          { id: "1", label: "Scan trend sources", status: "completed" },
          { id: "2", label: "Score products", status: "completed" },
          { id: "3", label: "Rank winners", status: "completed" },
        ],
        output: { query: query || "general", products: mockProducts, demo: true },
      });
    }

    case "suppliers": {
      const productName =
        (typeof input.productName === "string" && input.productName) ||
        "Portable Neck Fan";

      if (hasCj(config) || hasOpenRouter(config)) {
        try {
          const match = await matchSuppliers(config, productName);
          return completed({
            status: "completed",
            message: `Found ${match.suppliers.length} supplier options via ${match.source.toUpperCase()}.`,
            steps: [
              { id: "1", label: "Search supplier catalogs", status: "completed" },
              {
                id: "2",
                label: "Compare unit cost & shipping",
                status: "completed",
              },
              { id: "3", label: "Rank best match", status: "completed" },
            ],
            output: {
              product: match.product,
              suppliers: match.suppliers,
              source: match.source,
            },
          });
        } catch (err) {
          return failed(
            moduleId,
            startedAt,
            err instanceof Error ? err.message : "Supplier search failed",
            "Search suppliers",
          );
        }
      }

      await delay(300);
      return completed({
        status: "completed",
        message: "Demo supplier matches. Connect CJ or OpenRouter in Settings.",
        steps: [
          { id: "1", label: "Search supplier catalogs", status: "completed" },
          { id: "2", label: "Compare unit cost & shipping", status: "completed" },
          { id: "3", label: "Rank best match", status: "completed" },
        ],
        output: {
          product: productName,
          demo: true,
          suppliers: [
            {
              name: "Supplier A (AliExpress)",
              platform: "aliexpress",
              unitCost: 4.2,
              shippingDays: "12–18",
              rating: 4.7,
            },
            {
              name: "Supplier B (CJ Dropshipping)",
              platform: "cj",
              unitCost: 5.1,
              shippingDays: "8–14",
              rating: 4.8,
            },
          ],
        },
      });
    }

    case "copywriting": {
      if (!hasOpenRouter(config)) {
        const productName = typeof input.productName === "string" ? input.productName : "Winning Product";
        await delay(250);
        return completed({
          status: "completed",
          message: "Placeholder listing copy generated. Add OpenRouter for live AI copy.",
          steps: [
            { id: "1", label: "Analyze product attributes", status: "completed" },
            { id: "2", label: "Draft store copy", status: "completed" },
            { id: "3", label: "Optimize for SEO", status: "completed" },
          ],
          output: {
            title: `${productName} | High-Demand Everyday Upgrade`,
            description: `${productName} helps customers solve a clear everyday problem with a simple, affordable, and giftable solution. Built for impulse-buy campaigns and conversion-focused product pages.`,
            bulletPoints: ["Clear problem-solution positioning", "Lightweight and easy to ship", "Strong visual ad angle", "Suitable for bundles and upsells"],
            seoKeywords: [productName.toLowerCase(), "dropshipping product", "viral product", "online store"],
          },
        });
      }

      try {
        const copy = await generateProductCopy(
          {
            productName:
              typeof input.productName === "string"
                ? input.productName
                : undefined,
            tone: typeof input.tone === "string" ? input.tone : undefined,
          },
          config,
        );

        return completed({
          status: "completed",
          message: "Listing copy generated via OpenRouter.",
          steps: [
            {
              id: "1",
              label: "Analyze product attributes",
              status: "completed",
            },
            { id: "2", label: "Draft store copy", status: "completed" },
            { id: "3", label: "Optimize for SEO", status: "completed" },
          ],
          output: { ...copy },
        });
      } catch (err) {
        return failed(
          moduleId,
          startedAt,
          err instanceof Error ? err.message : "Copy generation failed",
          "Generate copy",
        );
      }
    }

    case "orders": {
      if (hasTrendaryo(config)) {
        try {
          const orders = await fetchUnfulfilledOrders(config);
          const autoPlace = input.autoPlace === true || input.autoPlace === "true";
          const results: Array<{
            id: string;
            status: string;
            tracking: string;
          }> = [];

          for (const order of orders.slice(0, 10)) {
            if (autoPlace) {
              try {
                const fulfilled = await fulfillOrder(config, order.id);
                results.push({
                  id: order.id,
                  status: "placed",
                  tracking: fulfilled.tracking ?? "pending",
                });
              } catch {
                results.push({
                  id: order.id,
                  status: "failed",
                  tracking: order.tracking ?? "—",
                });
              }
            } else {
              results.push({
                id: order.id,
                status: order.status,
                tracking: order.tracking ?? "pending",
              });
            }
          }

          const placed = results.filter((r) => r.status === "placed").length;
          const failedCount = results.filter((r) => r.status === "failed").length;

          return completed({
            status: "completed",
            message: autoPlace
              ? `Processed ${results.length} orders from Trendaryo (${placed} placed, ${failedCount} failed).`
              : `Fetched ${results.length} unfulfilled orders from Trendaryo.`,
            steps: [
              {
                id: "1",
                label: "Fetch unfulfilled orders",
                status: "completed",
              },
              {
                id: "2",
                label: autoPlace ? "Place supplier orders" : "Review order queue",
                status: "completed",
              },
              {
                id: "3",
                label: "Sync tracking numbers",
                status: "completed",
              },
            ],
            output: {
              processed: results.length,
              placed,
              failed: failedCount,
              orders: results,
              source: "trendaryo",
            },
          });
        } catch (err) {
          return failed(
            moduleId,
            startedAt,
            err instanceof Error ? err.message : "Order sync failed",
            "Fetch orders",
          );
        }
      }

      await delay(300);
      return completed({
        status: "completed",
        message:
          "Demo order run. Connect Trendaryo API URL and key in Settings for live orders.",
        steps: [
          { id: "1", label: "Fetch unfulfilled orders", status: "completed" },
          { id: "2", label: "Place supplier orders", status: "completed" },
          { id: "3", label: "Sync tracking numbers", status: "completed" },
        ],
        output: {
          demo: true,
          processed: 3,
          placed: 3,
          failed: 0,
          orders: [
            { id: "#1042", status: "placed", tracking: "pending" },
            { id: "#1041", status: "placed", tracking: "LP123456789CN" },
            { id: "#1040", status: "placed", tracking: "LP987654321CN" },
          ],
        },
      });
    }

    case "full-pipeline": {
      const query =
        (typeof input.query === "string" && input.query) ||
        (typeof input.niche === "string" && input.niche) ||
        "trending dropshipping products";

      const steps: AutomationJobResult["steps"] = [];
      const output: Record<string, unknown> = { query };

      try {
        steps.push({ id: "1", label: "Product research", status: "running" });
        const researchResult = await runAutomation(
          "product-research",
          { query },
          userId,
        );
        if (researchResult.status === "failed") {
          return failed(moduleId, startedAt, researchResult.message, "Product research");
        }
        steps[0] = { id: "1", label: "Product research", status: "completed" };

        const products = researchResult.output.products as
          | Array<{ name: string; score?: number }>
          | undefined;
        const topProduct = products?.[0];
        if (!topProduct?.name) {
          return failed(moduleId, startedAt, "No products found in research step");
        }
        output.product = topProduct;

        steps.push({ id: "2", label: "Supplier match", status: "running" });
        const supplierResult = await runAutomation(
          "suppliers",
          { productName: topProduct.name },
          userId,
        );
        if (supplierResult.status === "failed") {
          return failed(moduleId, startedAt, supplierResult.message, "Supplier match");
        }
        steps[1] = { id: "2", label: "Supplier match", status: "completed" };
        output.suppliers = supplierResult.output.suppliers;
        output.supplier =
          (supplierResult.output.suppliers as Array<{ name: string }>)?.[0]
            ?.name ?? null;

        if (hasOpenRouter(config)) {
          steps.push({ id: "3", label: "Copy generation", status: "running" });
          const copyResult = await runAutomation(
            "copywriting",
            { productName: topProduct.name, tone: "premium and persuasive" },
            userId,
          );
          if (copyResult.status === "failed") {
            return failed(moduleId, startedAt, copyResult.message, "Copy generation");
          }
          steps[2] = { id: "3", label: "Copy generation", status: "completed" };
          output.copy = copyResult.output;
        } else {
          steps.push({
            id: "3",
            label: "Copy generation (skipped — no OpenRouter)",
            status: "completed",
          });
        }

        steps.push({ id: "4", label: "Listing prep export", status: "completed" });
        output.readyToPublish = true;

        return completed({
          status: "completed",
          message: `Full pipeline completed for "${topProduct.name}".`,
          steps,
          output,
        });
      } catch (err) {
        return failed(
          moduleId,
          startedAt,
          err instanceof Error ? err.message : "Pipeline failed",
        );
      }
    }

    default:
      return failed(moduleId, startedAt, "Unknown module");
  }
}
