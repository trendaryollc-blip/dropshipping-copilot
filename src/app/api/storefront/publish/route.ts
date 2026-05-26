import { getStorefrontAdapter } from "@/lib/storefront/adapter";
import { validateObject } from "@/lib/utils/validation";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const validation = validateObject<{ title: string; price: number }>(body, {
    title: { required: true, type: "string", min: 2 },
    price: { required: true, type: "number", min: 0 },
  });

  if (!validation.ok) {
    return Response.json({ errors: validation.errors }, { status: 400 });
  }

  const result = await getStorefrontAdapter().publishProduct({
    title: validation.data.title,
    price: validation.data.price,
    description: typeof body.description === "string" ? body.description : undefined,
    tags: Array.isArray(body.tags) ? body.tags.map(String) : [],
    images: Array.isArray(body.images) ? body.images.map(String) : [],
    status: body.status === "active" ? "active" : "draft",
    variants: Array.isArray(body.variants) ? body.variants as never : [],
  });

  return Response.json({ mode: "placeholder", result });
}
