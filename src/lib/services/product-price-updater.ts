import { trendaryoScraper } from '../scrapers/trendaryo';
import { serverTimestamp } from 'firebase/firestore';
import { updateDocument, getCollection } from '../firestore-service';
import type { Product } from '@/types';

/**
 * Update product prices from Trendaryo
 * This function fetches live prices from Trendaryo and updates matching products in Firestore
 */
export async function updateProductPricesFromTrendaryo(): Promise<{
  success: boolean;
  updatedCount: number;
  failedCount: number;
  errors: Array<{ productId: string; error: string }>;
}> {
  try {
    // Get all active products that have a Trendaryo URL
    const products = await getCollection('copilot_products');
    const trendaryoProducts = products.filter(
      (p): p is (Product & { trendaryoUrl: string }) =>
        p.status === 'active' && typeof p.trendaryoUrl === 'string' && p.trendaryoUrl.length > 0
    );

    if (trendaryoProducts.length === 0) {
      return {
        success: true,
        updatedCount: 0,
        failedCount: 0,
        errors: []
      };
    }

    // Extract URLs for scraping
    const productUrls = trendaryoProducts.map(p => p.trendaryoUrl);
    
    // Scrape prices from Trendaryo
    const priceResults = await trendaryoScraper().scrapeMultiplePrices(productUrls);
    
    // Update products with new prices
    let updatedCount = 0;
    let failedCount = 0;
    const errors: Array<{ productId: string; error: string }> = [];

    for (let i = 0; i < trendaryoProducts.length; i++) {
      const product = trendaryoProducts[i];
      const priceResult = priceResults[i];
      
      if (priceResult.success && priceResult.price !== undefined) {
        try {
          await updateDocument(
            `copilot_products/${product.id}`,
            { 
              price: priceResult.price,
              currency: priceResult.currency || 'INR',
              priceLastUpdated: serverTimestamp()
            }
          );
          updatedCount++;
        } catch (error) {
          failedCount++;
          errors.push({
            productId: product.id,
            error: error instanceof Error ? error.message : String(error)
          });
        }
      } else {
        failedCount++;
        errors.push({
          productId: product.id,
          error: priceResult.error || 'Failed to scrape price'
        });
      }
    }

    return {
      success: failedCount === 0,
      updatedCount,
      failedCount,
      errors
    };
  } catch (error) {
    return {
      success: false,
      updatedCount: 0,
      failedCount: 0,
      errors: [{
        productId: 'unknown',
        error: error instanceof Error ? error.message : String(error)
      }]
    };
  }
}

/**
 * Update price for a single product from Trendaryo
 */
export async function updateSingleProductPriceFromTrendaryo(
  productId: string,
  trendaryoUrl: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const priceResult = await trendaryoScraper().scrapePrice(trendaryoUrl);
    
    if (priceResult.success && priceResult.price !== undefined) {
      await updateDocument(
        `copilot_products/${productId}`,
        { 
          price: priceResult.price,
          currency: priceResult.currency || 'INR',
          priceLastUpdated: serverTimestamp()
        }
      );
      
      return { success: true };
    } else {
      return { 
        success: false, 
        error: priceResult.error || 'Failed to scrape price' 
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}