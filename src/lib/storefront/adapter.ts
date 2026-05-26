export interface StorefrontProductInput {
  title: string;
  description?: string;
  price: number;
  sku?: string;
  tags?: string[];
  images?: string[];
  status?: "draft" | "active";
  variants?: { title: string; sku?: string; price: number; inventory?: number }[];
}

export interface StorefrontAdapter {
  publishProduct(input: StorefrontProductInput): Promise<{ id: string; url: string; status: string }>;
  syncInventory(productId: string, quantity: number): Promise<{ success: boolean }>;
  importOrders(): Promise<{ imported: number }>;
}

export class PlaceholderStorefrontAdapter implements StorefrontAdapter {
  async publishProduct(input: StorefrontProductInput) {
    return {
      id: `storefront-product-${Date.now()}`,
      url: `https://placeholder-store.example/products/${encodeURIComponent(input.title.toLowerCase().replace(/\s+/g, "-"))}`,
      status: input.status ?? "draft",
    };
  }

  async syncInventory() {
    return { success: true };
  }

  async importOrders() {
    return { imported: 2 };
  }
}

export function getStorefrontAdapter(): StorefrontAdapter {
  return new PlaceholderStorefrontAdapter();
}
