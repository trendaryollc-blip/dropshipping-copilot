export interface PlaceholderSupplierProduct {
  id: string;
  name: string;
  supplier: "zendrop" | "aliexpress";
  unitCost: number;
  shippingDays: string;
  rating: number;
  productUrl: string;
  inventory: number;
}

function buildPlaceholderProducts(query: string, supplier: "zendrop" | "aliexpress"): PlaceholderSupplierProduct[] {
  const base = query || "Winning Product";
  const multiplier = supplier === "zendrop" ? 1.15 : 0.92;
  return [
    {
      id: `${supplier}-mock-1`,
      name: `${base} Pro Variant`,
      supplier,
      unitCost: Number((4.85 * multiplier).toFixed(2)),
      shippingDays: supplier === "zendrop" ? "5-8" : "8-15",
      rating: supplier === "zendrop" ? 4.7 : 4.5,
      productUrl: `https://placeholder.${supplier}.example/products/mock-1`,
      inventory: 420,
    },
    {
      id: `${supplier}-mock-2`,
      name: `${base} Bundle Pack`,
      supplier,
      unitCost: Number((7.4 * multiplier).toFixed(2)),
      shippingDays: supplier === "zendrop" ? "6-10" : "10-18",
      rating: supplier === "zendrop" ? 4.6 : 4.4,
      productUrl: `https://placeholder.${supplier}.example/products/mock-2`,
      inventory: 860,
    },
  ];
}

export async function searchZendropProducts(query: string) {
  return {
    mode: "placeholder",
    supplier: "zendrop",
    products: buildPlaceholderProducts(query, "zendrop"),
  };
}

export async function searchAliExpressProducts(query: string) {
  return {
    mode: "placeholder",
    supplier: "aliexpress",
    products: buildPlaceholderProducts(query, "aliexpress"),
  };
}

export async function publishToShopify(product: { name: string; description?: string; price?: number }) {
  return {
    mode: "placeholder",
    published: true,
    listingId: `shopify-mock-${Date.now()}`,
    product,
    url: "https://placeholder-shop.myshopify.com/products/mock-product",
  };
}
