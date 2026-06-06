#!/usr/bin/env node
/**
 * Seed ALL Firestore collections with initial placeholder documents.
 * Collections in Firestore appear only after the first document is added.
 * This script creates 1 document per collection to make them visible.
 */

import { initializeApp, cert, getApps, getApp } from 'firebase-admin/app';
import { getFirestore, Timestamp, FieldValue } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const serviceAccount = require('../secrets/automation-copilot-62b12-key.json');
const projectId = serviceAccount.project_id;

// Initialize Firebase Admin
if (!getApps().length) {
  initializeApp({ credential: cert(serviceAccount), projectId });
}

const db = getFirestore();

const COLLECTIONS = {
  // ── 1. Core Business Entities ──────────────────────────────────────
  USERS: 'copilot_users',
  PRODUCTS: 'copilot_products',
  ORDERS: 'copilot_orders',
  SUPPLIERS: 'copilot_suppliers',
  STORES: 'copilot_stores',
  RETURNS: 'copilot_returns',

  // ── 2. Customer & CRM ────────────────────────────────────────────
  CUSTOMERS: 'copilot_customers',
  CUSTOMER_SEGMENTS: 'copilot_customer_segments',
  CRM_ACTIVITIES: 'copilot_crm_activities',
  CRM_AUTOMATIONS: 'copilot_crm_automations',
  GDPR_REQUESTS: 'copilot_gdpr_requests',

  // ── 3. Reviews & Communication ────────────────────────────────────
  PRODUCT_REVIEWS: 'copilot_product_reviews',
  SUPPLIER_REVIEWS: 'copilot_supplier_reviews',
  SUPPLIER_MESSAGES: 'copilot_supplier_messages',
  NOTIFICATIONS: 'copilot_notifications',

  // ── 4. Automation & Rules ────────────────────────────────────────
  AUTOMATION_RULES: 'copilot_automation_rules',
  WORKFLOWS: 'copilot_workflows',
  REORDER_RULES: 'copilot_reorder_rules',
  UPSELL_RULES: 'copilot_upsell_rules',
  PRICING_RULES: 'copilot_pricing_rules',
  INVENTORY_ALERTS: 'copilot_inventory_alerts',
  PRICE_ALERTS: 'copilot_price_alerts',

  // ── 5. Marketing & Campaigns ──────────────────────────────────────
  CAMPAIGNS: 'copilot_campaigns',
  EMAIL_CAMPAIGNS: 'copilot_email_campaigns',
  SMS_CAMPAIGNS: 'copilot_sms_campaigns',
  SEASONAL_CAMPAIGNS: 'copilot_seasonal_campaigns',
  AB_TESTS: 'copilot_ab_tests',
  AFFILIATES: 'copilot_affiliates',

  // ── 6. Operations & Logistics ──────────────────────────────────────
  BULK_ORDERS: 'copilot_bulk_orders',
  SHIPMENT_TRACKING: 'copilot_shipment_tracking',

  // ── 7. Analytics & Insights ──────────────────────────────────────
  ANALYTICS: 'copilot_analytics',
  ACTIVITY_LOG: 'copilot_activity_log',
  COMPETITOR_PRODUCTS: 'copilot_competitor_products',
  COMPLIANCE_REPORTS: 'copilot_compliance_reports',

  // ── 8. Configuration ──────────────────────────────────────────────
  SETTINGS: 'copilot_settings',
  INTEGRATIONS: 'copilot_integrations',
};

const now = Timestamp.now();
const ownerId = 'seed-system';
const sampleUserId = 'user-seed-001';

const seedData = {

  // ═══════════════════════════════════════════════════════════════════
  // 1. CORE BUSINESS ENTITIES
  // ═══════════════════════════════════════════════════════════════════

  [COLLECTIONS.USERS]: {
    id: sampleUserId,
    name: 'Demo User',
    email: 'demo@dropease.com',
    avatar: 'https://i.pravatar.cc/80?u=seed-001',
    plan: 'pro',
    role: 'admin',
    isOnboarded: true,
    ownerId,
    createdAt: now,
    updatedAt: now,
  },

  [COLLECTIONS.PRODUCTS]: {
    id: 'prod-seed-001',
    name: 'Sample Product',
    image: 'https://via.placeholder.com/150',
    niche: 'electronics',
    priceRange: { min: 10, max: 50 },
    competition: 'medium',
    trendScore: 75,
    supplierName: 'Sample Supplier',
    status: 'active',
    price: 29.99,
    currency: 'USD',
    description: 'A sample product for demonstration.',
    stock: 100,
    lowStockThreshold: 10,
    ownerId,
    createdAt: now,
    updatedAt: now,
  },

  [COLLECTIONS.ORDERS]: {
    id: 'ord-seed-001',
    productName: 'Sample Product',
    productImage: 'https://via.placeholder.com/150',
    customer: 'John Doe',
    status: 'pending',
    orderDate: '2024-01-15',
    estimatedDelivery: '2024-01-22',
    total: 49.99,
    quantity: 2,
    items: [{ productId: 'prod-seed-001', quantity: 2, unitPrice: 24.99 }],
    shippingCost: 5.99,
    ownerId,
    createdAt: now,
    updatedAt: now,
  },

  [COLLECTIONS.SUPPLIERS]: {
    id: 'supp-seed-001',
    name: 'Sample Supplier',
    avatar: 'https://via.placeholder.com/80',
    categories: ['electronics', 'accessories'],
    trustScore: 4.5,
    responseTime: '< 24h',
    country: 'China',
    totalProducts: 150,
    verified: true,
    minOrder: 10,
    ownerId,
    createdAt: now,
    updatedAt: now,
  },

  [COLLECTIONS.STORES]: {
    id: 'store-seed-001',
    name: 'My Shopify Store',
    platform: 'shopify',
    url: 'https://mystore.myshopify.com',
    status: 'active',
    productsCount: 25,
    ordersCount: 150,
    ownerId,
    createdAt: now,
    updatedAt: now,
  },

  [COLLECTIONS.RETURNS]: {
    id: 'ret-seed-001',
    orderId: 'ord-seed-001',
    productName: 'Sample Product',
    productImage: 'https://via.placeholder.com/150',
    customer: 'John Doe',
    reason: 'damaged',
    status: 'requested',
    amount: 49.99,
    notes: 'Item arrived with a dent.',
    ownerId,
    createdAt: now,
    updatedAt: now,
  },

  // ═══════════════════════════════════════════════════════════════════
  // 2. CUSTOMER & CRM
  // ═══════════════════════════════════════════════════════════════════

  [COLLECTIONS.CUSTOMERS]: {
    id: 'cust-seed-001',
    name: 'Emma Williams',
    email: 'emma@example.com',
    phone: '+1234567890',
    segment: 'VIP',
    lifetimeValue: 1290.50,
    orders: 14,
    lastOrderDate: '2024-05-10',
    status: 'active',
    leadScore: 85,
    tags: ['wholesale', 'repeat-buyer'],
    consent: { marketing: true, sms: true, analytics: true, updatedAt: '2024-01-01' },
    ownerId,
    createdAt: now,
    updatedAt: now,
  },

  [COLLECTIONS.CUSTOMER_SEGMENTS]: {
    id: 'seg-seed-001',
    name: 'VIP Customers',
    rules: [{ field: 'lifetimeValue', operator: 'gte', value: 1000 }],
    matchMode: 'all',
    size: 22,
    averageOrderValue: 152,
    ownerId,
    createdAt: now,
    updatedAt: now,
  },

  [COLLECTIONS.CRM_ACTIVITIES]: {
    id: 'crmact-seed-001',
    customerId: 'cust-seed-001',
    type: 'email',
    title: 'Sent welcome email',
    body: 'Automated welcome sequence triggered.',
    ownerId,
    createdAt: now,
    updatedAt: now,
  },

  [COLLECTIONS.CRM_AUTOMATIONS]: {
    id: 'crmauto-seed-001',
    name: 'New Customer Welcome',
    trigger: 'new_customer',
    action: 'send_email',
    enabled: true,
    templateId: 'welcome-email-01',
    ownerId,
    createdAt: now,
    updatedAt: now,
  },

  [COLLECTIONS.GDPR_REQUESTS]: {
    id: 'gdpr-seed-001',
    customerId: 'cust-seed-001',
    type: 'export',
    status: 'pending',
    ownerId,
    createdAt: now,
    updatedAt: now,
  },

  // ═══════════════════════════════════════════════════════════════════
  // 3. REVIEWS & COMMUNICATION
  // ═══════════════════════════════════════════════════════════════════

  [COLLECTIONS.PRODUCT_REVIEWS]: {
    id: 'prev-seed-001',
    productId: 'prod-seed-001',
    productName: 'Sample Product',
    rating: 4,
    title: 'Great product!',
    body: 'Really satisfied with the quality.',
    author: 'Emma W.',
    source: 'shopify',
    moderated: 'approved',
    ownerId,
    createdAt: now,
    updatedAt: now,
  },

  [COLLECTIONS.SUPPLIER_REVIEWS]: {
    id: 'srev-seed-001',
    supplierId: 'supp-seed-001',
    rating: 5,
    review: 'Fast shipping and great communication.',
    author: 'Demo User',
    helpful: 12,
    verified: true,
    ownerId,
    createdAt: now,
    updatedAt: now,
  },

  [COLLECTIONS.SUPPLIER_MESSAGES]: {
    id: 'msg-seed-001',
    supplierId: 'supp-seed-001',
    sender: 'Demo User',
    content: 'Hi, I would like to inquire about bulk pricing.',
    subject: 'Bulk Order Inquiry',
    read: false,
    type: 'text',
    ownerId,
    createdAt: now,
    updatedAt: now,
  },

  [COLLECTIONS.NOTIFICATIONS]: {
    id: 'notif-seed-001',
    type: 'order',
    title: 'New Order Received',
    message: 'Order #ord-seed-001 has been placed.',
    read: false,
    href: '/orders/ord-seed-001',
    uid: sampleUserId,
    createdAt: now,
    updatedAt: now,
  },

  // ═══════════════════════════════════════════════════════════════════
  // 4. AUTOMATION & RULES
  // ═══════════════════════════════════════════════════════════════════

  [COLLECTIONS.AUTOMATION_RULES]: {
    id: 'rule-seed-001',
    name: 'Auto-fulfill Orders',
    type: 'fulfillment',
    description: 'Automatically process pending orders.',
    enabled: true,
    status: 'active',
    conditions: {
      autoProcessOrders: true,
      autoGenerateTracking: true,
      notifyCustomer: true,
      minOrderValue: 0,
    },
    stats: { ordersProcessed: 45, successRate: 98 },
    ownerId,
    createdAt: now,
    updatedAt: now,
  },

  [COLLECTIONS.WORKFLOWS]: {
    id: 'wf-seed-001',
    name: 'High Value Order Alert',
    description: 'Notify team when orders exceed $200.',
    enabled: true,
    trigger: 'high_value_order',
    actions: [{ id: 'act-1', type: 'notify_team', label: 'Notify team', params: { channel: 'email' } }],
    ownerId,
    createdAt: now,
    updatedAt: now,
  },

  [COLLECTIONS.REORDER_RULES]: {
    id: 'reorder-seed-001',
    name: 'Auto-reorder Low Stock',
    enabled: true,
    supplierId: 'supp-seed-001',
    supplierName: 'Sample Supplier',
    trigger: 'low_stock',
    conditions: { minStockLevel: 20, reorderQuantity: 100, leadTime: 7, autoReorder: true },
    stats: { autoReorders: 5, stockoutsPrevented: 3 },
    ownerId,
    createdAt: now,
    updatedAt: now,
  },

  [COLLECTIONS.UPSELL_RULES]: {
    id: 'upsell-seed-001',
    name: 'Cart Upsell Engine',
    enabled: true,
    trigger: 'cart_addition',
    aiEngine: 'openai',
    conditions: { minCartValue: 20, maxRecommendations: 3, recommendationType: 'cross_sell' },
    stats: { recommendationsShown: 120, conversionRate: 8.5 },
    ownerId,
    createdAt: now,
    updatedAt: now,
  },

  [COLLECTIONS.PRICING_RULES]: {
    id: 'price-rule-seed-001',
    name: 'Competitive Pricing',
    type: 'competitive',
    targetMargin: 30,
    minPrice: 18,
    maxPrice: 55,
    active: true,
    description: 'Keep prices competitive while protecting margin.',
    ownerId,
    createdAt: now,
    updatedAt: now,
  },

  [COLLECTIONS.INVENTORY_ALERTS]: {
    id: 'inv-alert-seed-001',
    productId: 'prod-seed-001',
    productName: 'Sample Product',
    currentStock: 5,
    threshold: 10,
    level: 'critical',
    acknowledged: false,
    ownerId,
    createdAt: now,
    updatedAt: now,
  },

  [COLLECTIONS.PRICE_ALERTS]: {
    id: 'price-alert-seed-001',
    productId: 'prod-seed-001',
    productName: 'Sample Product',
    oldPrice: 34.99,
    newPrice: 29.99,
    changePercentage: -14.3,
    condition: 'percentage_change',
    threshold: 10,
    acknowledged: false,
    ownerId,
    createdAt: now,
    updatedAt: now,
  },

  // ═══════════════════════════════════════════════════════════════════
  // 5. MARKETING & CAMPAIGNS
  // ═══════════════════════════════════════════════════════════════════

  [COLLECTIONS.CAMPAIGNS]: {
    id: 'camp-seed-001',
    name: 'Spring Sale 2024',
    description: '20% off all products.',
    status: 'draft',
    budget: 500,
    spent: 0,
    startDate: '2024-03-01',
    endDate: '2024-03-31',
    ownerId,
    createdAt: now,
    updatedAt: now,
  },

  [COLLECTIONS.EMAIL_CAMPAIGNS]: {
    id: 'email-camp-seed-001',
    name: 'Welcome Series',
    subject: 'Welcome to DropEase!',
    trigger: 'new_order',
    status: 'draft',
    recipients: 0,
    template: 'welcome-template',
    ownerId,
    createdAt: now,
    updatedAt: now,
  },

  [COLLECTIONS.SMS_CAMPAIGNS]: {
    id: 'sms-camp-seed-001',
    name: 'Abandoned Cart Reminder',
    message: 'You left something in your cart! Complete your purchase now.',
    trigger: 'abandoned_cart',
    status: 'draft',
    recipients: 0,
    ownerId,
    createdAt: now,
    updatedAt: now,
  },

  [COLLECTIONS.SEASONAL_CAMPAIGNS]: {
    id: 'seas-camp-seed-001',
    name: 'Holiday Season Push',
    enabled: true,
    season: 'holiday',
    trigger: 'date_range',
    schedule: { startDate: '2024-11-15', endDate: '2024-12-31', autoStart: true, autoEnd: true },
    actions: { emailCampaigns: true, priceAdjustments: true, socialPosts: true },
    stats: { revenueIncrease: 15000, conversionBoost: 12 },
    ownerId,
    createdAt: now,
    updatedAt: now,
  },

  [COLLECTIONS.AB_TESTS]: {
    id: 'ab-seed-001',
    name: 'Homepage Hero Test',
    description: 'Compare two headline variants.',
    status: 'draft',
    confidence: 0,
    variants: [
      { id: 'v1', name: 'Hero A', trafficSplit: 50, conversions: 0, revenue: 0, active: true },
      { id: 'v2', name: 'Hero B', trafficSplit: 50, conversions: 0, revenue: 0, active: true },
    ],
    ownerId,
    createdAt: now,
    updatedAt: now,
  },

  [COLLECTIONS.AFFILIATES]: {
    id: 'aff-seed-001',
    name: 'Sophia Nguyen',
    email: 'sophia.n@example.com',
    status: 'active',
    referrals: 14,
    earned: 320.50,
    ownerId,
    createdAt: now,
    updatedAt: now,
  },

  // ═══════════════════════════════════════════════════════════════════
  // 6. OPERATIONS & LOGISTICS
  // ═══════════════════════════════════════════════════════════════════

  [COLLECTIONS.BULK_ORDERS]: {
    id: 'bulk-seed-001',
    items: [{ productId: 'prod-seed-001', quantity: 50, unitPrice: 12.99 }],
    totalQuantity: 50,
    totalCost: 649.50,
    status: 'draft',
    estimatedDelivery: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    ownerId,
    createdAt: now,
    updatedAt: now,
  },

  [COLLECTIONS.SHIPMENT_TRACKING]: {
    id: 'track-seed-001',
    provider: 'fedex',
    trackingNumber: 'FDX-123456789',
    status: 'In Transit',
    delivered: false,
    events: [
      { timestamp: '2024-01-15 08:00', description: 'Package received at origin facility' },
      { timestamp: '2024-01-16 13:30', description: 'Package in transit' },
    ],
    ownerId,
    createdAt: now,
    updatedAt: now,
  },

  // ═══════════════════════════════════════════════════════════════════
  // 7. ANALYTICS & INSIGHTS
  // ═══════════════════════════════════════════════════════════════════

  [COLLECTIONS.ANALYTICS]: {
    id: 'analytics-seed-001',
    type: 'daily_summary',
    date: '2024-01-15',
    metrics: {
      revenue: 1250.00,
      orders: 15,
      visitors: 342,
      conversionRate: 4.38,
      adSpend: 150.00,
    },
    ownerId,
    createdAt: now,
    updatedAt: now,
  },

  [COLLECTIONS.ACTIVITY_LOG]: {
    id: 'log-seed-001',
    action: 'product_imported',
    details: 'Imported 5 new products from Sample Supplier.',
    actor: 'Demo User',
    ownerId,
    createdAt: now,
    updatedAt: now,
  },

  [COLLECTIONS.COMPETITOR_PRODUCTS]: {
    id: 'comp-seed-001',
    competitorName: 'Amazon',
    productName: 'Wireless Earbuds Pro',
    url: 'https://amazon.com/dp/example',
    currentPrice: 34.99,
    previousPrice: 39.99,
    ourPrice: 29.99,
    priceHistory: [{ date: '2024-01-01', price: 39.99 }, { date: '2024-01-15', price: 34.99 }],
    ownerId,
    createdAt: now,
    updatedAt: now,
  },

  [COLLECTIONS.COMPLIANCE_REPORTS]: {
    id: 'compl-seed-001',
    name: 'Monthly GDPR Audit',
    enabled: true,
    type: 'gdpr',
    frequency: 'monthly',
    schedule: { nextRun: new Date(Date.now() + 30 * 86400000).toISOString(), autoGenerate: true, recipients: ['admin@dropease.com'] },
    requirements: { dataRetention: true, userConsent: true, dataDeletion: true },
    stats: { reportsGenerated: 3, complianceScore: 92, issuesFound: 1 },
    ownerId,
    createdAt: now,
    updatedAt: now,
  },

  // ═══════════════════════════════════════════════════════════════════
  // 8. CONFIGURATION
  // ═══════════════════════════════════════════════════════════════════

  [COLLECTIONS.SETTINGS]: {
    id: sampleUserId,
    theme: 'system',
    emailNotifications: true,
    pushNotifications: true,
    defaultCurrency: 'USD',
    defaultLanguage: 'en',
    ownerId,
    createdAt: now,
    updatedAt: now,
  },

  [COLLECTIONS.INTEGRATIONS]: {
    id: 'int-seed-001',
    platform: 'shopify',
    connected: true,
    lastSync: new Date().toISOString(),
    apiVersion: '2024-01',
    storeName: 'My Store',
    ownerId,
    createdAt: now,
    updatedAt: now,
  },
};

async function seedAll() {
  console.log('🌱 Seeding all Firestore collections...');
  console.log(`   Project: ${projectId}`);
  console.log(`   Total collections: ${Object.keys(seedData).length}`);
  console.log('');

  let success = 0;
  let failed = 0;

  const entries = Object.entries(seedData);
  for (let i = 0; i < entries.length; i++) {
    const [collectionName, data] = entries[i];
    const docId = data.id;
    const { id, ...docData } = data;

    try {
      const ref = db.collection(collectionName).doc(docId);
      await ref.set(docData);
      console.log(`   ✅ [${String(i + 1).padStart(2, '0')}/${entries.length}] ${collectionName} (${docId})`);
      success++;
    } catch (err) {
      console.error(`   ❌ [${String(i + 1).padStart(2, '0')}/${entries.length}] ${collectionName}: ${err.message}`);
      failed++;
    }
  }

  console.log('');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`   ✅ ${success} collections seeded successfully`);
  if (failed > 0) console.log(`   ❌ ${failed} collections failed`);
  console.log('═══════════════════════════════════════════════════════════');
  console.log('');
  console.log('📊 View in Firebase Console:');
  console.log(`   https://console.firebase.google.com/project/${projectId}/firestore/data`);
}

seedAll().catch(console.error);