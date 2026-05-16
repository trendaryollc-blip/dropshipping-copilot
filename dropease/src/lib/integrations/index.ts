import createShopifyAdapter from '@/lib/integrations/shopify-adapter'
import createAmazonAdapter from '@/lib/integrations/amazon-adapter'
import createEbayAdapter from '@/lib/integrations/ebay-adapter'
import createTrustpilotAdapter from '@/lib/integrations/trustpilot-adapter'

export const integrationAdapters = {
  shopify: createShopifyAdapter(),
  amazon: createAmazonAdapter(),
  ebay: createEbayAdapter(),
  trustpilot: createTrustpilotAdapter(),
}

export type IntegrationProvider = keyof typeof integrationAdapters
