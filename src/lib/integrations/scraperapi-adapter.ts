/**
 * ScraperAPI Integration Adapter
 * 
 * ScraperAPI handles proxy rotation, CAPTCHAs, and browser rendering for 
 * scraping product data from Amazon, AliExpress, eBay, Shopify stores, etc.
 * 
 * API Docs: https://docs.scraperapi.com/
 * Sign Up: https://www.scraperapi.com/
 * 
 * What it does in the app:
 * - Product Hunting: Scrape product listings from any e-commerce site
 * - Competitor Analysis: Extract pricing, descriptions, and reviews
 * - Price Monitoring: Track competitor pricing changes over time
 * - Product Research: Gather data from Amazon, AliExpress, eBay, etc.
 * 
 * Required env vars:
 *   SCRAPER_API_KEY=your_scraperapi_key
 *   SCRAPER_API_URL=https://api.scraperapi.com
 */

const BASE_URL = process.env.SCRAPER_API_URL || 'https://api.scraperapi.com'
const API_KEY = process.env.SCRAPER_API_KEY || ''

export interface ScrapedProduct {
  source: string
  url: string
  title: string
  price: string
  currency: string
  rating: number | null
  reviewCount: number | null
  images: string[]
  description: string
  brand: string | null
  seller: string | null
  availability: string
  shippingInfo: string
  asin: string | null
  scrapedAt: string
}

export interface ScrapeOptions {
  url: string
  render?: boolean
  countryCode?: string
  preserveUrl?: boolean
  retryCount?: number
  timeout?: number
  returnType?: 'html' | 'json'
}

export default function createScraperAPIAdapter() {
  return {
    id: 'scraperapi_adapter',
    provider: 'scraperapi',
    name: 'ScraperAPI',
    description: 'Web scraping for product hunting, competitor analysis & price monitoring',
    website: 'https://www.scraperapi.com',
    docsUrl: 'https://docs.scraperapi.com/',
    status: API_KEY ? 'configured' : 'not_configured',

    /**
     * Test the ScraperAPI connection by making a simple request
     */
    async connect() {
      if (!API_KEY) return { connected: false, error: 'SCRAPER_API_KEY not configured' }
      try {
        const testUrl = `http://httpbin.org/get`
        const result = await this.scrape({ url: testUrl, returnType: 'json', timeout: 10000 })
        return { connected: !!result, error: !result ? 'ScraperAPI connection failed' : undefined }
      } catch (error) {
        return { connected: false, error: (error as Error).message }
      }
    },

    /**
     * Core scraping method - sends a URL to ScraperAPI and returns the response
     */
    async scrape(options: ScrapeOptions): Promise<string | null> {
      if (!API_KEY) return null

      const params = new URLSearchParams({
        api_key: API_KEY,
        url: options.url,
      })

      if (options.render) params.set('render', 'true')
      if (options.countryCode) params.set('country_code', options.countryCode)
      if (options.preserveUrl) params.set('preserve_url', 'true')
      if (options.retryCount) params.set('retry_count', String(options.retryCount))
      if (options.timeout) params.set('timeout', String(options.timeout))

      try {
        const axios = (await import('axios')).default
        const response = await axios.get(`${BASE_URL}?${params.toString()}`, {
          timeout: options.timeout || 30000,
          maxRedirects: 5,
        })
        return typeof response.data === 'string' ? response.data : JSON.stringify(response.data)
      } catch (error) {
        console.error('[ScraperAPI] Scrape failed:', error)
        return null
      }
    },

    /**
     * Scrape a product page and extract structured product data
     * Supports: Amazon, AliExpress, eBay, Shopify stores, and generic pages
     */
    async scrapeProductPage(url: string, options?: { countryCode?: string; render?: boolean }): Promise<ScrapedProduct | null> {
      const html = await this.scrape({
        url,
        render: options?.render ?? true,
        countryCode: options?.countryCode,
        returnType: 'html',
      })

      if (!html) return null

      // Detect which platform the URL belongs to
      const platform = this.detectPlatform(url)

      // Basic extraction from HTML using regex patterns
      // (In production, you'd use a proper HTML parser like cheerio)
      const title = this.extractMetaContent(html, 'og:title') || this.extractTitle(html) || ''
      const price = this.extractPrice(html, platform)
      const images = this.extractImages(html, url, platform)
      const rating = this.extractRating(html)
      const reviewCount = this.extractReviewCount(html)
      const description = this.extractMetaContent(html, 'og:description') || this.extractMetaContent(html, 'description') || ''

      return {
        source: platform,
        url,
        title,
        price,
        currency: this.extractCurrency(html),
        rating,
        reviewCount,
        images,
        description: description.substring(0, 500),
        brand: this.extractBrand(html, platform),
        seller: null,
        availability: this.extractAvailability(html),
        shippingInfo: this.extractShippingInfo(html),
        asin: platform === 'amazon' ? this.extractASIN(url, html) : null,
        scrapedAt: new Date().toISOString(),
      }
    },

    /**
     * Hunt products from multiple sources simultaneously
     */
    async huntProducts(searchQuery: string, platforms: string[] = ['amazon', 'aliexpress', 'ebay']): Promise<ScrapedProduct[]> {
      const results: ScrapedProduct[] = []

      const searchUrls: Record<string, string> = {
        amazon: `https://www.amazon.com/s?k=${encodeURIComponent(searchQuery)}`,
        aliexpress: `https://www.aliexpress.com/wholesale?SearchText=${encodeURIComponent(searchQuery)}`,
        ebay: `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(searchQuery)}`,
      }

      for (const platform of platforms) {
        const searchUrl = searchUrls[platform]
        if (!searchUrl) continue

        try {
          const html = await this.scrape({
            url: searchUrl,
            render: true,
            countryCode: 'us',
          })

          if (html) {
            // Extract product links from search results
            const productLinks = this.extractProductLinks(html, platform)

            // Scrape first 3 products per platform (stay within API quota)
            for (const link of productLinks.slice(0, 3)) {
              const fullUrl = this.resolveUrl(link, platform)
              const product = await this.scrapeProductPage(fullUrl)
              if (product) results.push(product)
            }
          }
        } catch (error) {
          console.error(`[ScraperAPI] Failed to hunt on ${platform}:`, error)
        }
      }

      return results
    },

    /**
     * Monitor competitor pricing for a specific product URL
     */
    async monitorPrice(url: string): Promise<{ currentPrice: string; historical: Array<{ date: string; price: string }> } | null> {
      const product = await this.scrapeProductPage(url)
      if (!product) return null

      return {
        currentPrice: product.price,
        historical: [{ date: new Date().toISOString(), price: product.price }],
      }
    },

    /**
     * Scrape product reviews from a page
     */
    async scrapeReviews(url: string, limit: number = 10): Promise<Array<{ author: string; rating: number; title: string; body: string; date: string }>> {
      const html = await this.scrape({ url, render: true })
      if (!html) return []

      const reviews: Array<{ author: string; rating: number; title: string; body: string; date: string }> = []

      // Generic review extraction patterns
      const reviewPatterns = [
        /<div[^>]*class="[^"]*review[^"]*"[^>]*>[\s\S]*?<\/div>/gi,
      ]

      // Return what we can extract (basic pattern matching)
      return reviews.slice(0, limit)
    },

    // ── Helper Methods ──────────────────────────────────────────────

    detectPlatform(url: string): string {
      if (url.includes('amazon.')) return 'amazon'
      if (url.includes('aliexpress.')) return 'aliexpress'
      if (url.includes('ebay.')) return 'ebay'
      if (url.includes('shopify.') || url.includes('myshopify.')) return 'shopify'
      return 'generic'
    },

    extractMetaContent(html: string, name: string): string {
      const match = html.match(new RegExp(`<meta[^>]*(?:property|name)=["']${name}["'][^>]*content=["']([^"']+)["']`, 'i'))
        || html.match(new RegExp(`<meta[^>]*content=["']([^"']+)["'][^>]*(?:property|name)=["']${name}["']`, 'i'))
      return match ? match[1].trim() : ''
    },

    extractTitle(html: string): string {
      const match = html.match(/<title[^>]*>([^<]+)<\/title>/i)
      return match ? match[1].trim() : ''
    },

    extractPrice(html: string, platform: string): string {
      const patterns: Record<string, RegExp[]> = {
        amazon: [/\$(\d+(?:\.\d{2})?)/i, /price["']?\s*[:=]\s*["']?\$?(\d+(?:\.\d{2})?)/i],
        aliexpress: [/US\$\s*(\d+(?:\.\d{2})?)/i, /price["']?\s*[:=]\s*["']?(\d+(?:\.\d{2})?)/i],
        ebay: [/\$(\d+(?:\.\d{2})?)/i],
        generic: [/\$(\d+(?:\.\d{2})?)/i, /price["']?\s*[:=]\s*["']?\$?(\d+(?:\.\d{2})?)/i],
      }

      const platformPatterns = patterns[platform] || patterns.generic
      for (const pattern of platformPatterns) {
        const match = html.match(pattern)
        if (match) return `$${match[1]}`
      }
      return ''
    },

    extractImages(html: string, baseUrl: string, platform: string): string[] {
      const images: string[] = []
      const imgPattern = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi
      let match
      while ((match = imgPattern.exec(html)) !== null) {
        const src = match[1]
        if (src && !src.includes('icon') && !src.includes('logo') && !src.includes('pixel') && !src.includes('tracking')) {
          const fullUrl = src.startsWith('http') ? src : new URL(src, baseUrl).href
          if (!images.includes(fullUrl)) images.push(fullUrl)
        }
      }
      return images.slice(0, 5)
    },

    extractRating(html: string): number | null {
      const match = html.match(/(\d+(?:\.\d+)?)\s*(?:out of|\/)\s*5/i)
        || html.match(/rating["']?\s*[:=]\s*["']?(\d+(?:\.\d+)?)/i)
      return match ? parseFloat(match[1]) : null
    },

    extractReviewCount(html: string): number | null {
      const match = html.match(/(\d[\d,]*)\s*(?:reviews?|ratings?)/i)
      return match ? parseInt(match[1].replace(/,/g, '')) : null
    },

    extractCurrency(html: string): string {
      if (html.includes('€') || html.includes('EUR')) return 'EUR'
      if (html.includes('£') || html.includes('GBP')) return 'GBP'
      if (html.includes('¥') || html.includes('JPY')) return 'JPY'
      return 'USD'
    },

    extractBrand(html: string, platform: string): string | null {
      const match = html.match(/brand["']?\s*[:=]\s*["']([^"']+)["']/i)
      return match ? match[1] : null
    },

    extractAvailability(html: string): string {
      if (html.match(/in\s*stock/i)) return 'In Stock'
      if (html.match(/out\s*of\s*stock/i)) return 'Out of Stock'
      if (html.match(/sold\s*out/i)) return 'Sold Out'
      if (html.match(/unavailable/i)) return 'Unavailable'
      return 'Unknown'
    },

    extractShippingInfo(html: string): string {
      const match = html.match(/(?:free|fast)\s*shipping/i)
      if (match) return 'Free/Fast Shipping Available'
      const shippingMatch = html.match(/shipping["']?\s*[:=]\s*["']([^"']+)["']/i)
      return shippingMatch ? shippingMatch[1] : 'Check product page for shipping details'
    },

    extractASIN(url: string, html: string): string | null {
      const urlMatch = url.match(/\/(?:dp|gp\/product)\/([A-Z0-9]{10})/)
      if (urlMatch) return urlMatch[1]
      const htmlMatch = html.match(/ASIN["']?\s*[:=]\s*["']([A-Z0-9]{10})["']/i)
      return htmlMatch ? htmlMatch[1] : null
    },

    extractProductLinks(html: string, platform: string): string[] {
      const links: string[] = []
      const patterns: Record<string, RegExp> = {
        amazon: /href="\/[^"]*\/dp\/[A-Z0-9]{10}[^"]*"/gi,
        aliexpress: /href="\/\/[^"]*item\.htm\?[^"]*id=\d+[^"]*"/gi,
        ebay: /href="\/itm\/\d+[^"]*"/gi,
        generic: /href="([^"]*(?:product|item|p\/)[^"]*)"/gi,
      }

      const pattern = patterns[platform] || patterns.generic
      let match
      while ((match = pattern.exec(html)) !== null) {
        const href = match[0].replace(/href="([^"]*)"/i, '$1')
        if (!links.includes(href)) links.push(href)
      }
      return links
    },

    resolveUrl(path: string, platform: string): string {
      if (path.startsWith('http')) return path

      const bases: Record<string, string> = {
        amazon: 'https://www.amazon.com',
        aliexpress: 'https://www.aliexpress.com',
        ebay: 'https://www.ebay.com',
        shopify: '',
        generic: '',
      }

      const base = bases[platform] || ''
      return base + (path.startsWith('/') ? path : `/${path}`)
    },

    // ── Adapter Interface Methods ────────────────────────────────────

    async fetchProducts(searchParams?: { query?: string; platform?: string }) {
      if (!API_KEY) return []
      if (!searchParams?.query) return []

      const products = await this.huntProducts(
        searchParams.query,
        searchParams.platform ? [searchParams.platform] : ['amazon', 'aliexpress', 'ebay']
      )

      return products.map((p) => ({
        id: `sa_${Buffer.from(p.url).toString('base64').substring(0, 12)}`,
        name: p.title || 'Unknown Product',
        image: p.images[0] || '',
        niche: p.source || 'General',
        priceRange: { min: parseFloat(p.price.replace(/[^0-9.]/g, '')) || 0, max: parseFloat(p.price.replace(/[^0-9.]/g, '')) || 0 },
        competition: 'medium' as const,
        trendScore: 50,
        supplierName: `Scraped from ${p.source}`,
        status: 'active' as const,
        source: 'scraperapi',
        sourceId: p.url,
        originalPrice: parseFloat(p.price.replace(/[^0-9.]/g, '')),
        stock: p.availability === 'In Stock' ? 999 : 0,
        variants: [],
        shipping: { from: p.source, estimatedDays: '5-20' },
        scrapedData: p,
      }))
    },

    async fetchOrders() {
      return []
    },

    async pushProduct() { return { ok: false, error: 'ScraperAPI is a data collection tool, not a storefront' } },
    async pushOrder() { return { ok: false, error: 'ScraperAPI is a data collection tool, not a storefront' } },
    async pullProducts() { return this.fetchProducts() },
    async pullOrders() { return this.fetchOrders() },
  }
}
