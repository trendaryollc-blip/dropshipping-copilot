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
const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "trendaryo-automation-staging"
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

  const md = require("./mock-data.ts")

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
