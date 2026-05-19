import { JSDOM } from 'jsdom';

export interface PriceScraperResult {
  success: boolean;
  price?: number;
  currency?: string;
  error?: string;
  timestamp: string;
}

export class TrendaryoScraper {
  private baseUrl = 'https://trendaryo.com';

  /**
   * Scrape product price from Trendaryo
   * @param productUrl - Full URL or path to product page
   * @returns Price scraping result
   */
    async scrapePrice(productUrl: string): Promise<PriceScraperResult> {
    try {
      // Construct full URL if needed
      const url = productUrl.startsWith('http') 
        ? productUrl 
        : `${this.baseUrl}${productUrl.startsWith('/') ? '' : '/'}${productUrl}`;

      // Fetch the page with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const html = await response.text();
      
      // Parse with JSDOM
      const dom = new JSDOM(html);
      const document = dom.window.document;

      // Try multiple selectors for price elements
      const priceSelectors = [
        '[data-testid="price"]',
        '.price',
        '.product-price',
        '[class*="price"]',
        'meta[property="product:price:amount"]',
        '[itemprop="price"]'
      ];

      let priceElement = null;
      let priceText = '';

       for (const selector of priceSelectors) {
         priceElement = document.querySelector(selector);
         if (priceElement) {
           // Try to get price from different attributes
           priceText = 
             priceElement.getAttribute('content') || 
             priceElement.textContent ||
             '';
           if (priceText.trim()) break;
         }
       }

      if (!priceElement || !priceText) {
        // Fallback: look for common price patterns in text
        const bodyText = document.body.textContent || '';
        const priceMatch = bodyText.match(/(?:₹|Rs\.?|INR)?\s*(\d+(?:,\d+)*(?:\.\d{2})?)/i);
        if (priceMatch) {
          priceText = priceMatch[1];
        } else {
          throw new Error('Price element not found on page');
        }
      }

      // Extract numeric price
      const priceMatch = priceText.replace(/[^\d.-]/g, '').match(/(\d+(?:\.\d+)?)/);
      if (!priceMatch) {
        throw new Error('Could not parse price from text');
      }

      const price = parseFloat(priceMatch[1]);
      if (isNaN(price)) {
        throw new Error('Invalid price format');
      }

      // Try to extract currency
      const currencyMatch = priceText.match(/([A-Z]{3}|₹|Rs\.?|INR)/i);
      const currency = currencyMatch ? currencyMatch[1] : 'INR';

      return {
        success: true,
        price,
        currency,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Scrape multiple product prices
   * @param productUrls - Array of product URLs or paths
   * @returns Array of price scraping results
   */
  async scrapeMultiplePrices(productUrls: string[]): Promise<PriceScraperResult[]> {
    const results = await Promise.all(
      productUrls.map(url => this.scrapePrice(url))
    );
    return results;
  }
}

// Export a singleton instance for convenience
export const trendaryoScraper = new TrendaryoScraper();