/**
 * server-seed.js — Node.js seed script using the Firebase CLI access token + Firestore REST API.
 *
 * Reads the token from the Firebase CLI credential cache (~/.config/configstore/firebase-tools.json)
 * and writes mock data directly to Firestore via the v1 REST API, bypassing
 * SDKs … service accounts … and Firestore rules entirely.
 *
 * Run:
 *   node src/lib/server-seed.js
 */
"use strict"

const fs = require("fs")
const path = require("path")
const { https } = require("follow-redirects")

// ── 1. Load CLI access token ──────────────────────────────────────────────────
const CONFIG_PATH = path.join(require("os").homedir(), ".config", "configstore", "firebase-tools.json")
let token
try {
  const cfg = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"))
  token = cfg.tokens?.access_token || cfg.tokens?.refresh_token
  if (!token) throw new Error("No token found in firebase-tools.json")
} catch (e) {
  console.error("ERROR: Cannot read Firebase CLI token:", e.message)
  console.error("       Run: firebase login  (or firebase login:ci)")
  process.exit(1)
}

// ── 2. Firestore helpers ──────────────────────────────────────────────────────
const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "trendaryo-automation-prod"
const BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`

function toProtoVal(value) {
  if (value === null || value === undefined) return { nullValue: "NULL_VALUE" }
  if (typeof value === "boolean") return { booleanValue: value }
  if (typeof value === "number") return { integerValue: String(Math.trunc(value)) }
  if (typeof value === "string") return { stringValue: value }
  if (Array.isArray(value)) return { arrayValue: { values: value.map(toProtoVal) } }
  if (typeof value === "object") {
    const fields = {}
    for (const [k, v] of Object.entries(value)) fields[k] = toProtoVal(v)
    return { mapValue: { fields } }
  }
  return { stringValue: String(value) }
}

function toDoc(body) {
  const fields = {}
  for (const [k, v] of Object.entries(body)) fields[k] = toProtoVal(v)
  return { fields }
}

function patchDoc(collection, docId, data) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(toDoc(data))
    const req = https.request(
      {
        hostname: "firestore.googleapis.com",
        path: `${BASE}/${collection}/${docId}`,
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
      (res) => {
        let d = ""
        res.on("data", (chunk) => (d += chunk))
        res.on("end", () => {
          if (res.statusCode < 200 || res.statusCode >= 300) {
            reject(new Error(`PATCH ${collection}/${docId} → ${res.statusCode}: ${d.slice(0, 200)}`))
          } else {
            resolve(JSON.parse(d))
          }
        })
      },
    )
    req.on("error", reject)
    req.write(body)
    req.end()
  })
}

function batchCreate(collection, docs) {
  return (async () => {
    let written = 0
    for (const doc of docs) {
      try {
        await patchDoc(collection, doc.id, doc)
        written++
      } catch (e) {
        console.error(`  ⚠  ${collection}/${doc.id}:`, e.message.slice(0, 120))
      }
    }
    return written
  })()
}

// ── 3. Call main ──────────────────────────────────────────────────────────────
main().catch((e) => {
  console.error("FATAL:", e.message)
  process.exit(1)
})

// ── 4. Data + orchestration ──────────────────────────────────────────────────
async function main() {
  console.log(`\n🌱  DropEase Firestore seed — project: ${PROJECT_ID}\n`)

  // Embedded mock data (extracted from src/lib/mock-data.ts)
  const md = {
    products: [
      { id: "1", name: "Wireless Earbuds Pro", image: "https://picsum.photos/seed/earbuds/400/300", niche: "Electronics", priceRange: { min: 15, max: 45 }, competition: "low", trendScore: 87, supplierName: "TechSupply Co", status: "active", trendaryoUrl: "/products/wireless-earbuds-pro", price: 2499, currency: "INR", priceLastUpdated: "2026-05-18T04:00:00Z", importedAt: "2024-01-10", views: 1240 },
      { id: "2", name: "Minimalist Watch Band", image: "https://picsum.photos/seed/watch/400/300", niche: "Fashion", priceRange: { min: 5, max: 18 }, competition: "medium", trendScore: 72, supplierName: "FashionHub", status: "active", importedAt: "2024-01-12", views: 870 },
      { id: "3", name: "Portable LED Desk Lamp", image: "https://picsum.photos/seed/lamp/400/300", niche: "Home & Garden", priceRange: { min: 12, max: 35 }, competition: "low", trendScore: 91, supplierName: "HomeGoods Direct", status: "draft", importedAt: "2024-01-08", views: 630 },
      { id: "4", name: "Bamboo Cutting Board Set", image: "https://picsum.photos/seed/bamboo/400/300", niche: "Home & Garden", priceRange: { min: 8, max: 25 }, competition: "medium", trendScore: 65, supplierName: "EcoSupply", status: "active", trendaryoUrl: "/products/bamboo-cutting-board-set", price: 699, currency: "INR", priceLastUpdated: "2026-05-18T04:00:00Z", importedAt: "2024-01-08", views: 450 },
      { id: "5", name: "Facial Roller Massager", image: "https://picsum.photos/seed/roller/400/300", niche: "Beauty", priceRange: { min: 6, max: 20 }, competition: "high", trendScore: 78, supplierName: "BeautyPro", status: "active", trendaryoUrl: "/products/facial-roller-massager", price: 599, currency: "INR", priceLastUpdated: "2026-05-18T04:00:00Z", importedAt: "2024-01-15", views: 2100 },
      { id: "6", name: "Resistance Band Set", image: "https://picsum.photos/seed/bands/400/300", niche: "Sports", priceRange: { min: 10, max: 30 }, competition: "low", trendScore: 83, supplierName: "FitGear Supply", status: "draft", importedAt: "2024-01-10", views: 380 },
      { id: "7", name: "Phone Grip Stand", image: "https://picsum.photos/seed/phonegrip/400/300", niche: "Electronics", priceRange: { min: 3, max: 12 }, competition: "high", trendScore: 55, supplierName: "TechSupply Co", status: "archived", importedAt: "2024-01-07", views: 980 },
      { id: "8", name: "Reusable Water Bottle", image: "https://picsum.photos/seed/bottle/400/300", niche: "Sports", priceRange: { min: 8, max: 22 }, competition: "medium", trendScore: 70, supplierName: "EcoSupply", status: "active", trendaryoUrl: "/products/reusable-water-bottle", price: 499, currency: "INR", priceLastUpdated: "2026-05-18T04:00:00Z", importedAt: "2024-01-09", views: 760 },
      { id: "9", name: "Candle Making Kit", image: "https://picsum.photos/seed/candle/400/300", niche: "Home & Garden", priceRange: { min: 18, max: 40 }, competition: "low", trendScore: 80, supplierName: "HomeGoods Direct", status: "active", importedAt: "2024-01-11", views: 510 },
      { id: "10", name: "Magnetic Phone Wallet", image: "https://picsum.photos/seed/wallet/400/300", niche: "Fashion", priceRange: { min: 4, max: 15 }, competition: "medium", trendScore: 68, supplierName: "FashionHub", status: "draft", importedAt: "2024-01-10", views: 340 },
      { id: "11", name: "Essential Oil Diffuser", image: "https://picsum.photos/seed/diffuser/400/300", niche: "Beauty", priceRange: { min: 14, max: 38 }, competition: "medium", trendScore: 75, supplierName: "BeautyPro", status: "active", trendaryoUrl: "/products/essential-oil-diffuser", price: 899, currency: "INR", priceLastUpdated: "2026-05-18T04:00:00Z", importedAt: "2024-01-13", views: 890 },
      { id: "12", name: "Foldable Travel Bag", image: "https://picsum.photos/seed/bag/400/300", niche: "Fashion", priceRange: { min: 10, max: 28 }, competition: "low", trendScore: 88, supplierName: "FashionHub", status: "active", trendaryoUrl: "/products/foldable-travel-bag", price: 1299, currency: "INR", priceLastUpdated: "2026-05-18T04:00:00Z", importedAt: "2024-01-14", views: 1450 },
    ],
    suppliers: [
      { id: "1", name: "TechSupply Co", avatar: "https://i.pravatar.cc/80?u=techsupply", categories: ["Electronics", "Gadgets"], trustScore: 4.8, responseTime: "< 2 hrs", country: "China", totalProducts: 2400, verified: true, minOrder: 1 },
      { id: "2", name: "FashionHub", avatar: "https://i.pravatar.cc/80?u=fashionhub", categories: ["Fashion", "Accessories"], trustScore: 4.5, responseTime: "< 4 hrs", country: "Turkey", totalProducts: 1800, verified: true, minOrder: 5 },
      { id: "3", name: "HomeGoods Direct", avatar: "https://i.pravatar.cc/80?u=homegoods", categories: ["Home & Garden", "Kitchen"], trustScore: 4.7, responseTime: "< 6 hrs", country: "China", totalProducts: 3200, verified: true, minOrder: 1 },
      { id: "4", name: "BeautyPro", avatar: "https://i.pravatar.cc/80?u=beautypro", categories: ["Beauty", "Skincare"], trustScore: 4.6, responseTime: "< 3 hrs", country: "South Korea", totalProducts: 950, verified: true, minOrder: 3 },
      { id: "5", name: "FitGear Supply", avatar: "https://i.pravatar.cc/80?u=fitgear", categories: ["Sports", "Fitness"], trustScore: 4.4, responseTime: "< 8 hrs", country: "USA", totalProducts: 680, verified: false, minOrder: 1 },
      { id: "6", name: "EcoSupply", avatar: "https://i.pravatar.cc/80?u=ecosupply", categories: ["Home & Garden", "Sports", "Eco"], trustScore: 4.9, responseTime: "< 2 hrs", country: "Germany", totalProducts: 420, verified: true, minOrder: 2 },
      { id: "7", name: "GadgetWorld", avatar: "https://i.pravatar.cc/80?u=gadgetworld", categories: ["Electronics", "Toys"], trustScore: 4.2, responseTime: "< 12 hrs", country: "China", totalProducts: 5600, verified: false, minOrder: 1 },
      { id: "8", name: "PetLove Supplies", avatar: "https://i.pravatar.cc/80?u=petlove", categories: ["Pet Supplies"], trustScore: 4.7, responseTime: "< 5 hrs", country: "USA", totalProducts: 320, verified: true, minOrder: 2 },
    ],
    orders: [
      { id: "ORD-1042", productName: "Wireless Earbuds Pro", productImage: "https://picsum.photos/seed/earbuds/60/60", customer: "Sarah Mitchell", status: "pending", orderDate: "2024-01-15", estimatedDelivery: "2024-01-25", total: 38.99, quantity: 1 },
      { id: "ORD-1041", productName: "Foldable Travel Bag", productImage: "https://picsum.photos/seed/bag/60/60", customer: "James Cooper", status: "processing", orderDate: "2024-01-14", estimatedDelivery: "2024-01-24", trackingNumber: "CN123456789", total: 24.99, quantity: 2 },
      { id: "ORD-1040", productName: "Bamboo Cutting Board Set", productImage: "https://picsum.photos/seed/bamboo/60/60", customer: "Emily Chen", status: "shipped", orderDate: "2024-01-13", estimatedDelivery: "2024-01-22", trackingNumber: "YT987654321", total: 19.99, quantity: 1 },
      { id: "ORD-1039", productName: "Facial Roller Massager", productImage: "https://picsum.photos/seed/roller/60/60", customer: "Aisha Khan", status: "shipped", orderDate: "2024-01-12", estimatedDelivery: "2024-01-21", trackingNumber: "SF456789123", total: 16.99, quantity: 1 },
      { id: "ORD-1038", productName: "Resistance Band Set", productImage: "https://picsum.photos/seed/bands/60/60", customer: "Luca Romano", status: "delivered", orderDate: "2024-01-08", estimatedDelivery: "2024-01-18", trackingNumber: "DHL789123456", total: 27.99, quantity: 1 },
      { id: "ORD-1037", productName: "Essential Oil Diffuser", productImage: "https://picsum.photos/seed/diffuser/60/60", customer: "Priya Sharma", status: "delivered", orderDate: "2024-01-07", estimatedDelivery: "2024-01-17", trackingNumber: "UPS321654987", total: 31.99, quantity: 1 },
      { id: "ORD-1036", productName: "Candle Making Kit", productImage: "https://picsum.photos/seed/candle/60/60", customer: "Noah Williams", status: "cancelled", orderDate: "2024-01-06", estimatedDelivery: "2024-01-16", total: 35.99, quantity: 1 },
    ]
  }

  // ── Products ────────────────────────────────────────────────────────────────
  console.log("📦  Seeding products…")
  const pw = await batchCreate("dropease_products", md.products)
  console.log(`  ✅ dropease_products: ${pw}/${md.products.length} written`)

  // ── Suppliers ───────────────────────────────────────────────────────────────
  console.log("🏭  Seeding suppliers…")
  const sw = await batchCreate("dropease_suppliers", md.suppliers)
  console.log(`  ✅ dropease_suppliers: ${sw}/${md.suppliers.length} written`)

  // ── Orders ──────────────────────────────────────────────────────────────────
  console.log("🛒  Seeding orders…")
  const ow = await batchCreate("dropease_orders", md.orders)
  console.log(`  ✅ dropease_orders: ${ow}/${md.orders.length} written`)

  // ── Users ───────────────────────────────────────────────────────────────────
  console.log("👤  Seeding users…")
  try {
    await patchDoc("dropease_users", "demo-1", {
      id: "demo-1",
      name: "Drop Shipper",
      email: "beginner@dropease.com",
      plan: "free",
      createdAt: "2024-01-01",
      isOnboarded: true,
    })
    console.log("  ✅ dropease_users: 1 doc written")
  } catch (e) {
    console.error("  ⚠  dropease_users/demo-1:", e.message.slice(0, 120))
  }

  // ── Automation rules ────────────────────────────────────────────────────────
  console.log("⚙️   Seeding automation rules…")
  const rules = [
    { id: "AUTO-1", type: "fulfillment", name: "Auto-Fulfill Standard Orders", description: "Automatically process orders under $100 with tracking notification", status: "active", createdAt: "2024-01-15", enabled: true, conditions: { autoProcessOrders: true, autoGenerateTracking: true, notifyCustomer: true, notifySupplier: false, minOrderValue: 0, excludeWeekends: false }, stats: { ordersProcessed: 142, averageProcessingTime: "1.2h", successRate: 98.5 } },
    { id: "AUTO-2", type: "price_monitoring", name: "Watch Top 5 Products", description: "Alert when price drops more than 10% on best-sellers", status: "active", createdAt: "2024-01-10", enabled: true, conditions: { productIds: ["1","4","8","11","12"], checkInterval: 6, alertCondition: "percentage_change", thresholdValue: -10, competitorUrls: [] }, stats: { alertsTriggered: 7, priceChangesDetected: 12, lastCheck: "2024-01-18T04:00:00Z" } },
    { id: "AUTO-3", type: "email_marketing", name: "Order Confirmation Series", description: "Send confirmation → shipped → delivered follow-up emails", status: "active", createdAt: "2024-01-12", enabled: true, conditions: { triggers: ["new_order","order_shipped","order_delivered"], template: "default", sendDelay: 0, includeDiscount: false }, stats: { emailsSent: 310, openRate: 62.4, clickRate: 18.7, conversionRate: 9.1 } },
    { id: "AUTO-4", type: "inventory", name: "Low Stock Alerts", description: "Alert when any product drops below threshold", status: "active", createdAt: "2024-01-08", enabled: true, conditions: { productIds: [], lowStockThreshold: 10, criticalStockThreshold: 3, autoReorder: false, reorderQuantity: 50, alertLevel: "critical" }, stats: { alertsTriggered: 3, autoReordersPlaced: 0, stockoutsPrevented: 1 } },
    { id: "AUTO-5", type: "price_monitoring", name: "Competitor Price Watch", description: "Monitor competitor prices on high-margin products", status: "paused", createdAt: "2024-01-05", enabled: false, conditions: { productIds: ["1","2"], checkInterval: 24, alertCondition: "below", thresholdValue: 0, competitorUrls: [] }, stats: { alertsTriggered: 0, priceChangesDetected: 0, lastCheck: "2024-01-14T04:00:00Z" } },
  ]
  for (const r of rules) await patchDoc("dropease_automation_rules", r.id, r)
  console.log("  ✅ dropease_automation_rules: 5 docs written")

  // ── Notifications ───────────────────────────────────────────────────────────
  console.log("🔔  Seeding notifications…")
  const notifs = [
    { id: "NOTIF-1", type: "order", title: "New order received", message: "ORD-1042 from Sarah Mitchell — $38.99", read: false, createdAt: "2024-01-15T10:30:00Z" },
    { id: "NOTIF-2", type: "product", title: "Price alert triggered", message: "Wireless Earbuds Pro dropped 12% on supplier", read: false, createdAt: "2024-01-15T08:15:00Z" },
    { id: "NOTIF-3", type: "supplier", title: "Supplier rating update", message: "TechSupply Co received a new 5-star review", read: true, createdAt: "2024-01-14T16:00:00Z" },
    { id: "NOTIF-4", type: "system", title: "Weekly report ready", message: "Your weekly business summary is available to download.", read: true, createdAt: "2024-01-14T09:00:00Z" },
  ]
  for (const n of notifs) await patchDoc("dropease_notifications", n.id, n)
  console.log(`  ✅ dropease_notifications: ${notifs.length} docs written`)

  // ── Analytics ───────────────────────────────────────────────────────────────
  console.log("📊  Seeding analytics…")
  await patchDoc("dropease_analytics", "daily-summary", {
    id: "daily-summary",
    date: "2024-01-15",
    revenue: 142.96,
    orders: 3,
    topProduct: "Wireless Earbuds Pro",
    avgOrderValue: 47.65,
    visitors: 184,
    conversionRate: 1.63,
    updatedAt: new Date().toISOString(),
  })
  await patchDoc("dropease_analytics", "weekly-trend", {
    id: "weekly-trend",
    week: "2024-W03",
    revenue: 890.40,
    orders: 21,
    topNiches: ["Electronics", "Fashion", "Beauty"],
    avgOrderValue: 42.4,
    conversionRate: 1.5,
    updatedAt: new Date().toISOString(),
  })
  console.log("  ✅ dropease_analytics: 2 docs written")

  console.log("\n🎉  All collections seeded successfully.\n")
  console.log(`   🔑  Project: ${PROJECT_ID}`)
  console.log(`   🔗  Console: https://console.firebase.google.com/project/${PROJECT_ID}/firestore\n`)
}
