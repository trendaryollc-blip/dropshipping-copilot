import { NextResponse } from "next/server"

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://your-dropease-app.com"
  const routes = [
    "",
    "products",
    "suppliers",
    "my-products",
    "orders",
    "returns",
    "customers",
    "shipping",
    "reviews",
    "finance/pnl",
    "analytics",
    "seo",
    "automation",
    "business",
    "multi-store",
    "mobile",
    "admin/billing",
    "admin/branding",
    "admin/reports",
  ]

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${routes
      .map(
        (route) => `
      <url>
        <loc>${baseUrl}/${route}</loc>
        <changefreq>weekly</changefreq>
        <priority>${route === "" ? "1.0" : "0.7"}</priority>
      </url>`
      )
      .join("")}
  </urlset>`

  return new NextResponse(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  })
}
