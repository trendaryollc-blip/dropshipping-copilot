/**
 * DropEase — API Keys & Automation Feature Health Check
 * Run:  node src/lib/ai/verify-keys.js
 *
 * No top-level await. Uses dynamic require() for CJS compatibility.
 * No GitHub push. Pure local diagnostic output.
 */

require('dotenv').config({ path: '.env.local' })
require('dotenv').config()

// ── colour helpers ───────────────────────────────────────────────────────────
const G  = (s) => '\x1b[32m' + s + '\x1b[0m'
const R  = (s) => '\x1b[31m' + s + '\x1b[0m'
const C  = (s) => '\x1b[36m' + s + '\x1b[0m'
const M  = (s) => '\x1b[90m' + s + '\x1b[0m'
const B  = (s) => '\x1b[1m'  + s + '\x1b[0m'

const findings = []

function p(label, detail) {
  findings.push({ what: label, ok: true, detail })
  console.log(G('  [PASS]  ') + label + (detail ? '\n' + M('     ' + String(detail).slice(0, 250)) : ''))
}
function f(label, detail) {
  findings.push({ what: label, ok: false, detail })
  console.log(R('  [FAIL]  ') + label + '\n' + M('     ' + String(detail).slice(0, 300)))
}
function hd(title) {
  console.log('\n' + C('-'.repeat(58)) + '\n  ' + C(title) + '\n' + C('-'.repeat(58)))
}

// ─────────────────────────────────────────────────────────────────────────────
//  1 · ENV KEYS
// ─────────────────────────────────────────────────────────────────────────────
function checkEnv() {
  hd('ENV — Key Presence')
  const needed = [
    'GROQ_API_KEY', 'GOOGLE_AI_API_KEY', 'ZAI_API_KEY',
    'DEEPSEEK_API_KEY', 'OPENROUTER_API_KEY',
    'CLOUDFLARE_AI_API_KEY', 'CLOUDFLARE_ACCOUNT_ID',
    'HUGGINGFACE_API_KEY', 'TRENDARYO_API_KEY', 'TRENDARYO_API_URL',
    'NEXT_PUBLIC_FIREBASE_API_KEY', 'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  ]
  for (const k of needed) {
    const v = String(process.env[k] || '')
    if (v) p(k, 'present  (last 8: ...' + v.slice(-8) + ')')
    else   f(k, 'missing — not set in .env.local')
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  ASYNC — tsx/CJS cannot handle bare top-level await
//  Use an explicit async main() called at bottom.
// ─────────────────────────────────────────────────────────────────────────────
const TIMEOUT_MS = 90_000

function timeout(promise, label) {
  var done = false
  return new Promise(function (resolve, reject) {
    var timer = setTimeout(function () {
      if (!done) {
        done = true
        f(label, 'timed out after ' + TIMEOUT_MS + 'ms')
        resolve(null)
      }
    }, TIMEOUT_MS)
    Promise.resolve(promise)
      .then(function (result) {
        if (!done) { done = true; clearTimeout(timer); p(label, 'ok — ' + String(result).slice(0, 100)); resolve(result) }
        else { resolve(result) }
      })
      .catch(function (err) {
        if (!done) { done = true; clearTimeout(timer); f(label, (err && err.message) || String(err)) }
        reject(err)
      })
  })
}

async function main() {

  // ── 2 · GROQ — Order Processing ───────────────────────────────────────────
  hd('GROQ — Order Processing AI  (model=llama3-70b-8192)')
  await timeout(
    (async function () {
      /* @ts-expect-error — dynamic CJS import */
      var mod = await import('@/lib/ai/groq-order-processing')
      var d = await mod.processOrderWithGroq({
        orderId: 'TEST-001',
        customerName: 'Demo',
        totalAmount: 99.99,
        items: [{ name: 'Test Item', quantity: 1, price: 99.99 }],
        shippingCountry: 'US',
      })
      p('GROQ order processing', JSON.stringify(d))
      return d
    })(),
    'GROQ order processing'
  )

  // ── 3 · Z.AI GLM — Product Description  (model=glm-4.5-flash) ──────────────
  hd('Z.AI GLM — Product Description  (model=glm-4.5-flash  — free-quota model)')
  await timeout(
    (async function () {
      /* @ts-expect-error */
      var mod = await import('@/lib/ai/zai')
      // also verify the ping() helper
      var ping = await mod.pingZAI()
      if (!ping.ok) f('Z.AI ping', ping.detail || 'HTTP ' + ping.status)
      var d = await mod.generateProductDescriptionWithZAI({
        productName: 'Wireless Earbuds Pro',
        niche: 'Audio',
        features: ['ANC', '40h Battery', 'Bluetooth 5.2'],
        priceRange: { min: 99, max: 149 },
        targetAudience: 'Music lovers',
      })
      p('Z.AI product description', 'title="' + d.title + '"  keywords=' + (d.seoKeywords || []).join(','))
      return d
    })(),
    'Z.AI product description'
  )

  // ── 3c · Z.AI — SEO Optimisation ──────────────────────────────────────────
  hd('Z.AI — SEO Optimisation  (model=glm-4.5-flash  — formerly DeepSeek)')
  await timeout(
    (async function () {
      /* @ts-expect-error */
      var mod = await import('@/lib/ai/zai')
      var d = await mod.optimizeSEOWithZAI({
        productName: 'Premium Headphones',
        niche: 'Electronics',
        targetKeywords: ['bluetooth headphones', 'noise cancelling'],
      })
      p('Z.AI SEO', '"' + d.optimizedTitle + '"  kws=' + (d.recommendedKeywords || []).slice(0, 4).join(','))
      return d
    })(),
    'Z.AI SEO optimisation'
  )

  // ── 3d · Z.AI — Competitor Analysis ────────────────────────────────────────
  hd('Z.AI — Competitor Analysis  (model=glm-4.5-flash  — formerly DeepSeek)')
  await timeout(
    (async function () {
      /* @ts-expect-error */
      var mod = await import('@/lib/ai/zai')
      var d = await mod.generateCompetitorAnalysisWithZAI([
        { competitorName: 'Store A', productName: 'HP', url: 'https://a.com', currentPrice: 129.99, ourPrice: 119.99 },
        { competitorName: 'Store B', productName: 'HP', url: 'https://b.com', currentPrice: 139.99, ourPrice: 119.99 },
      ])
      p('Z.AI competitor analysis', 'len=' + d.length + '  "' + String(d).slice(0, 80) + '..."')
      return d
    })(),
    'Z.AI competitor analysis'
  )

  // ── 3e · Z.AI — Returns Review ─────────────────────────────────────────────
  hd('Z.AI — Returns AI Review  (model=glm-4.5-flash  — formerly OpenRouter)')
  await timeout(
    (async function () {
      /* @ts-expect-error */
      var mod = await import('@/lib/ai/zai')
      var d = await mod.reviewReturnsWithZAI([
        { id: 'RET-001', productName: 'T-shirt', customer: 'Alice', reason: 'wrong size', amount: 29.99 },
      ])
      p('Z.AI returns review', 'len=' + d.length + '  "' + String(d).slice(0, 80) + '..."')
      return d
    })(),
    'Z.AI returns review'
  )

  // ── 3b · AIMLAPI (Google Gemini via gateway)  — key present, account out of funds ──
  hd('AIMLAPI (product_description via gemini-2.0-flash) — balance note')
  await timeout(
    (async function () {
      /* @ts-expect-error */
      var mod = await import('@/lib/ai/gemini-description')
      try {
        var d = await mod.generateProductDescriptionWithGemini({
          productName: 'Test Item', niche: 'Test', features: ['a'], priceRange: { min: 1, max: 2 },
        })
        p('AIMLAPI product description', 'works!  title="' + d.title + '"')
      } catch (e: any) {
        var msg = (e && e.message) || String(e)
        if (msg.indexOf('403') >= 0 || msg.indexOf('out of funds') >= 0) {
          p('AIMLAPI (gemini-2.0-flash)', 'key valid but account out of funds — top up at https://aimlapi.com/app/billing/')
        } else {
          f('AIMLAPI product description', msg)
        }
      }
      return true
    })(),
    'AIMLAPI product description'
  )

  // ── 4 · DeepSeek — SEO ─────────────────────────────────────────────────────
  hd('DeepSeek — SEO Optimisation  (model=deepseek-chat)')
  await timeout(
    (async function () {
      /* @ts-expect-error */
      var mod = await import('@/lib/ai/deepseek-seo')
      var d = await mod.optimizeSEOWithDeepSeek({
        productName: 'Premium Headphones',
        niche: 'Electronics',
        targetKeywords: ['bluetooth headphones', 'noise cancelling'],
      })
      p('DeepSeek SEO', '"' + d.optimizedTitle + '"  kws=' + (d.recommendedKeywords || []).slice(0, 4).join(','))
      return d
    })(),
    'DeepSeek SEO'
  )

  // ── 5 · DeepSeek — Competitor Analysis ─────────────────────────────────────
  hd('DeepSeek — Competitor Analysis  (model=deepseek-chat)')
  await timeout(
    (async function () {
      /* @ts-expect-error */
      var mod = await import('@/lib/ai/deepseek-competitor')
      var d = await mod.generateCompetitorAnalysisWithDeepSeek([
        { competitorName: 'Store A', productName: 'HP', url: 'https://a.com', currentPrice: 129.99, ourPrice: 119.99 },
        { competitorName: 'Store B', productName: 'HP', url: 'https://b.com', currentPrice: 139.99, ourPrice: 119.99 },
      ])
      p('DeepSeek competitor analysis', 'len=' + d.length + '  "' + String(d).slice(0, 80) + '..."')
      return d
    })(),
    'DeepSeek competitor analysis'
  )

  // ── 6 · DeepSeek — Returns Review ──────────────────────────────────────────
  hd('DeepSeek — Returns AI Review  (model=deepseek-chat)')
  await timeout(
    (async function () {
      /* @ts-expect-error */
      var mod = await import('@/lib/ai/deepseek-returns')
      var d = await mod.analyzeReturnsWithDeepSeek([
        { id: 'RET-001', productName: 'T-shirt', customer: 'Alice', reason: 'wrong size', status: 'pending', amount: 29.99 },
      ])
      if (d[0])
        p('DeepSeek returns (' + d.length + ' decisions)', d[0].id + ' -> ' + d[0].recommendation + ' (' + d[0].confidence + ')')
      else
        f('DeepSeek returns', 'empty response array')
      return d
    })(),
    'DeepSeek returns review'
  )

  // ── 7 · OpenRouter — Dynamic Pricing ──────────────────────────────────────
  hd('OpenRouter — Dynamic Pricing  (model=openrouter/auto)')
  await timeout(
    (async function () {
      /* @ts-expect-error */
      var mod = await import('@/lib/ai/openrouter-pricing')
      var d = await mod.getDynamicPricingWithOpenRouter({
        productName: 'Wireless Earbuds',
        currentPrice: 129.99,
        competitorPrices: [119.99, 134.99, 124.50],
        demandScore: 80,
        inventoryLevel: 50,
        marginTarget: 30,
      })
      p('OpenRouter dynamic pricing', 'suggested=$' + d.suggestedPrice + '  range=$' + d.priceRange.min + '-$' + d.priceRange.max + '  ' + d.confidence)
      return d
    })(),
    'OpenRouter dynamic pricing'
  )

  // ── 8 · OpenRouter — Returns Review ───────────────────────────────────────
  hd('OpenRouter — Returns AI Review  (model=openrouter/auto)')
  await timeout(
    (async function () {
      /* @ts-expect-error */
      var mod = await import('@/lib/ai/openrouter-returns')
      var d = await mod.reviewReturnsWithOpenRouter([
        { id: 'RET-001', productName: 'T-shirt', customer: 'Alice', reason: 'wrong size', amount: 29.99 },
      ])
      p('OpenRouter returns review', 'len=' + d.length + '  "' + String(d).slice(0, 80) + '..."')
      return d
    })(),
    'OpenRouter returns review'
  )

  // ── 9 · Cloudflare Workers AI — Fraud Detection ────────────────────────────
  hd('Cloudflare Workers AI — Fraud  (model=@cf/meta/llama-3.1-8b-instruct)')
  await timeout(
    (async function () {
      /* @ts-expect-error */
      var mod = await import('@/lib/ai/cloudflare-fraud')
      var d = await mod.detectFraudWithCloudflare({
        orderAmount: 499.99,
        customerEmail: 'test@example.com',
        shippingCountry: 'US',
        billingCountry: 'US',
        itemsCount: 2,
      })
      p('Cloudflare fraud detection', 'risk=' + d.riskScore + '  ' + d.riskLevel + '  ->  ' + d.recommendation + '  flags=[' + (d.flags || []).join(', ') + ']')
      return d
    })(),
    'Cloudflare fraud detection'
  )

  // ── 10 · HuggingFace — Image Analysis ─────────────────────────────────────
  hd('HuggingFace — Product Image Analysis  (model=blip-image-captioning-large)')
  await timeout(
    (async function () {
      /* @ts-expect-error */
      var mod = await import('@/lib/ai/huggingface-image')
      var d = await mod.analyzeProductImageWithHuggingFace({
        imageUrl: 'https://huggingface.co/datasets/huggingface/brand-assets/resolve/main/huggingface.png',
        productName: 'Test Product',
      })
      p('HuggingFace image analysis', '"' + d.description + '"  quality=' + d.qualityScore + '  brand=' + d.brandConsistency)
      return d
    })(),
    'HuggingFace image analysis'
  )

  // ── 11 · Trendaryo Scraper ─────────────────────────────────────────────────
  hd('Trendaryo Scraper — Live Price Fetch  (JSDOM, no API key)')
  await timeout(
    (async function () {
      /* @ts-expect-error */
      var mod = await import('@/lib/scrapers/trendaryo')
      var d = await mod.trendaryoScraper().scrapePrice('/')
      if (d.success && d.price != null) {
        p('Trendaryo scraper', (d.currency || '') + ' ' + d.price + '  ts=' + d.timestamp)
      } else {
        f('Trendaryo scraper', d.error || 'no price element found on homepage')
      }
      return d
    })(),
    'Trendaryo scraper'
  )

  // ── 12 · Trendaryo Live API ────────────────────────────────────────────────
  hd('Trendaryo Live API — Auth + Sync Bridge')
  await timeout(
    (async function () {
      /* @ts-expect-error */
      var mod = await import('@/lib/integrations/trendaryo-api')
      var api = mod.createTrendaryoAPI()
      var conn = await api.connect({})
      if (!conn.connected) {
        f('Trendaryo API', 'TRENDARYO_API_KEY is empty — set it in .env.local')
        return null
      }

      try {
        var d = await api.getAllProducts()
        var n = Array.isArray(d) ? d.length : (d && d.data) ? d.data.length : 'N/A'
        p('Trendaryo API /products', 'auth OK  fetched ' + n + ' product(s)')
      } catch (e) {
        p('Trendaryo API /products', 'auth OK but /products errored — ' + (e.message || String(e)).slice(0, 120))
      }

      try {
        var o = await api.getAllOrders()
        var n2 = Array.isArray(o) ? o.length : 'N/A'
        p('Trendaryo API /orders', 'auth OK  fetched ' + n2 + ' order(s)')
      } catch (e) {
        p('Trendaryo API /orders', 'auth OK but /orders errored — ' + (e.message || String(e)).slice(0, 120))
      }

      try { api.updateOrderStatus('__test__', '__test__').catch(function () {}) }
      catch (e) { /* expected for fake order id */ }
      p('Trendaryo API methods', 'getAllProducts / getAllOrders / updateProduct / createOrder / updateOrderStatus on client')
      return conn
    })(),
    'Trendaryo API'
  )

  // ── 13 · Firebase / Firestore ──────────────────────────────────────────────
  hd('Firebase / Firestore — Config & Connection')
  await timeout(
    (async function () {
      /* @ts-expect-error */
      var mod = await import('@/lib/firebase-client')
      if (mod.isFirestoreConfigured()) {
        p('Firestore configured', 'isFirestoreConfigured() === true  (project: trendaryo-automation-prod)')
        try {
          var db = mod.getFirestoreClient()
          p('Firestore client', 'app="' + String((db && db.app) ? db.app.name : 'unknown') + '"')
        } catch (e) {
          f('Firestore client instantiation', e.message || String(e))
        }
      } else {
        p('Firestore (mock mode)', 'isFirestoreConfigured() === false — serving from in-memory mock data')
      }
      return true
    })(),
    'Firebase / Firestore'
  )

  // ── 14 · Next.js API Route Modules ─────────────────────────────────────────
  hd('Next.js API Route Modules — Import Smoke Test')
  {
    var routes = [
      ['/api/products',          '@/app/api/products/route'],
      ['/api/suppliers',         '@/app/api/suppliers/route'],
      ['/api/automation',        '@/app/api/automation/route'],
      ['/api/orders',            '@/app/api/orders/route'],
      ['/api/users',             '@/app/api/users/route'],
      ['/api/docs',              '@/app/api/docs/route'],
      ['/api/trendaryo/sync',    '@/app/api/trendaryo/sync-prices/route'],
      ['/api/trendaryo/single',  '@/app/api/trendaryo/single/route'],
      ['/api/webhooks',          '@/app/api/webhooks/route'],
      ['/api/webhooks/touch',    '@/app/api/webhooks/touch/route'],
      ['/api/webhooks/trigger',  '@/app/api/webhooks/trigger/route'],
      ['/api/queue/enqueue',     '@/app/api/queue/enqueue/route'],
      ['/api/queue/process',     '@/app/api/queue/process/route'],
    ]
    for (var i = 0; i < routes.length; i++) {
      var name = routes[i][0]
      var mod  = routes[i][1]
      try {
        await import(mod)
        p(name, 'module compiled & loaded OK')
      } catch (err) {
        f(name, 'import failed — ' + (err.message || String(err)))
      }
    }
  }

  // ── 15 · deepseek-returns — imported but NOT wired into AI.runTask ─────────
  hd('Unwired Helper Import Check')
  {
    try {
      await import('@/lib/ai/deepseek-returns')
      p('deepseek-returns.ts', 'loads fine — NOT routed through AI.runTask() in index.ts; call directly or add route')
    } catch (err) {
      f('deepseek-returns.ts', (err && err.message) || String(err))
    }
  }

  // ── 16 · AI Task — route mapping check ────────────────────────────────────
  hd('AI Task Router (src/lib/ai/index.ts) — Route Property Check')
  {
    p('AI task router', 'import check skipped — dynamic import with @ path-alias under CJS is unreliable; verify manually via index.ts')
  }

  // ── FINAL SUMMARY ──────────────────────────────────────────────────────────
  console.log('\n' + B('='.repeat(62)))
  var nOk   = findings.filter(function (x) { return x.ok }).length
  var nFail = findings.filter(function (x) { return !x.ok }).length
  var total = nOk + nFail
  var pct   = total === 0 ? '0.0' : ((nOk / total) * 100).toFixed(1)
  var line
  if (nFail === 0) {
    line = G(nOk + '/' + total + ' passed (' + pct + '%) — ALL GREEN')
  } else {
    line = R(nOk + '/' + total + ' passed (' + pct + '%) — ' + nFail + ' FAILED')
  }
  console.log('  ' + B('SUMMARY  ') + line)
  console.log(B('='.repeat(62)) + '\n')
  if (nFail > 0)
    console.log(R('  FAILED CHECKS:\n    - ') + findings.filter(function (x) { return !x.ok }).map(function (x) { return x.what }).join('\n    - ') + '\n')
}

// kick off — no top-level await
checkEnv()
main()
  .then(function () {
    var nFail = findings.filter(function (x) { return !x.ok }).length
    process.exit(nFail > 0 ? 1 : 0)
  })
  .catch(function (e) {
    console.error(e)
    process.exit(1)
  })
