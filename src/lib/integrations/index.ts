import createShopifyAdapter from '@/lib/integrations/shopify-adapter'
import createAmazonAdapter from '@/lib/integrations/amazon-adapter'
import createEbayAdapter from '@/lib/integrations/ebay-adapter'
import createTrustpilotAdapter from '@/lib/integrations/trustpilot-adapter'
import { createTrendaryoAPI } from '@/lib/integrations/trendaryo-api'
import createZendropAdapter from '@/lib/integrations/zendrop-adapter'
import createSpocketAdapter from '@/lib/integrations/spocket-adapter'
import createModalystAdapter from '@/lib/integrations/modalyst-adapter'
import createPrintfulAdapter from '@/lib/integrations/printful-adapter'
import createScraperAPIAdapter from '@/lib/integrations/scraperapi-adapter'

/**
 * All available integration adapters.
 * Each adapter provides: connect, fetchProducts, fetchOrders, pushProduct, pushOrder, pullProducts, pullOrders
 * 
 * Supported platforms:
 * - Trendaryo: Your primary dropshipping store integration
 * - CJ Dropshipping: Product sourcing & fulfillment (via API key only, no adapter)
 * - AliExpress: Product research & pricing (via API key only, no adapter)
 * - Zendrop: US-based dropshipping with fast shipping
 * - Spocket: US/EU suppliers with branded invoicing
 * - Modalyst: Large marketplace with independent brands
 * - Printful: Print-on-demand & custom branded products
 * - Shopify: E-commerce platform integration
 * - Amazon: Amazon product research
 * - eBay: eBay marketplace integration
 */
export const integrationAdapters = {
  trendaryo: createTrendaryoAPI(),
  zendrop: createZendropAdapter(),
  spocket: createSpocketAdapter(),
  modalyst: createModalystAdapter(),
  printful: createPrintfulAdapter(),
  scraperapi: createScraperAPIAdapter(),
  shopify: createShopifyAdapter(),
  amazon: createAmazonAdapter(),
  ebay: createEbayAdapter(),
  trustpilot: createTrustpilotAdapter(),
}

/**
 * List of all sourcing/supplier providers (what the user cares about most)
 */
export const sourcingProviders = [
  'trendaryo',
  'zendrop',
  'spocket',
  'modalyst',
  'printful',
  'shopify',
] as const

export type IntegrationProvider = keyof typeof integrationAdapters

export { createTrendaryoAPI }
