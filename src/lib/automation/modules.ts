import type { ModuleDefinition } from "./types";

export const automationModules: ModuleDefinition[] = [
  {
    id: "product-research",
    name: "Winning Products",
    description:
      "Scan trends, ad libraries, and marketplaces to surface high-potential products.",
    href: "/research",
    icon: "🔍",
    capabilities: [
      "Trend & niche scoring",
      "Competitor ad discovery",
      "Margin & demand estimates",
    ],
  },
  {
    id: "suppliers",
    name: "Supplier Match",
    description:
      "Find reliable suppliers, compare pricing, and track shipping times.",
    href: "/suppliers",
    icon: "📦",
    capabilities: [
      "AliExpress / CJ / Zendrop lookup",
      "MOQ & unit cost comparison",
      "Supplier reliability score",
    ],
  },
  {
    id: "copywriting",
    name: "Product Copy",
    description:
      "Generate SEO titles, bullet points, and store-ready descriptions.",
    href: "/copy",
    icon: "✍️",
    capabilities: [
      "Title & meta description",
      "Benefit-driven bullets",
      "Brand voice presets",
    ],
  },
  {
    id: "orders",
    name: "Order Fulfillment",
    description:
      "Route orders to suppliers, sync tracking, and flag exceptions.",
    href: "/orders",
    icon: "🚚",
    capabilities: [
      "Auto place supplier orders",
      "Tracking sync to storefront",
      "Failed order alerts",
    ],
  },
  {
    id: "full-pipeline",
    name: "Full Autopilot",
    description:
      "Run research → supplier → copy → listing prep in one workflow.",
    href: "/",
    icon: "⚡",
    capabilities: [
      "End-to-end product launch",
      "Queued background jobs",
      "Weekly winning-product digest",
    ],
  },
];

export function getModule(id: string): ModuleDefinition | undefined {
  return automationModules.find((m) => m.id === id);
}
