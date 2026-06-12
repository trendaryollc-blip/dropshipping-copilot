import createShopifyAdapter from '@/lib/integrations/shopify-adapter'
import createAmazonAdapter from '@/lib/integrations/amazon-adapter'
import createEbayAdapter from '@/lib/integrations/ebay-adapter'
import createTrustpilotAdapter from '@/lib/integrations/trustpilot-adapter'
import { createTrendaryoAPI } from '@/lib/integrations/trendaryo-api'

export const integrationAdapters = {
  shopify: createShopifyAdapter(),
  amazon: createAmazonAdapter(),
  ebay: createEbayAdapter(),
  trustpilot: createTrustpilotAdapter(),
  trendaryo: createTrendaryoAPI(),
}

export type IntegrationProvider = keyof typeof integrationAdapters

export { createTrendaryoAPI }
