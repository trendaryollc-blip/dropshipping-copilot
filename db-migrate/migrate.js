const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// 1. INITIALIZE ADMIN SDK
const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS ||
      path.resolve(__dirname, '../secrets/trendaryo-automation-prod-key.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccountPath)
});

const db = admin.firestore();
const rulesPath = path.resolve(__dirname, '../firebase.rules.prod.json');

// 2. SEED DATA
async function seedData() {
  console.log('🚀 Starting seed...');
  
  // Create user
  const uid = 'admin_user_001';
  const userDoc = {
    uid,
    email: 'admin@example.com',
    name: 'Admin Owner',
    plan: 'pro',
    role: 'owner',
    isOnboarded: true,
    notificationPreferences: {
      lowStockAlert: true,
      newOrderSMS: false,
      returnsAlert: true,
      weeklyReport: true,
    },
    createdAt: admin.firestore.Timestamp.fromDate(new Date()),
    updatedAt: admin.firestore.Timestamp.fromDate(new Date()),
  };
  await db.collection('dropease_users').doc(uid).set(userDoc);
  console.log('✅ Created user document');

  // Create store
  const storeDoc = {
    storeId: 'demo_shopify_01',
    name: 'Demo Store',
    platform: 'shopify',
    domain: 'https://demo-shop.myshopify.com',
    status: 'connected',
    credentials: {
      storeUrl: 'demo-shop.myshopify.com',
      accessToken: 'dummy_access_token',
      apiVersion: '2024-01',
    },
    webhookUrl: 'https://demo.myshopify.com/api/webhooks',
    stats: { productsSynced: 0, ordersProcessed: 0, inventoryUpdated: 0 },
    createdAt: admin.firestore.Timestamp.fromDate(new Date()),
    updatedAt: admin.firestore.Timestamp.fromDate(new Date()),
  };
  await db.collection('dropease_users').doc(uid).collection('stores').doc(storeDoc.storeId).set(storeDoc);
  console.log('✅ Created store document');

  // Create products
  const productDocs = [
    {
      productId: 'PRD-FTB-001',
      name: 'Foldable Travel Bag',
      slug: 'foldable-travel-bag',
      description: 'Waterproof foldable duffel bag…',
      images: ['https://picsum.photos/seed/bag/400/400'],
      niche: 'Fashion',
      tags: ['travel', 'bags', 'foldable'],
      priceRange: { min: 10, max: 28 },
      competition: 'low',
      trendScore: 88,
      supplierName: 'FashionHub',
      status: 'active',
      trendaryoUrl: '/products/foldable-travel-bag',
      price: 1299,
      currency: 'INR',
      priceLastUpdated: admin.firestore.Timestamp.fromDate(new Date()),
      importedAt: admin.firestore.Timestamp.fromDate(new Date()),
      competitionLevel: 'low',
      views: 1450,
    },
  ];

  for (const p of productDocs) {
    await db.collection('dropease_products').doc(p.productId).set(p);
  }
  console.log('✅ Seeded product documents');

  // Create supplier
  const supplierDoc = {
    supplierId: 'SUP-FASH-001',
    name: 'FashionHub',
    country: 'Turkey',
    website: 'https://fashionhub.example.com',
    apiStatus: 'connected',
    trustScore: 4.5,
    responseTimeHours: 2,
    verified: true,
    minOrderQuantity: 5,
    categories: ['Fashion', 'Accessories'],
    totalProducts: 800,
    policies: { shipping: 'Free shipping above ₹2,000', returns: '30‑day no‑questions', payment: 'Visa/MasterCard' },
    stats: { productsCount: 120, totalOrdersPlaced: 45 },
    createdAt: admin.firestore.Timestamp.fromDate(new Date()),
    updatedAt: admin.firestore.Timestamp.fromDate(new Date()),
  };
  await db.collection('dropease_suppliers').doc(supplierDoc.supplierId).set(supplierDoc);
  console.log('✅ Seeded supplier document');

  // Create order
  const orderDoc = {
    orderId: 'ORD-10042',
    uid: uid,
    storeId: 'demo_shopify_01',
    customerId: 'CUS-5003',
    supplierId: 'SUP-FASH-001',
    status: 'processing',
    fulfilmentStatus: 'awaiting_supplier',
    paymentStatus: 'paid',
    paymentMethod: 'card',
    paymentGateway: 'stripe',
    itemsTotal: 2598,
    shippingCost: 0,
    tax: 0,
    discountApplied: 0,
    grandTotal: 2598,
    currency: 'INR',
    source: 'shopify',
    externalId: 'gid://shopify/Order/10042',
    shippingAddress: { fullName: 'Sarah Mitchell', line1: '123 Main St', line2: '', city: 'London', pinCode: 'SW1A 1AA', country: 'GB' },
    billingAddress: { fullName: 'Sarah Mitchell', line1: '123 Main St', line2: '', city: 'London', pinCode: 'SW1A 1AA', country: 'GB' },
    tracking: { provider: 'delhivery', trackingNumber: 'DL1234567890', statusUrl: 'https://delhivery.com/track/…', events: [{ at: admin.firestore.Timestamp.fromDate(new Date('2026-05-16T09:00:00Z')), status: 'picked_up', location: 'Mumbai' }] },
    notes: 'Gift wrap requested',
    updatedAt: admin.firestore.Timestamp.fromDate(new Date()),
  };
  await db.collection('dropease_orders').doc(orderDoc.orderId).set(orderDoc);
  console.log('✅ Seeded order document');

  // Create customer
  const customerDoc = {
    customerId: 'CUS-5003',
    uid: uid,
    storeId: 'demo_shopify_01',
    externalCustomerId: 'gid://shopify/Customer/5003',
    name: 'Sarah Mitchell',
    email: 'sarah@example.com',
    phone: '+91-9876543210',
    segment: 'loyal',
    lifetimeValue: 18900,
    totalOrders: 14,
    averageOrderValue: 1350,
    lastOrderAt: admin.firestore.Timestamp.fromDate(new Date('2026-05-15T14:30:00Z')),
    firstOrderAt: admin.firestore.Timestamp.fromDate(new Date('2025-08-10T09:00:00Z')),
    createdAt: admin.firestore.Timestamp.fromDate(new Date('2025-08-10T09:00:00Z')),
    updatedAt: admin.firestore.Timestamp.fromDate(new Date()),
  };
  await db.collection('dropease_customers').doc(customerDoc.customerId).set(customerDoc);
  console.log('✅ Seeded customer document');

  // Create automation rule
  const ruleDoc = {
    ruleId: 'AUTO-001',
    userId: uid,
    type: 'price_monitoring',
    name: 'Track Foldable Bag Competitor',
    description: 'Alert me when competitors drop below ₹1,100',
    status: 'active',
    enabled: true,
    createdAt: admin.firestore.Timestamp.fromDate(new Date()),
    updatedAt: admin.firestore.Timestamp.fromDate(new Date()),
    trigger: 'price_drop',
    threshold: { amount: 1100, currency: 'INR' },
    productIds: ['PRD-FTB-001'],
    competitorUrls: ['https://comp.example.com/products/foldable-travel-bag'],
    actions: [
      { type: 'send_email', params: { to: 'admin@example.com', subject: 'Price alert!' } },
      { type: 'update_price', params: { newPrice: 1199 } },
    ],
    stats: { timesTriggered: 0, successCount: 0, lastRunAt: null },
    lastRunAt: admin.firestore.Timestamp.fromDate(new Date()),
    nextRunAt: admin.firestore.Timestamp.fromDate(new Date('2026-05-19T06:00:00Z')),
    enabled: true,
  };
  await db.collection('dropease_automation_rules').doc(ruleDoc.ruleId).set(ruleDoc);
  console.log('✅ Seeded automation rule');

  // Create competitor
  const competitorDoc = {
    competitorId: 'COMP-001',
    userId: uid,
    competitorName: 'CompStore XYZ',
    url: 'https://compstore.xyz/products/foldable-travel-bag',
    productName: 'Foldable Travel Bag',
    productImage: 'https://compstore.xyz/media/bag.jpg',
    currentPrice: 1199,
    ourPrice: 1299,
    status: 'tracking',
    lastCheckedAt: admin.firestore.Timestamp.fromDate(new Date()),
    priceHistory: [
      { date: admin.firestore.Timestamp.fromDate(new Date('2026-05-12T00:00:00Z')), price: 1499 },
      { date: admin.firestore.Timestamp.fromDate(new Date('2026-05-18T06:00:00Z')), price: 1199 },
    ],
  };
  await db.collection('dropease_competitors').doc(competitorDoc.competitorId).set(competitorDoc);
  console.log('✅ Seeded competitor document');

  // Create review
  const reviewDoc = {
    reviewId: 'REV-2001',
    uid: uid,
    type: 'product',
    targetId: 'PRD-FTB-001',
    rating: { overall: 4 },
    title: 'Great but quality varies by batch',
    body: 'Received three batches — two were spot‑on…',
    source: 'manual',
    verifiedPurchase: true,
    upvotes: 12,
    createdAt: admin.firestore.Timestamp.fromDate(new Date()),
  };
  await db.collection('dropease_reviews').doc(reviewDoc.reviewId).set(reviewDoc);
  console.log('✅ Seeded review document');

  // Create AI generation
  const aiGenDoc = {
    logId: 'AI-GEN-5001',
    uid: uid,
    productId: 'PRD-FTB-001',
    task: 'product_description',
    provider: 'google',
    model: 'gemini-2.5-flash',
    promptTokens: 320,
    completionTokens: 890,
    totalTokens: 1210,
    estimatedCostUsd: 0.0042,
    latencyMs: 1420,
    success: true,
    outputPreview: 'Title: Foldable Travel Bag…',
    createdAt: admin.firestore.Timestamp.fromDate(new Date()),
  };
  await db.collection('dropease_ai_generations').doc(aiGenDoc.logId).set(aiGenDoc);
  console.log('✅ Seeded AI generation log');

  // Create analytics
  const analyticsDoc = {
    periodId: 'daily-2026-05-18',
    uid: uid,
    storeId: 'demo_shopify_01',
    periodType: 'daily',
    dateRangeStart: admin.firestore.Timestamp.fromDate(new Date('2026-05-18T00:00:00Z')),
    revenue: 25980,
    ordersCount: 18,
    itemsSold: 24,
    avgOrderValue: 1443,
    topProducts: ['PRD-FTB-001', 'PRD-EAR-001'],
    topNiches: ['Fashion', 'Electronics'],
    marketingSpend: 350,
    adSpendSplit: { facebook: 150, google: 100, tiktok: 100 },
    updatedAt: admin.firestore.Timestamp.fromDate(new Date()),
  };
  await db.collection('dropease_analytics').doc(analyticsDoc.periodId).set(analyticsDoc);
  console.log('✅ Seeded analytics document');

  // Create campaign
  const campaignDoc = {
    campaignId: 'CAMPAIGN-001',
    uid: uid,
    name: 'Summer Launch',
    description: ' Summer product launch campaign',
    status: 'draft',
    trigger: 'date_range',
    schedule: { frequency: 'weekly', times: ['09:00', '14:00'], daysOfWeek: [1, 4] },
    actions: [
      { type: 'email', params: { to: 'subscribers@example.com', subject: 'New Arrivals!' } },
    ],
    content: { template: 'Default Summer Template', includeImage: true, hashtags: ['#summer', '#newarrivals'], callToAction: 'Shop Now' },
    stats: { postsPublished: 0, engagement: 0, reach: 0, clicks: 0 },
    createdAt: admin.firestore.Timestamp.fromDate(new Date()),
  };
  await db.collection('dropease_campaigns').doc(campaignDoc.campaignId).set(campaignDoc);
  console.log('✅ Seeded campaign document');

  // Create webhook
  const webhookDoc = {
    subscriptionId: 'webhook-001',
    uid: uid,
    provider: 'shopify',
    url: 'https://demo-shop.myshopify.com/api/webhooks',
    secret: 'dummy_secret',
    active: true,
    createdAt: admin.firestore.Timestamp.fromDate(new Date()),
    lastEventAt: admin.firestore.Timestamp.fromDate(new Date()),
  };
  await db.collection('dropease_webhooks').doc(webhookDoc.subscriptionId).set(webhookDoc);
  console.log('✅ Seeded webhook subscription');

  // Create analytics rollup
  const rollupDoc = {
    rollupId: 'ROLLUP-001',
    uid: uid,
    periodStart: admin.firestore.Timestamp.fromDate(new Date('2026-05-01T00:00:00Z')),
    periodEnd: admin.firestore.Timestamp.fromDate(new Date('2026-05-31T23:59:59Z')),
    revenue: 250000,
    ordersCount: 180,
    avgOrderValue: 1389,
    topProducts: ['PRD-FTB-001', 'PRD-EAR-001'],
    updatedAt: admin.firestore.Timestamp.fromDate(new Date()),
  };
  await db.collection('dropease_analytics_rollup').doc(rollupDoc.rollupId).set(rollupDoc);
  console.log('✅ Seeded analytics‑rollup document');

  console.log('\n🎉 All collections and seed data have been created!');
}

// 3. APPLY RULES
async function applyRules() {
  console.log('\n🔧 Updating Firestore security rules...');
  const rulesPath = path.resolve(__dirname, '../firebase.rules.prod.json');
  const rulesContent = fs.readFileSync(rulesPath, 'utf8');
  const rulesObject = JSON.parse(rulesContent);
  const outPath = path.resolve(__dirname, '../firebase.rules.prod.json');
  fs.writeFileSync(outPath, JSON.stringify(rulesObject, null, 2));
  console.log('✅ Rules file written to firebase.rules.prod.json');
}

// 4. MAIN ENTRY
(async () => {
  try {
    await seedData();
    await applyRules();
    console.log('\n✅ Migration completed successfully!');
  } catch (err) {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  }
})();