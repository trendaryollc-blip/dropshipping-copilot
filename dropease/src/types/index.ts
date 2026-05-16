export type ProductStatus = "active" | "draft" | "archived"
export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled"
export type CompetitionLevel = "low" | "medium" | "high"
export type DescriptionTone = "professional" | "casual" | "persuasive" | "playful"
export type StoreStatus = "active" | "inactive" | "disconnected"
export type StorePlatform = "shopify" | "woocommerce" | "bigcommerce" | "magento" | "custom"

export interface Product {
  id: string
  name: string
  image: string
  niche: string
  priceRange: { min: number; max: number }
  competition: CompetitionLevel
  trendScore: number
  supplierName: string
  status: ProductStatus
  importedAt?: string
  description?: string
  views?: number
}

export interface Supplier {
  id: string
  name: string
  avatar: string
  categories: string[]
  trustScore: number
  responseTime: string
  country: string
  totalProducts: number
  verified: boolean
  minOrder: number
}

// ─── Supplier Integration ────────────────────────────────────────────────────
export interface SupplierAPI {
  id: string
  status: "connected" | "disconnected" | "error"
  lastSync: string
  apiVersion: string
  connected: boolean
}

export interface SupplierReview {
  id: string
  supplierId: string
  rating: number // 1-5
  review: string
  author: string
  createdAt: string
  helpful: number
  verified: boolean
}

export interface ProductReview {
  id: string
  productId?: string
  productName?: string
  rating: number // 1-5
  title?: string
  body: string
  author: string
  source?: string
  createdAt: string
  moderated?: "pending" | "approved" | "flagged" | "removed"
  replies?: { id: string; author: string; message: string; createdAt: string }[]
}

export interface SupplierMessage {
  id: string
  supplierId: string
  sender: string
  content: string
  subject?: string
  timestamp: string
  read: boolean
  type: "text" | "quote" | "attachment"
}

export interface BulkOrder {
  id: string
  items: {
    productId: string
    quantity: number
    unitPrice: number
  }[]
  totalQuantity: number
  totalCost: number
  status: "draft" | "pending" | "confirmed" | "processing" | "in_transit" | "delivered"
  createdAt: string
  estimatedDelivery: string
}

export interface Order {
  id: string
  productName: string
  productImage: string
  customer: string
  status: OrderStatus
  orderDate: string
  estimatedDelivery: string
  trackingNumber?: string
  total: number
  quantity: number
}

export interface ActivityItem {
  id: string
  type: "import" | "order" | "supplier" | "description"
  message: string
  time: string
}

export interface DashboardStats {
  productsImported: number
  suppliersConnected: number
  ordersPending: number
  monthlyRevenue: number
  revenueChange: number
  ordersChange: number
  suppliersChange: number
  productsChange: number
}

export interface LearnArticle {
  id: string
  title: string
  summary: string
  readTime: string
  category: string
  content: string
}

export interface Store {
  id: string
  name: string
  platform: StorePlatform
  url: string
  status: StoreStatus
  connectedAt: string
  productsCount: number
  ordersCount: number
}

export type AutomationStatus = "active" | "paused" | "disabled"
export type AutomationType = "fulfillment" | "price_monitoring" | "email_marketing" | "inventory"
export type PriceAlertCondition = "below" | "above" | "percentage_change"
export type EmailTrigger = "new_order" | "order_shipped" | "order_delivered" | "abandoned_cart" | "low_stock"
export type InventoryAlertLevel = "low" | "critical" | "out_of_stock"

export interface AutomationRule {
  id: string
  type: AutomationType
  name: string
  description: string
  status: AutomationStatus
  createdAt: string
  lastRun?: string
  nextRun?: string
  enabled: boolean
}

export interface FulfillmentRule extends AutomationRule {
  type: "fulfillment"
  conditions: {
    autoProcessOrders: boolean
    autoGenerateTracking: boolean
    notifyCustomer: boolean
    notifySupplier: boolean
    minOrderValue: number
    excludeWeekends: boolean
  }
  stats: {
    ordersProcessed: number
    averageProcessingTime: string
    successRate: number
  }
}

export interface PriceMonitoringRule extends AutomationRule {
  type: "price_monitoring"
  conditions: {
    productIds: string[]
    checkInterval: number // hours
    alertCondition: PriceAlertCondition
    thresholdValue: number
    competitorUrls: string[]
  }
  stats: {
    alertsTriggered: number
    priceChangesDetected: number
    lastCheck: string
  }
}

export interface PriceAlert {
  id: string
  productId: string
  productName: string
  oldPrice: number
  newPrice: number
  changePercentage: number
  condition: PriceAlertCondition
  threshold: number
  triggeredAt: string
  acknowledged: boolean
}

export interface EmailMarketingRule extends AutomationRule {
  type: "email_marketing"
  conditions: {
    triggers: EmailTrigger[]
    template: string
    sendDelay: number // hours after trigger
    includeDiscount: boolean
    discountValue?: number
  }
  stats: {
    emailsSent: number
    openRate: number
    clickRate: number
    conversionRate: number
  }
}

export interface EmailCampaign {
  id: string
  name: string
  subject: string
  trigger: EmailTrigger
  status: "draft" | "scheduled" | "sent" | "paused"
  recipients: number
  sentAt?: string
  scheduledFor?: string
  openRate?: number
  clickRate?: number
}

export interface AbandonedCartRule {
  id: string
  name: string
  enabled: boolean
  triggerDelay: number // minutes after cart abandonment
  emailSequence: {
    firstEmail: { subject: string; delay: number }
    secondEmail: { subject: string; delay: number }
    thirdEmail: { subject: string; delay: number }
  }
  discountOffer: number
  stats: {
    cartsRecovered: number
    revenueRecovered: number
    recoveryRate: number
  }
}

export interface InventoryRule extends AutomationRule {
  type: "inventory"
  conditions: {
    productIds: string[]
    lowStockThreshold: number
    criticalStockThreshold: number
    autoReorder: boolean
    reorderQuantity: number
    alertLevel: InventoryAlertLevel
  }
  stats: {
    alertsTriggered: number
    autoReordersPlaced: number
    stockoutsPrevented: number
  }
}

export interface InventoryAlert {
  id: string
  productId: string
  productName: string
  currentStock: number
  threshold: number
  level: InventoryAlertLevel
  triggeredAt: string
  acknowledged: boolean
  autoReorderPlaced?: boolean
}

// ─── Auth ────────────────────────────────────────────────────────────────────
export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  plan: "free" | "pro"
  createdAt: string
  isOnboarded: boolean
}

// ─── Notifications ───────────────────────────────────────────────────────────
export type NotificationType = "order" | "product" | "supplier" | "system" | "alert"

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  read: boolean
  createdAt: string
  href?: string
}

// ─── Returns / Refunds ───────────────────────────────────────────────────────
export type ReturnStatus = "requested" | "approved" | "refunded" | "denied"
export type ReturnReason =
  | "damaged"
  | "wrong_item"
  | "not_as_described"
  | "changed_mind"
  | "quality_issue"

export interface ReturnRequest {
  id: string
  orderId: string
  productName: string
  productImage: string
  customer: string
  reason: ReturnReason
  status: ReturnStatus
  requestedAt: string
  resolvedAt?: string
  amount: number
  notes?: string
}

// ─── Business Operations ─────────────────────────────────────────────────────
export interface CustomerProfile {
  id: string
  name: string
  email: string
  segment: string
  lifetimeValue: number
  orders: number
  lastOrderDate: string
  status: "active" | "inactive"
  lastContacted: string
}

export interface CustomerSegment {
  id: string
  name: string
  criteria: string
  size: number
  averageOrderValue: number
}

export interface PaymentGatewayConfig {
  provider: string
  accountName: string
  connected: boolean
  lastSync: string
  fees: { percentage: number; fixed: number }
}

export interface PaymentTransaction {
  id: string
  orderId: string
  customerName: string
  amount: number
  gateway: string
  status: "completed" | "pending" | "failed" | "refunded"
  createdAt: string
}

export interface ShippingRate {
  provider: string
  service: string
  cost: number
  estimatedDelivery: string
  insured: boolean
}

export interface ShipmentEvent {
  timestamp: string
  description: string
}

export interface ShipmentTracking {
  provider: string
  trackingNumber: string
  status: string
  delivered: boolean
  events: ShipmentEvent[]
}

export interface ABTestVariant {
  id: string
  name: string
  trafficSplit: number
  conversions: number
  revenue: number
  active: boolean
}

export interface ABTest {
  id: string
  name: string
  description: string
  status: "draft" | "running" | "completed"
  confidence: number
  variants: ABTestVariant[]
}

export interface SMSCampaign {
  id: string
  name: string
  message: string
  trigger: EmailTrigger | "new_order" | "order_shipped" | "abandoned_cart" | "low_stock"
  status: "draft" | "scheduled" | "sent" | "paused"
  recipients: number
}

export interface PricingRule {
  id: string
  name: string
  type: "competitive" | "margin" | "seasonal"
  targetMargin: number
  minPrice: number
  maxPrice: number
  active: boolean
  description: string
}

export interface PricingRecommendation {
  productId: string
  currentPrice: number
  recommendedPrice: number
  priceElasticity: number
  expectedImpact: string
}

export interface AffiliateMember {
  id: string
  name: string
  email: string
  status: "active" | "pending" | "inactive"
  referrals: number
  earned: number
}

export interface WorkflowAction {
  id: string
  type: string
  label: string
  params: Record<string, any>
}

export interface Workflow {
  id: string
  name: string
  description: string
  enabled: boolean
  trigger: string
  actions: WorkflowAction[]
}

// ─── Competitors ─────────────────────────────────────────────────────────────
export interface CompetitorProduct {
  id: string
  competitorName: string
  productName: string
  url: string
  currentPrice: number
  previousPrice?: number
  ourPrice?: number
  lastChecked: string
  priceHistory: { date: string; price: number }[]
}

// ─── Niche Trends ────────────────────────────────────────────────────────────
export interface NicheTrend {
  niche: string
  trendScore: number
  weeklyChange: number
  searchVolume: string
  competition: CompetitionLevel
  topProducts: string[]
  peakSeason: string
  emoji: string
}

// ─── New Automation Features ─────────────────────────────────────────────────
export interface LifecycleCampaign {
  id: string
  name: string
  trigger: "new_customer" | "birthday" | "inactive_customer" | "loyal_customer"
  enabled: boolean
  sequence: {
    email1: { subject: string; delay: number; template: string }
    email2?: { subject: string; delay: number; template: string }
    email3?: { subject: string; delay: number; template: string }
  }
  stats: {
    sent: number
    openRate: number
    conversionRate: number
  }
}

export interface DynamicPricingRule {
  id: string
  name: string
  enabled: boolean
  trigger: "demand_high" | "demand_low" | "competitor_price" | "inventory_low" | "seasonal"
  conditions: {
    threshold: number
    adjustmentType: "percentage" | "fixed"
    adjustmentValue: number
    minPrice?: number
    maxPrice?: number
  }
  stats: {
    adjustments: number
    revenueImpact: number
    avgPriceChange: number
  }
}

export interface ListingRule {
  id: string
  name: string
  enabled: boolean
  trigger: "trend_score" | "profit_margin" | "demand_score" | "manual_review"
  conditions: {
    minTrendScore: number
    minProfitMargin: number
    minDemandScore: number
    autoPublish: boolean
    platforms: string[]
  }
  stats: {
    productsListed: number
    autoPublished: number
    pendingReview: number
    revenueGenerated: number
  }
}

export interface SocialCampaign {
  id: string
  name: string
  enabled: boolean
  platform: "instagram" | "facebook" | "twitter" | "tiktok" | "pinterest"
  trigger: "new_product" | "trending_product" | "sale_event" | "scheduled"
  schedule: {
    frequency: "daily" | "weekly" | "custom"
    times: string[]
    daysOfWeek?: number[]
  }
  content: {
    template: string
    includeImage: boolean
    hashtags: string[]
    callToAction: string
  }
  stats: {
    postsPublished: number
    engagement: number
    reach: number
    clicks: number
  }
}

export interface OrderWorkflow {
  id: string
  name: string
  enabled: boolean
  trigger: "new_order" | "high_value_order" | "international_order" | "custom"
  steps: {
    id: string
    name: string
    type: "approval" | "quality_check" | "fraud_check" | "customs_clearance" | "notification" | "custom"
    assignee?: string
    autoAdvance: boolean
    timeLimit?: number
  }[]
  stats: {
    ordersProcessed: number
    avgProcessingTime: number
    approvalsRequired: number
    automatedSteps: number
  }
}

export interface ReorderRule {
  id: string
  name: string
  enabled: boolean
  supplierId: string
  supplierName: string
  trigger: "low_stock" | "sales_velocity" | "seasonal_demand" | "manual_threshold"
  conditions: {
    minStockLevel: number
    reorderQuantity: number
    leadTime: number
    safetyStock: number
    autoReorder: boolean
  }
  stats: {
    autoReorders: number
    manualOverrides: number
    stockoutsPrevented: number
    costSavings: number
  }
}

export interface UpsellRule {
  id: string
  name: string
  enabled: boolean
  trigger: "cart_addition" | "checkout_view" | "order_complete" | "browsing_behavior"
  aiEngine: "openai" | "claude" | "custom"
  conditions: {
    minCartValue: number
    maxRecommendations: number
    recommendationType: "upsell" | "cross_sell" | "bundle"
    personalizationLevel: "basic" | "advanced" | "premium"
  }
  stats: {
    recommendationsShown: number
    recommendationsClicked: number
    additionalRevenue: number
    conversionRate: number
  }
}

export interface SeasonalCampaign {
  id: string
  name: string
  enabled: boolean
  season: "winter" | "spring" | "summer" | "fall" | "holiday" | "back_to_school" | "custom"
  trigger: "date_range" | "event_based" | "demand_spike"
  schedule: {
    startDate: string
    endDate: string
    autoStart: boolean
    autoEnd: boolean
  }
  actions: {
    emailCampaigns: boolean
    priceAdjustments: boolean
    socialPosts: boolean
    productSpotlight: boolean
    discountCodes: string[]
  }
  stats: {
    campaignsRun: number
    revenueIncrease: number
    conversionBoost: number
    customerEngagement: number
  }
}

export interface ComplianceReport {
  id: string
  name: string
  enabled: boolean
  type: "gdpr" | "ccpa" | "tax" | "audit" | "custom"
  frequency: "monthly" | "quarterly" | "annually" | "on_demand"
  schedule: {
    nextRun: string
    lastRun?: string
    autoGenerate: boolean
    recipients: string[]
  }
  requirements: {
    dataRetention: boolean
    userConsent: boolean
    dataDeletion: boolean
    breachNotification: boolean
    taxCalculation: boolean
  }
  stats: {
    reportsGenerated: number
    complianceScore: number
    issuesFound: number
    autoResolved: number
  }
}

// ─── Margin Calculator ───────────────────────────────────────────────────────
export interface MarginResult {
  grossRevenue: number
  productCost: number
  shippingCost: number
  platformFees: number
  paymentFees: number
  adSpend: number
  returnCost: number
  totalCosts: number
  netProfit: number
  profitMargin: number
  roi: number
  breakEvenPrice: number
}
