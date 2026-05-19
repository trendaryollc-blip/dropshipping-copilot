// Example usage of the Trendaryo price scraper
import { trendaryoScraper, PriceScraperResult } from './trendaryo';

/**
 * Example function demonstrating how to use the Trendaryo scraper
 */
async function exampleUsage() {
  console.log('=== Trendaryo Price Scraper Example ===\n');
  
  // Example 1: Scrape a single product price (using relative path)
  console.log('1. Scraping single product price:');
  const singleResult = await trendaryoScraper.scrapePrice('/products/example-product');
  console.log('Result:', JSON.stringify(singleResult, null, 2));
  
  // Example 2: Scrape multiple product prices
  console.log('\n2. Scraping multiple product prices:');
  const productUrls = [
    '/products/product-1',
    '/products/product-2', 
    '/products/product-3'
  ];
  
  const multipleResults = await trendaryoScraper.scrapeMultiplePrices(productUrls);
  console.log('Results:');
  multipleResults.forEach((result, index) => {
    console.log(`  Product ${index + 1}:`, JSON.stringify(result, null, 4));
  });
  
  // Example 3: Using with full URL
  console.log('\n3. Scraping with full URL:');
  const fullUrlResult = await trendaryoScraper.scrapePrice('https://trendaryo.com/products/another-product');
  console.log('Result:', JSON.stringify(fullUrlResult, null, 2));
}

// Run the example if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  exampleUsage().catch(console.error);
}

export { exampleUsage };