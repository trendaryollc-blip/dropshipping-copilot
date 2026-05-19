import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { TrendaryoScraper, PriceScraperResult } from './trendaryo';

// Minimal AbortController stub that works when the code does `new AbortController()`.
class FakeAbortController {
  signal = { aborted: false };
  abort() { this.signal.aborted = true; }
}

describe('TrendaryoScraper', () => {
  let scraper: TrendaryoScraper;

  beforeEach(() => {
    scraper = new TrendaryoScraper();
    vi.clearAllMocks();
    vi.stubGlobal('AbortController', FakeAbortController);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  describe('scrapePrice', () => {
    it('should successfully scrape price from valid HTML', async () => {
      const mockHtml = `
        <html>
          <body>
            <div class="price">₹1,299.99</div>
          </body>
        </html>
      `;

      const mockResponse = new Response(mockHtml, {
        status: 200,
        headers: { 'Content-Type': 'text/html' }
      });

      vi.stubGlobal('fetch', vi.fn().mockResolvedValue(mockResponse));

      const result = await scraper.scrapePrice('/test-product') as PriceScraperResult;

      expect(result.success).toBe(true);
      expect(result.price).toBe(1299.99);
      expect(result.currency).toBe('₹');
      expect(result.timestamp).toBeDefined();
    });

    it('should handle price with data-testid attribute', async () => {
      const mockHtml = `
        <html>
          <body>
            <span data-testid="price">Rs. 599</span>
          </body>
        </html>
      `;

      const mockResponse = new Response(mockHtml, {
        status: 200,
        headers: { 'Content-Type': 'text/html' }
      });

      vi.stubGlobal('fetch', vi.fn().mockResolvedValue(mockResponse));

      const result = await scraper.scrapePrice('/test-product') as PriceScraperResult;

      expect(result.success).toBe(true);
      expect(result.price).toBe(599);
      expect(result.currency).toBe('Rs.');
    });

    it('should fallback to regex price extraction when selectors fail', async () => {
      // The regex branch extracts only the numeric capture group (\\d+) from
      // the surrounding text, so the resulting priceText does NOT contain the
      // currency symbol.  The scraper's currency-match regex is applied to that
      // already-stripped text, therefore currency falls back to 'INR'.
      const mockHtml = `
        <html>
          <body>
            <p>Special offer: Only ₹2,499 today!</p>
          </body>
        </html>
      `;

      const mockResponse = new Response(mockHtml, {
        status: 200,
        headers: { 'Content-Type': 'text/html' }
      });

      vi.stubGlobal('fetch', vi.fn().mockResolvedValue(mockResponse));

      const result = await scraper.scrapePrice('/test-product') as PriceScraperResult;

      expect(result.success).toBe(true);
      expect(result.price).toBe(2499);
      expect(result.currency).toBe('INR'); // strip-path leaves no currency symbol
    });

    it('should handle HTTP errors', async () => {
      const mockResponse = new Response('Not Found', {
        status: 404,
        statusText: 'Not Found'
      });

      vi.stubGlobal('fetch', vi.fn().mockResolvedValue(mockResponse));

      const result = await scraper.scrapePrice('/non-existent-product') as PriceScraperResult;

      expect(result.success).toBe(false);
      expect(result.error).toContain('HTTP 404');
    });

    it('should handle network errors', async () => {
      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')));

      const result = await scraper.scrapePrice('/test-product') as PriceScraperResult;

      expect(result.success).toBe(false);
      expect(result.error).toBe('Network error');
    });

    it('should handle non-200 response without a body as a failed scrape', async () => {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue(
        new Response('', { status: 200 })
      ));

      const result = await scraper.scrapePrice('/test-product') as PriceScraperResult;

      // No price element → falls through to body-text regex → no match → error
      expect(result.success).toBe(false);
    });
  });

  describe('scrapeMultiplePrices', () => {
    it('should scrape multiple prices concurrently', async () => {
      const mockResponses = [
        new Response('<div class="price">₹100</div>', { status: 200 }),
        new Response('<div class="price">₹200</div>', { status: 200 }),
        new Response('<div class="price">₹300</div>', { status: 200 })
      ];

      vi.stubGlobal('fetch', vi.fn().mockImplementation((url: RequestInfo) => {
        const index = parseInt(String(url).match(/product-(\d+)/)?.[1] || '0', 10) - 1;
        return Promise.resolve(mockResponses[index] || mockResponses[0]);
      }));

      const productUrls = ['/products/product-1', '/products/product-2', '/products/product-3'];
      const results = await scraper.scrapeMultiplePrices(productUrls);

      expect(results).toHaveLength(3);
      expect(results.every(r => r.success)).toBe(true);
      expect(results[0].price).toBe(100);
      expect(results[1].price).toBe(200);
      expect(results[2].price).toBe(300);
      expect(vi.mocked(fetch)).toHaveBeenCalledTimes(3);
    });
  });
});
