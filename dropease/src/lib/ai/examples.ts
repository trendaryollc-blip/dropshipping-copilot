/**
 * Example Usage of the Multi-AI Automation System
 * 
 * This file shows how to use different AIs for different tasks.
 */

import { AI } from '@/lib/ai';

// Example 1: Order Processing (uses Groq)
async function exampleOrderProcessing() {
  const result = await AI.runTask('order_processing', {
    orderId: 'ORD-12345',
    customerName: 'John Doe',
    totalAmount: 249.99,
    items: [
      { name: 'Wireless Earbuds', quantity: 1, price: 129.99 },
      { name: 'Phone Case', quantity: 2, price: 59.99 },
    ],
    shippingCountry: 'US',
  });

  console.log('Order Decision:', result);
}

// Example 2: Product Description (uses Google Gemini)
async function exampleDescriptionGeneration() {
  const result = await AI.runTask('product_description', {
    productName: 'Premium Wireless Noise Cancelling Headphones',
    niche: 'Audio Equipment',
    features: ['Active Noise Cancellation', '40-hour battery', 'Bluetooth 5.2'],
    priceRange: { min: 199, max: 249 },
    targetAudience: 'Music lovers and professionals',
  });

  console.log('Generated Description:', result);
}

// Example 3: Dynamic Pricing (uses OpenRouter)
async function exampleDynamicPricing() {
  const result = await AI.runTask('dynamic_pricing', {
    productName: 'Wireless Earbuds Pro',
    currentPrice: 129.99,
    competitorPrices: [119.99, 134.99, 124.5],
    demandScore: 85,
    inventoryLevel: 34,
    marginTarget: 35,
  });

  console.log('Pricing Recommendation:', result);
}

// Run examples
// exampleOrderProcessing();
// exampleDescriptionGeneration();
// exampleDynamicPricing();
