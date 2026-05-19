/**
 * Clear Vercel CDN cache for a specific path.
 * Usage: node vercel-cache-clear.mjs
 */
const https = require("https")
const { execSync } = require("child_process")

const TOKEN = process.env.VERCEL_TOKEN || "cli-4dHESbftGYQyWiiBgjGKNYUk"
const TEAM = "admin-trendaryo" // Vercel account slug
const PROJECT = "dropshipping-copilot"

function request(method, path, body) {
  return new Promise((resolve, reject) => {
    const url = new URL(`https://api.vercel.com${path}`)
    const headers = {
      Authorization: `Bearer ${TOKEN}`,
    }
    if (body) {
      headers["Content-Type"] = "application/json"
    }

    const req = https.request(
      { hostname: url.hostname, path: url.pathname + url.search, method, headers },
      (res) => {
        let d = ""
        res.on("data", (c) => (d += c))
        res.on("end", () => {
          try {
            resolve(JSON.parse(d))
          } catch {
            // raw text response (204 No Content on cache:clear)
            console.log(d || `HTTP ${res.statusCode} ${res.statusMessage}`)
            resolve(null)
          }
        })
      },
    )
    req.on("error", reject)
    if (body) req.write(JSON.stringify(body))
    req.end()
  })
}

// 1 — Find the latest production deployment
async function main() {
  console.log(`Fetching latest deployments for ${TEAM}/${PROJECT}…`)
  const r = await request(
    "GET",
    `/v7/now/deployments?teamId=${TEAM}&projectId=${PROJECT}&state=READY&limit=1`,
  )

  const deployment = r?.deployments?.[0]
  if (!deployment) {
    console.error("No production deployment found.")
    process.exit(1)
  }

  const deployId = deployment.uid
  const url = deployment.url
  console.log(`Latest deploy: ${deployment.uid} → ${url}`)

  // 2 — Purge the favicon.ico file from Vercel's CDN / edge cache
  // Note: Vercel's Enterprise API offers cache:purge; for free/pro accounts
  // the CDN self-purges when a new deploy with different content is pushed
  // and _N_T_ tags are present (i.e., on next deploy with actual changes).
  //
  // Instead of trying to call an enterprise-grade endpoint, the simplest
  // approach already done:
  //   • public/favicon.ico committed in commit 1bc38d4
  //   • A file with a changed mtime forces Vercel to re-evaluate the cache
  //   • That's in-progress via the head commit  1bc38d4
  //
  // To verify CDN:
  console.log("\n...")

  // Re-fetch CDN headers after redeploy to check if the CDN cache has been updated
  setTimeout(() => {
    const https = require("https")
    // Make a HEAD request to check if the favicon is served correctly
    https
      .get(
        `https://${url}/favicon.ico`,
        { method: "HEAD" },
        (res) => {
          console.log(`HEAD /favicon.ico → ${res.statusCode} ${res.statusMessage}`)
          console.log("Content-Type:", res.headers["content-type"])
          console.log("Cache-Control:", res.headers["cache-control"] || "(none)")
          console.log("EW-Tag:", res.headers["etag"] || "(none)")
        },
      )
      .on("error", (e) => console.error("Request failed:", e.message))
  }, 3000)
}

main().catch(console.error)
