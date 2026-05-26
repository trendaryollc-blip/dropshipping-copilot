export type TimestampString = string;

export interface User {
  id: string;
  email: string;
  name?: string;
  displayName?: string;
  avatar?: string;
  photoURL?: string;
  provider?: "email" | "google" | "demo";
  isActive?: boolean;
  role?: "owner" | "admin" | "editor" | "viewer";
  createdAt: TimestampString;
  updatedAt: TimestampString;
}

export interface ApiKeys {
  id: string;
  userId: string;
  openrouter?: string;
  openrouterModel?: string;
  trendaryoApiUrl?: string;
  trendaryoApiKey?: string;
  cjApiKey?: string;
  zendropApiKey?: string;
  aliexpressAppKey?: string;
  aliexpressSecretKey?: string;
  metaApiKey?: string;
  shopifyStoreUrl?: string;
  shopifyAccessToken?: string;
  resendApiKey?: string;
  webhookSecret?: string;
  createdAt?: TimestampString;
  updatedAt: TimestampString;
}

export interface Automation {
  id: string;
  userId: string;
  moduleId: string;
  status: "queued" | "running" | "completed" | "failed";
  input: Record<string, unknown>;
  output?: Record<string, unknown>;
  error?: string;
  message?: string;
  steps?: unknown[];
  startedAt?: TimestampString;
  completedAt?: TimestampString;
  createdAt: TimestampString;
  updatedAt?: TimestampString;
}

export interface Product {
  id: string;
  userId: string;
  name: string;
  description?: string;
  niche?: string;
  category?: string;
  trend?: string;
  estimatedMargin?: string;
  score?: number;
  whyItWins?: string;
  unitCost?: number;
  retailPrice?: number;
  supplierId?: string;
  supplierName?: string;
  status?: "researching" | "saved" | "listed" | "archived";
  tags?: string[];
  images?: string[];
  source?: "research" | "import" | "manual";
  createdAt: TimestampString;
  updatedAt: TimestampString;
}

export interface Supplier {
  id: string;
  userId: string;
  name: string;
  platform: "cj" | "zendrop" | "aliexpress" | "shopify" | "custom" | "ai";
  apiKey?: string;
  contactEmail?: string;
  rating?: number;
  reliabilityScore?: number;
  shippingDays?: string;
  notes?: string;
  unitCost?: number;
  retailPrice?: number;
  shippingCost?: number;
  productUrl?: string;
  productSku?: string;
  tags?: string[];
  isActive?: boolean;
  createdAt: TimestampString;
  updatedAt: TimestampString;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  imageUrl?: string;
  supplier?: "aliexpress" | "cj" | "zendrop" | "custom";
}

export interface SupplierOrder {
  supplier: "aliexpress" | "cj" | "zendrop" | "custom";
  supplierOrderId: string;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  items: OrderItem[];
  trackingNumber?: string;
  trackingUrl?: string;
  shippedAt?: TimestampString;
  deliveredAt?: TimestampString;
  createdAt: TimestampString;
}

export interface TrackingInfo {
  carrier: string;
  trackingNumber: string;
  trackingUrl: string;
  status: "in_transit" | "delivered" | "exception";
  estimatedDelivery?: string;
  history: {
    status: string;
    location: string;
    timestamp: TimestampString;
  }[];
}

export interface Order {
  id: string;
  userId: string;
  orderNumber: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "refund_requested" | "refunded";
  customer: {
    name: string;
    email: string;
    shippingAddress?: {
      street: string;
      city: string;
      state: string;
      zip: string;
      country: string;
    };
  };
  items: OrderItem[];
  totals: {
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
  };
  supplierOrders?: SupplierOrder[];
  trackingNumbers?: TrackingInfo[];
  refundReason?: string;
  refundedAt?: TimestampString;
  createdAt: TimestampString;
  updatedAt: TimestampString;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resource?: string;
  detail?: string;
  metadata?: Record<string, unknown>;
  entityType?: string;
  entityId?: string;
  details?: Record<string, unknown>;
  createdAt: TimestampString;
}

export interface PromptTemplate {
  id: string;
  userId: string;
  moduleId: string;
  name: string;
  prompt?: string;
  systemPrompt?: string;
  userPromptTemplate?: string;
  temperature?: number;
  variables?: string[];
  createdAt: TimestampString;
  updatedAt: TimestampString;
}

export interface Settings {
  id: string;
  userId: string;
  notifications?: {
    email?: boolean;
    inApp?: boolean;
    slack?: boolean;
    slackWebhook?: string;
    orderUpdates?: boolean;
    productUpdates?: boolean;
    automationAlerts?: boolean;
    weeklyDigest?: boolean;
  };
  automation: {
    scheduledScans?: boolean;
    scanFrequency?: "daily" | "weekly" | "monthly";
    frequency?: "daily" | "weekly" | "monthly";
    scanQuery?: string;
    defaultQuery?: string;
    autoFulfillOrders?: boolean;
    autoSyncTracking?: boolean;
    lastScanAt?: TimestampString;
    lastRunAt?: TimestampString;
    nextScanAt?: TimestampString;
    nextRunAt?: TimestampString;
  };
  preferences?: Record<string, unknown>;
  createdAt?: TimestampString;
  updatedAt: TimestampString;
}

export interface Notification {
  id: string;
  userId: string;
  type: "order" | "product" | "automation" | "system" | "billing";
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  createdAt: TimestampString;
}

export type AppNotification = Notification;

export interface TeamMember {
  id: string;
  userId: string;
  email: string;
  name: string;
  role: "owner" | "admin" | "editor" | "viewer";
  avatar?: string;
  invitedBy: string;
  joinedAt: TimestampString;
  lastActiveAt?: TimestampString;
}

export interface TeamInvitation {
  id: string;
  email: string;
  role: "admin" | "editor" | "viewer";
  invitedBy: string;
  invitedAt: TimestampString;
  expiresAt: TimestampString;
  status: "pending" | "accepted" | "declined" | "expired";
}

export interface WorkflowStep {
  id: string;
  type: "trigger" | "action" | "condition" | "delay";
  name: string;
  config: Record<string, unknown>;
  nextStepId?: string;
  branchTrue?: string;
  branchFalse?: string;
}

export interface Workflow {
  id: string;
  userId: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  trigger: {
    type: "new_order" | "low_stock" | "schedule" | "manual" | "webhook";
    config: Record<string, unknown>;
  };
  isActive: boolean;
  lastRunAt?: TimestampString;
  runCount: number;
  createdAt: TimestampString;
  updatedAt: TimestampString;
}

export interface WorkflowRun {
  id: string;
  workflowId: string;
  status: "running" | "completed" | "failed" | "cancelled";
  startedAt: TimestampString;
  completedAt?: TimestampString;
  stepsExecuted: number;
  error?: string;
  logs: {
    stepId: string;
    status: "started" | "completed" | "failed";
    message?: string;
    timestamp: TimestampString;
  }[];
}

export interface Webhook {
  id: string;
  userId: string;
  name: string;
  url: string;
  events: string[];
  secret: string;
  isActive: boolean;
  headers: Record<string, string>;
  createdAt: TimestampString;
  lastTriggeredAt?: TimestampString;
  failureCount: number;
}

export interface WebhookDelivery {
  id: string;
  webhookId: string;
  event: string;
  payload: Record<string, unknown>;
  responseStatus?: number;
  responseBody?: string;
  deliveredAt: TimestampString;
  retryCount: number;
  nextRetryAt?: TimestampString;
}

export interface AnalyticsData {
  userId: string;
  date: string;
  ordersCount: number;
  ordersRevenue: number;
  productsListed: number;
  topProducts: {
    productId: string;
    name: string;
    salesCount: number;
    revenue: number;
  }[];
  supplierPerformance: {
    supplier: string;
    ordersCount: number;
    onTimeRate: number;
    defectRate: number;
  }[];
  automationRuns: number;
  successRate: number;
}

export interface BillingUsage {
  userId: string;
  period: "monthly" | "yearly";
  startDate: TimestampString;
  endDate: TimestampString;
  automationsRun: number;
  productsResearched: number;
  ordersProcessed: number;
  notificationsSent: number;
  apiCalls: number;
  storageGb: number;
}

export interface SubscriptionPlan {
  id: string;
  name: "free" | "starter" | "professional" | "enterprise";
  price: number;
  period: "month" | "year";
  features: string[];
  limits: {
    automations: number;
    products: number;
    orders: number;
    teamMembers: number;
    apiCalls: number;
  };
}

export interface UserSettings {
  userId: string;
  storefront: {
    platform: "shopify" | "woocommerce" | "custom";
    url?: string;
    apiKey?: string;
    apiSecret?: string;
  };
  notifications: {
    email: boolean;
    inApp: boolean;
    orderUpdates: boolean;
    productUpdates: boolean;
    automationAlerts: boolean;
    weeklyDigest: boolean;
  };
  defaults: {
    researchQuery?: string;
    profitMargin: number;
    currency: string;
    timezone: string;
  };
  billing?: {
    plan: SubscriptionPlan["name"];
    startedAt: TimestampString;
    renewsAt?: TimestampString;
  };
}
