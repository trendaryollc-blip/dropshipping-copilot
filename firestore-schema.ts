/**
 * ================================================================
 * FIRESTORE DATABASE STRUCTURE — Dropship Autopilot
 * ================================================================
 * Version: 1.0 | Last Updated: 2026-05-26
 *
 * This file serves as the authoritative reference for the entire
 * Firestore database structure. It defines every collection,
 * document fields, types, relationships, and index requirements
 * in a professional, easy-to-navigate format.
 *
 * ================================================================
 * COLLECTION INDEX (13 root collections)
 * ================================================================
 *
 *  SECTION 1 — USERS & AUTHENTICATION
 *    1a. users         → User accounts and profiles
 *    1b. api_keys      → Third-party API key storage
 *
 *  SECTION 2 — CATALOG & SOURCING
 *    2a. products      → Product listings and research results
 *    2b. suppliers     → Supplier integrations and configs
 *
 *  SECTION 3 — ORDERS & FULFILLMENT
 *    3a. orders        → Customer orders and tracking
 *
 *  SECTION 4 — AUTOMATIONS
 *    4a. automations   → Individual automation run records
 *    4b. workflows     → Visual workflow definitions
 *    4c. workflow_runs → Workflow execution logs
 *
 *  SECTION 5 — TEAM MANAGEMENT
 *    5a. team_members   → Active team memberships
 *    5b. team_invitations → Pending team invitations
 *
 *  SECTION 6 — SETTINGS & CONFIG
 *    6a. settings      → User preferences and config
 *
 *  SECTION 7 — COMMUNICATIONS
 *    7a. notifications → In-app notification feed
 *
 *  SECTION 8 — AI & CONTENT
 *    8a. prompt_templates → AI prompt templates
 *
 *  SECTION 9 — INTEGRATIONS
 *    9a. webhooks        → Outbound webhook endpoints
 *    9b. webhook_deliveries → Webhook delivery log
 *
 *  SECTION 10 — AUDIT & ANALYTICS
 *    10a. audit_logs     → Immutable activity logs
 *    10b. analytics      → Daily aggregated stats
 *
 *  SECTION 11 — BILLING
 *    11a. billing_usage  → Usage metering per period
 *    11b. subscriptions  → Subscription plan records
 *
 * ================================================================
 * SECTION 1: USERS & AUTHENTICATION
 * ================================================================
 *
 * ┌─────────────────────────────────────────────────────────────┐
 * │  1a. users                                                │
 * ├─────────────────────────────────────────────────────────────┤
 * │  Document ID: Firebase Auth UID                           │
 * │  Description: Primary user profile and identity record.   │
 * │                                                             │
 * │  FIELDS:                                                   │
 * │    id            string  Firebase Auth UID (same as doc ID)│
 * │    email         string  User email address                │
 * │    name          string  Full display name                 │
 * │    avatar        string  Profile avatar URL                │
 * │    provider      string  "email" | "google" | "demo"       │
 * │    role          string  "owner" | "admin" | "editor"      │
 * │                          | "viewer"                        │
 * │    plan          string  "free" | "starter" | "professional"│
 * │                          | "enterprise"                    │
 * │    isActive      boolean Account active flag                │
 * │    createdAt     string  ISO 8601 timestamp                 │
 * │    updatedAt     string  ISO 8601 timestamp                 │
 * │                                                             │
 * │  INDEXES:                                                  │
 * │    • email (asc)  → login lookups                         │
 * │    • createdAt (desc) → user lists                         │
 * └─────────────────────────────────────────────────────────────┘
 *
 * ┌─────────────────────────────────────────────────────────────┐
 * │  1b. api_keys                                             │
 * ├─────────────────────────────────────────────────────────────┤
 * │  Document ID: Firebase Auth UID                           │
 * │  Description: Encrypted storage for 3rd-party API keys.    │
 * │  Note: All sensitive fields AES-encrypted before storage.  │
 * │                                                             │
 * │  FIELDS:                                                   │
 * │    id                  string  Firebase Auth UID           │
 * │    userId              string  Same as document ID         │
 * │    openrouter          string  OpenRouter API key (encrypted)│
 * │    openrouterModel     string  Default model identifier    │
 * │    trendaryoApiUrl     string  Trendaryo API base URL      │
 * │    trendaryoApiKey     string  Trendaryo API key (encrypted)│
 * │    cjApiKey            string  CJ Dropshipping key (encrypted)│
 * │    zendropApiKey       string  Zendrop API key (encrypted) │
 * │    aliexpressAppKey    string  AliExpress app key          │
 * │    aliexpressSecretKey string  AliExpress secret (encrypted)│
 * │    metaApiKey          string  Meta/Facebook API key (encrypted)│
 * │    shopifyStoreUrl     string  Shopify store URL           │
 * │    shopifyAccessToken  string  Shopify token (encrypted)    │
 * │    resendApiKey        string  Resend email key (encrypted)│
 * │    webhookSecret       string  Webhook HMAC secret (encrypted)│
 * │    createdAt           string  ISO 8601 timestamp          │
 * │    updatedAt           string  ISO 8601 timestamp          │
 * └─────────────────────────────────────────────────────────────┘
 *
 * ================================================================
 * SECTION 2: CATALOG & SOURCING
 * ================================================================
 *
 * ┌─────────────────────────────────────────────────────────────┐
 * │  2a. products                                              │
 * ├─────────────────────────────────────────────────────────────┤
 * │  Document ID: Auto-generated Firestore ID                   │
 * │  Description: Product catalog entries from AI research,    │
 * │               manual import, or supplier sync.             │
 * │                                                             │
 * │  FIELDS:                                                   │
 * │    id               string  Auto-generated document ID      │
 * │    userId           string  Owner Firebase Auth UID         │
 * │    name             string  Product title (max 300 chars)  │
 * │    description      string  Full product description       │
 * │    niche            string  Product niche / vertical       │
 * │    category         string  Product category path          │
 * │    trend            string  "rising" | "stable" | "seasonal"│
 * │    estimatedMargin  string  Estimated margin %             │
 * │    score            number  AI product score 0–100         │
 * │    whyItWins        string  AI reasoning for selection     │
 * │    unitCost         number  Supplier unit cost in USD      │
 * │    retailPrice      number  Suggested retail price in USD  │
 * │    supplierId       string  Linked supplier document ID    │
 * │    supplierName     string  Linked supplier display name   │
 * │    status           string  "researching" | "saved" |      │
 * │                          "listed" | "archived"             │
 * │    tags             string[] Searchable keyword tags       │
 * │    images           string[] Product image URLs            │
 * │    source           string  "research" | "import" | "manual"│
 * │    createdAt        string  ISO 8601 timestamp             │
 * │    updatedAt        string  ISO 8601 timestamp             │
 * │                                                             │
 * │  INDEXES:                                                  │
 * │    • userId + createdAt (desc)  → user's product feed     │
 * │    • userId + status (asc)       → filter by status        │
 * │    • userId + score (desc)        → sort by score           │
 * │    • userId + niche (asc)         → filter by niche         │
 * │    • userId + source (asc)        → filter by source        │
 * └─────────────────────────────────────────────────────────────┘
 *
 * ┌─────────────────────────────────────────────────────────────┐
 * │  2b. suppliers                                             │
 * ├─────────────────────────────────────────────────────────────┤
 * │  Document ID: Auto-generated Firestore ID                   │
 * │  Description: Supplier integrations, API credentials,      │
 * │               and product feed configurations.              │
 * │                                                             │
 * │  FIELDS:                                                   │
 * │    id               string  Auto-generated document ID    │
 * │    userId           string  Owner Firebase Auth UID         │
 * │    name             string  Supplier display name           │
 * │    platform         string  "cj" | "zendrop" | "aliexpress"│
 * │                          | "shopify" | "custom" | "ai"      │
 * │    apiKey           string  API key (AES-encrypted)       │
 * │    contactEmail     string  Supplier contact email         │
 * │    rating           number  Supplier rating 0–5            │
 * │    reliabilityScore number  Reliability score 0–100        │
 * │    shippingDays    string  Estimated shipping time range  │
 * │    notes            string  Internal notes                 │
 * │    unitCost         number  Default unit cost              │
 * │    shippingCost    number  Default shipping cost per unit  │
 * │    productUrl       string  Product feed URL              │
 * │    productSku       string  Default SKU pattern           │
 * │    tags             string[] Tags for filtering            │
 * │    isActive         boolean Active supplier flag           │
 * │    createdAt        string  ISO 8601 timestamp            │
 * │    updatedAt        string  ISO 8601 timestamp            │
 * │                                                             │
 * │  INDEXES:                                                  │
 * │    • userId + isActive (asc) → active suppliers list       │
 * │    • userId + platform (asc) → filter by platform         │
 * └─────────────────────────────────────────────────────────────┘
 *
 * ================================================================
 * SECTION 3: ORDERS & FULFILLMENT
 * ================================================================
 *
 * ┌─────────────────────────────────────────────────────────────┐
 * │  3a. orders                                                │
 * ├─────────────────────────────────────────────────────────────┤
 * │  Document ID: Auto-generated Firestore ID                  │
 * │  Description: Customer orders through the platform,       │
 * │               including fulfillment and tracking.          │
 * │                                                             │
 * │  FIELDS:                                                   │
 * │    id             string  Auto-generated document ID       │
 * │    userId         string  Owner Firebase Auth UID          │
 * │    orderNumber    string  Human-readable order number      │
 * │    status         string  "pending" | "processing" |       │
 * │                        "shipped" | "delivered" |            │
 * │                        "cancelled" | "refund_requested" |  │
 * │                        "refunded"                          │
 * │    customer       object  Customer information             │
 * │      name         string  Customer full name              │
 * │      email        string  Customer email address          │
 * │      shippingAddress object  Full shipping address        │
 * │        street     string  Street address line 1           │
 * │        city       string  City                            │
 * │        state      string  State / province                 │
 * │        zip        string  Postal / zip code               │
 * │        country    string  ISO 3166-1 alpha-2 country code│
 * │    items          OrderItem[] Line items                  │
 * │      id           string  Item ID                        │
 * │      productId    string  Linked product ID              │
 * │      productName  string  Product name at time of order  │
 * │      quantity     number  Units ordered                  │
 * │      unitPrice    number  Price per unit (USD)           │
 * │      imageUrl     string  Product image URL              │
 * │      supplier     string  "aliexpress" | "cj" | "zendrop"│
 * │                          | "custom"                       │
 * │    totals         object  Financial summary              │
 * │      subtotal     number  Sum of item prices             │
 * │      shipping     number  Shipping cost                  │
 * │      tax          number  Tax amount                      │
 * │      total        number  Grand total                     │
 * │    supplierOrders  SupplierOrder[] Orders per supplier   │
 * │      supplier     string  "aliexpress" | "cj" | "zendrop"│
 * │                          | "custom"                       │
 * │      supplierOrderId string  Order ID in supplier system  │
 * │      status       string  "pending" | "confirmed" |      │
 * │                        "shipped" | "delivered" |           │
 * │                        "cancelled"                        │
 * │      items        OrderItem[] Items from this supplier     │
 * │      trackingNumber string  Supplier tracking number      │
 * │      trackingUrl  string  Carrier tracking URL            │
 * │      shippedAt    string  ISO 8601 timestamp              │
 * │      deliveredAt string  ISO 8601 timestamp              │
 * │      createdAt   string  ISO 8601 timestamp              │
 * │    trackingNumbers TrackingInfo[] Multi-carrier tracking  │
 * │      carrier     string  Carrier name (e.g. "UPS")       │
 * │      trackingNumber string  Carrier tracking number
 * │      trackingUrl string  Tracking URL
 * │      status      string  "in_transit" | "delivered" |    │
 * │                        "exception"
 * │      estimatedDelivery string  Est. delivery date        │
 * │      history     object[] Status change events            │
 * │        status    string  Event status                     │
 * │        location  string  Event location                  │
 * │        timestamp string  ISO 8601 timestamp              │
 * │    refundReason   string  Reason for refund               │
 * │    refundedAt     string  ISO 8601 refund timestamp       │
 * │    createdAt      string  ISO 8601 timestamp             │
 * │    updatedAt      string  ISO 8601 timestamp             │
 * │                                                             │
 * │  SUB-COLLECTION: orders/{orderId}/timeline/                │
 * │    Timeline events for order history display              │
 * │    Fields:                                                 │
 * │      type      string  "status_change" | "note" |         │
 * │                        "tracking_update" | "refund"        │
 * │      message   string  Human-readable event description   │
 * │      data      object  Additional event-specific data      │
 * │      createdAt string  ISO 8601 timestamp                  │
 * │                                                             │
 * │  INDEXES:                                                  │
 * │    • userId + createdAt (desc)  → order feed               │
 * │    • userId + status (asc)      → filter by status         │
 * │    • userId + orderNumber (asc) → order number lookup      │
 * └─────────────────────────────────────────────────────────────┘
 *
 * ================================================================
 * SECTION 4: AUTOMATIONS
 * ================================================================
 *
 * ┌─────────────────────────────────────────────────────────────┐
 * │  4a. automations                                           │
 * ├─────────────────────────────────────────────────────────────┤
 * │  Document ID: Auto-generated Firestore ID                   │
 * │  Description: Individual automation run records — research  │
 * │               scans, copywriting, storefront publishing.  │
 * │                                                             │
 * │  FIELDS:                                                   │
 * │    id           string  Auto-generated document ID          │
 * │    userId       string  Owner Firebase Auth UID             │
 * │    moduleId     string  Module identifier                   │
 * │                        "product-research" | "suppliers" |   │
 * │                        "copywriting" | "orders" |          │
 * │                        "full-pipeline"                     │
 * │    status       string  "queued" | "running" |            │
 * │                        "completed" | "failed"             │
 * │    input        object  Module input parameters             │
 * │    output       object  Module output / results            │
 * │    error        string  Error message if failed            │
 * │    message      string  Status message / summary            │
 * │    steps        object[] Step-by-step execution log         │
 * │      id         string  Step identifier                    │
 * │      name       string  Human-readable step name          │
 * │      status     string  "pending" | "running" |            │
 * │                        "completed" | "failed"             │
 * │      startedAt  string  ISO 8601 timestamp                │
 * │      completedAt string  ISO 8601 timestamp                │
 * │      output     object  Step output data                   │
 * │      error      string  Step-level error                   │
 * │    startedAt    string  ISO 8601 execution start            │
 * │    completedAt  string  ISO 8601 execution end              │
 * │    createdAt    string  ISO 8601 timestamp                  │
 * │    updatedAt    string  ISO 8601 timestamp                  │
 * │                                                             │
 * │  SUB-COLLECTION: automations/{automationId}/steps/          │
 * │    Detailed step execution records                         │
 * │    Fields:                                                  │
 * │      id          string  Step ID                           │
 * │      name        string  Step name                         │
 * │      type        string  "research" | "ai_call" |          │
 * │                        "api_call" | "persist"             │
 * │      status      string  "pending" | "running" |           │
 * │                        "completed" | "failed" | "skipped"   │
 * │      input       object  Step input parameters             │
 * │      output      object  Step output / result              │
 * │      error       string  Error message if failed           │
 * │      startedAt   string  ISO 8601 timestamp                │
 * │      completedAt string  ISO 8601 timestamp                │
 * │      durationMs  number  Duration in milliseconds         │
 * │      createdAt   string  ISO 8601 timestamp                │
 * │                                                             │
 * │  INDEXES:                                                   │
 * │    • userId + createdAt (desc)  → automation history       │
 * │    • userId + status (asc)      → filter by status         │
 * │    • userId + moduleId (asc)    → filter by module         │
 * └─────────────────────────────────────────────────────────────┘
 *
 * ┌─────────────────────────────────────────────────────────────┐
 * │  4b. workflows                                             │
 * ├─────────────────────────────────────────────────────────────┤
 * │  Document ID: Auto-generated Firestore ID                   │
 * │  Description: Visual automation workflow definitions.      │
 * │                                                             │
 * │  FIELDS:                                                   │
 * │    id          string  Auto-generated document ID          │
 * │    userId       string  Owner Firebase Auth UID             │
 * │    name        string  Workflow name (max 200 chars)       │
 * │    description string  Workflow description                 │
 * │    steps       WorkflowStep[]  Ordered step definitions   │
 * │      id       string  Step document ID                     │
 * │      type     string  "trigger" | "action" |               │
 * │                      "condition" | "delay"                  │
 * │      name     string  Human-readable step name             │
 * │      config   object  Step configuration parameters       │
 * │      nextStepId string  Next step on success               │
 * │      branchTrue  string  Step ID for true branch           │
 * │      branchFalse string  Step ID for false branch          │
 * │    trigger     object  Trigger configuration              │
 * │      type     string  "new_order" | "low_stock" |          │
 * │                      "schedule" | "manual" | "webhook"     │
 * │      config   object  Trigger-specific config              │
 * │    isActive   boolean  Whether workflow is enabled         │
 * │    lastRunAt  string  ISO 8601 last execution             │
 * │    runCount   number  Total execution count               │
 * │    createdAt  string  ISO 8601 timestamp                  │
 * │    updatedAt  string  ISO 8601 timestamp                  │
 * │                                                             │
 * │  INDEXES:                                                   │
 * │    • userId + isActive (asc)  → active workflows           │
 * │    • userId + createdAt (desc) → workflow list             │
 * └─────────────────────────────────────────────────────────────┘
 *
 * ┌─────────────────────────────────────────────────────────────┐
 * │  4c. workflow_runs                                         │
 * ├─────────────────────────────────────────────────────────────┤
 * │  Document ID: Auto-generated Firestore ID                   │
 * │  Description: Workflow execution logs (denormalized for    │
 * │               efficient timestamp-based queries).          │
 * │                                                             │
 * │  FIELDS:                                                   │
 * │    id             string  Auto-generated document ID       │
 * │    workflowId     string  Parent workflow document ID      │
 * │    userId         string  Owner Firebase Auth UID          │
 * │    status         string  "running" | "completed" |        │
 * │                        "failed" | "cancelled"             │
 * │    startedAt      string  ISO 8601 execution start          │
 * │    completedAt    string  ISO 8601 execution end            │
 * │    stepsExecuted  number  Steps executed count             │
 * │    error          string  Error message if failed           │
 * │    logs           object[] Step execution entries           │
 * │      stepId    string  Executed step ID                    │
 * │      status    string  "started" | "completed" |            │
 * │                      "failed" | "skipped"                  │
 * │      message   string  Log message                         │
 * │      timestamp string  ISO 8601 timestamp                  │
 * │                                                             │
 * │  INDEXES:                                                   │
 * │    • workflowId + startedAt (desc) → run history per workflow│
 * │    • userId + startedAt (desc)    → all runs for user        │
 * └─────────────────────────────────────────────────────────────┘
 *
 * ================================================================
 * SECTION 5: TEAM MANAGEMENT
 * ================================================================
 *
 * ┌─────────────────────────────────────────────────────────────┐
 * │  5a. team_members                                          │
 * ├─────────────────────────────────────────────────────────────┤
 * │  Document ID: Auto-generated Firestore ID                   │
 * │  Description: Active team membership records.              │
 * │                                                             │
 * │  FIELDS:                                                   │
 * │    id           string  Auto-generated document ID          │
 * │    userId       string  Team owner Firebase Auth UID       │
 * │    email        string  Member email address               │
 * │    name         string  Member full name                   │
 * │    role         string  "owner" | "admin" | "editor" |     │
 * │                        "viewer"                           │
 * │    avatar       string  Member avatar URL                  │
 * │    invitedBy    string  UID of the inviting user          │
 * │    joinedAt     string  ISO 8601 join timestamp            │
 * │    lastActiveAt string  ISO 8601 last activity timestamp   │
 * │    isActive     boolean  Membership active flag            │
 * │                                                             │
 * │  INDEXES:                                                   │
 * │    • userId + role (asc)         → members by role          │
 * │    • userId + email (asc)        → member lookup             │
 * │    • userId + isActive (asc)    → active members           │
 * └─────────────────────────────────────────────────────────────┘
 *
 * ┌─────────────────────────────────────────────────────────────┐
 * │  5b. team_invitations                                      │
 * ├─────────────────────────────────────────────────────────────┤
 * │  Document ID: Auto-generated Firestore ID                   │
 * │  Description: Pending team invitations.                    │
 * │                                                             │
 * │  FIELDS:                                                   │
 * │    id         string  Auto-generated document ID          │
 * │    email      string  Invitee's email address             │
 * │    role       string  "admin" | "editor" | "viewer"        │
 * │    invitedBy  string  UID of the inviting user            │
 * │    invitedAt  string  ISO 8601 invitation timestamp       │
 * │    expiresAt  string  ISO 8601 expiration timestamp       │
 * │    status     string  "pending" | "accepted" |            │
 * │                        "declined" | "expired"              │
 * │                                                             │
 * │  INDEXES:                                                   │
 * │    • email + status (asc)         → invite lookup by email  │
 * │    • invitedBy + status (asc)   → pending by inviter       │
 * └─────────────────────────────────────────────────────────────┘
 *
 * ================================================================
 * SECTION 6: SETTINGS & CONFIG
 * ================================================================
 *
 * ┌─────────────────────────────────────────────────────────────┐
 * │  6a. settings                                              │
 * ├─────────────────────────────────────────────────────────────┤
 * │  Document ID: Firebase Auth UID                            │
 * │  Description: Per-user app preferences, (denormalized      │
 * │               from users/ for fast serverless reads).      │
 * │                                                             │
 * │  FIELDS:                                                   │
 * │    id             string  Firebase Auth UID                │
 * │    userId          string  Same as document ID              │
 * │    notifications  object  Notification channel settings    │
 * │      email             boolean  Email notifications        │
 * │      inApp            boolean  In-app notifications       │
 * │      slack            boolean  Slack notifications         │
 * │      slackWebhook     string  Slack webhook URL           │
 * │      orderUpdates    boolean  Order status change alerts  │
 * │      productUpdates  boolean  Product change alerts        │
 * │      automationAlerts boolean  Automation event alerts   │
 * │      weeklyDigest    boolean  Weekly summary email        │
 * │    automation     object  Automation preferences          │
 * │      scheduledScans   boolean  Enable scheduled scans     │
 * │      scanFrequency   string  "daily" | "weekly" | "monthly"│
 * │      frequency       string  Alias for scanFrequency       │
 * │      scanQuery      string  Default research query        │
 * │      defaultQuery   string  Default research query         │
 * │      autoFulfillOrders boolean  Auto-fulfill orders       │
 * │      autoSyncTracking boolean  Auto-sync tracking         │
 * │      lastScanAt      string  ISO 8601 last scan           │
 * │      lastRunAt       string  ISO 8601 last run            │
 * │      nextScanAt      string  ISO 8601 next scheduled scan │
 * │      nextRunAt       string  ISO 8601 next scheduled run   │
 * │    storefront     object  Storefront platform config       │
 * │      platform   string  "shopify" | "woocommerce" |        │
 * │                      "custom"                             │
 * │      url       string  Storefront URL                     │
 * │      apiKey    string  API key (encrypted)                │
 * │      apiSecret string  API secret (encrypted)            │
 * │    defaults     object  Default values for new records     │
 * │      researchQuery  string  Default AI research query    │
 * │      profitMargin   number  Default profit margin %       │
 * │      currency       string  Default currency code        │
 * │      timezone       string  Default timezone             │
 * │    billing       object  Billing & subscription info       │
 * │      plan     string  "free" | "starter" | "professional" │ │
 * │                    "enterprise"                           │
 * │      startedAt string  ISO 8601 subscription start        │
 * │      renewsAt  string  ISO 8601 next renewal              │
 * │    createdAt    string  ISO 8601 timestamp                │
 * │    updatedAt    string  ISO 8601 timestamp                │
 * │                                                             │
 * │  INDEXES:                                                   │
 * │    (direct lookup by document ID = Firebase UID)           │
 * └─────────────────────────────────────────────────────────────┘
 *
 * ================================================================
 * SECTION 7: COMMUNICATIONS
 * ================================================================
 *
 * ┌─────────────────────────────────────────────────────────────┐
 * │  7a. notifications                                         │
 * ├─────────────────────────────────────────────────────────────┤
 * │  Document ID: Auto-generated Firestore ID                   │
 * │  Description: In-app notification feed per user.           │
 * │                                                             │
 * │  FIELDS:                                                   │
 * │    id         string  Auto-generated document ID           │
 * │    userId     string  Owner Firebase Auth UID             │
 * │    type       string  "order" | "product" | "automation" |  │
 * │                        "system" | "billing"               │
 * │    title      string  Notification title (max 200 chars)  │
 * │    message    string  Notification body (max 500 chars)   │
 * │    read       boolean  Read / dismissed flag              │
 * │    actionUrl  string  Deep-link action URL (optional)     │
 * │    createdAt  string  ISO 8601 notification timestamp    │
 * │                                                             │
 * │  INDEXES:                                                   │
 * │    • userId + createdAt (desc)  → notification feed         │
 * │    • userId + read + createdAt (asc + desc) → unread-first │
 * └─────────────────────────────────────────────────────────────┘
 *
 * ================================================================
 * SECTION 8: AI & CONTENT
 * ================================================================
 *
 * ┌─────────────────────────────────────────────────────────────┐
 * │  8a. prompt_templates                                       │
 * ├─────────────────────────────────────────────────────────────┤
 * │  Document ID: Auto-generated Firestore ID                   │
 * │  Description: Reusable AI prompt templates per module.    │
 * │                                                             │
 * │  FIELDS:                                                   │
 * │    id                  string  Auto-generated document ID   │
 * │    userId              string  Owner Firebase Auth UID     │
 * │    moduleId            string  Module identifier            │
 * │                        "product-research" | "suppliers" |  │
 * │                        "copywriting" | "orders" |          │
 * │                        "full-pipeline"                    │
 * │    name                string  Template name (max 100)     │
 * │    description         string  Template description        │
 * │    systemPrompt        string  System prompt (max 5000)    │
 * │    userPromptTemplate string  User template (max 5000)    │
 * │    temperature        number  AI temperature 0.0–2.0       │
 * │    variables          string[] Expected variable names     │
 * │    isDefault          boolean  Default template for module │
 * │    createdAt          string  ISO 8601 timestamp           │
 * │    updatedAt          string  ISO 8601 timestamp           │
 * │                                                             │
 * │  INDEXES:                                                   │
 * │    • userId + moduleId + updatedAt (desc) → templates list  │
 * └─────────────────────────────────────────────────────────────┘
 *
 * ================================================================
 * SECTION 9: INTEGRATIONS
 * ================================================================
 *
 * ┌─────────────────────────────────────────────────────────────┐
 * │  9a. webhooks                                              │
 * ├─────────────────────────────────────────────────────────────┤
 * │  Document ID: Auto-generated Firestore ID                   │
 * │  Description: Outbound webhook endpoint registrations.      │
 * │                                                             │
 * │  FIELDS:                                                   │
 * │    id               string  Auto-generated document ID     │
 * │    userId           string  Owner Firebase Auth UID       │
 * │    name             string  Webhook display name          │
 * │    url              string  Target webhook URL (max 2048) │
 * │    events           string[] Subscribed event types        │
 * │                        e.g. "order.created",               │
 * │                        "automation.completed"              │
 * │    secret           string  HMAC signing secret (encrypted)│
 * │    isActive         boolean  Webhook enabled flag          │
 * │    headers          object  Custom HTTP headers           │
 * │    failureCount     number  Consecutive failed deliveries  │
 * │    lastTriggeredAt  string  ISO 8601 last successful call  │
 * │    createdAt        string  ISO 8601 timestamp            │
 * │    updatedAt        string  ISO 8601 timestamp            │
 * │                                                             │
 * │  INDEXES:                                                   │
 * │    • userId + isActive (asc) → active webhooks list        │
 * └─────────────────────────────────────────────────────────────┘
 *
 * ┌─────────────────────────────────────────────────────────────┐
 * │  9b. webhook_deliveries                                     │
 * ├─────────────────────────────────────────────────────────────┤
 * │  Document ID: Auto-generated Firestore ID                   │
 * │  Description: Individual webhook delivery attempt logs.    │
 * │                                                             │
 * │  FIELDS:                                                   │
 * │    id              string  Auto-generated document ID      │
 * │    webhookId       string  Parent webhook document ID      │
 * │    userId          string  Owner Firebase Auth UID        │
 * │    event           string  Event type delivered           │
 * │    payload         object  Request body sent               │
 * │    responseStatus  number  HTTP response status code      │
 * │    responseBody   string  Response body (truncated)       │
 * │    deliveredAt   string  ISO 8601 delivery timestamp     │
 * │    retryCount     number  Retry attempts count           │
 * │    nextRetryAt     string  ISO 8601 next retry timestamp  │
 * │    error           string  Error message if failed        │
 * │                                                             │
 * │  INDEXES:                                                   │
 * │    • webhookId + deliveredAt (desc) → delivery history     │
 * │    • userId + deliveredAt (desc)    → all deliveries      │
 * └─────────────────────────────────────────────────────────────┘
 *
 * ============================================================
 * SECTION 10: AUDIT & ANALYTICS
 * ============================================================
 *
 * ┌─────────────────────────────────────────────────────────────┐
 * │ 10a. audit_logs                                            │
 * ├─────────────────────────────────────────────────────────────┤
 * │  Document ID: Auto-generated Firestore ID                   │
 * │  Description: Immutable activity log for compliance and    │
 * │               team accountability. Write-once, no updates. │
 * │                                                             │
 * │  FIELDS:                                                   │
 * │    id          string  Auto-generated document ID           │
 * │    userId      string  Actor Firebase Auth UID              │
 * │    action      string  Action performed                     │
 * │                        e.g. "automation.run",              │
 * │                        "order.publish"                    │
 * │    resource    string  Resource type acted upon            │
 * │    entityType  string  Entity type (e.g. "automation")     │
 * │    entityId    string  Document ID of affected entity      │
 * │    detail      string  Description of what happened        │
 * │    metadata    object  Additional structured action data  │
 * │    ipAddress   string  Request origin IP (optional)       │
 * │    userAgent   string  Browser/client user agent (optional)│
 * │    createdAt   string  ISO 8601 timestamp                  │
 * │                                                             │
 * │  INDEXES:                                                   │
 * │    • userId + createdAt (desc)  → activity feed             │
 * │    • entityType + entityId     → entity history lookup     │
 * │    • action + createdAt (desc)  → filter by action type    │
 * └─────────────────────────────────────────────────────────────┘
 *
 * ┌─────────────────────────────────────────────────────────────┐
 * │ 10b. analytics                                             │
 * ├─────────────────────────────────────────────────────────────┤
 * │  Document ID: "{userId}_{date}"  e.g. "uid123_2026-05-26"   │
 * │  Description: Daily aggregated statistics per user.        │
 * │               Written once per day by a scheduled CRON.    │
 * │                                                             │
 * │  FIELDS:                                                   │
 * │    id                  string  Document ID (userId_date)   │
 * │    userId              string  Owner Firebase Auth UID     │
 * │    date                string  ISO date (YYYY-MM-DD)        │
 * │    ordersCount         number  New orders that day          │
 * │    ordersRevenue      number  Revenue from orders (USD)    │
 * │    productsListed     number  Products listed that day     │
 * │    productsResearched number  Products researched that day │
 * │    topProducts        object[] Top performing products     │
 * │      productId     string  Linked product ID              │
 * │      name          string  Product name                    │
 * │      salesCount    number  Units sold                      │
 * │      revenue       number  Revenue from this product       │
 * │    supplierPerformance object[] Supplier metrics            │
 * │      supplier     string  Supplier name                    │
 * │      ordersCount  number  Orders sourced this supplier      │
 * │      onTimeRate   number  On-time delivery %               │
 * │      defectRate   number  Defect / damage %                │
 * │    automationRuns    number  Automations run that day       │
 * │    successRate       number  Success rate 0–100            │
 * │    createdAt          string  ISO 8601 timestamp            │
 * │    updatedAt         string  ISO 8601 timestamp            │
 * │                                                             │
 * │  INDEXES:                                                   │
 * │    • userId + date (asc)    → single day lookup            │
 * │    • userId + date (desc)   → date range (descending)      │
 * └─────────────────────────────────────────────────────────────┘
 *
 * ============================================================
 * SECTION 11: BILLING
 * ============================================================
 *
 * ┌─────────────────────────────────────────────────────────────┐
 * │ 11a. billing_usage                                         │
 * ├─────────────────────────────────────────────────────────────┤
 * │  Document ID: "{userId}_{period}"                           │
 * │  Example: "uid123_monthly_2026-05"                          │
 * │  Description: Monthly/yearly usage metering for billing.   │
 * │                                                             │
 * │  FIELDS:                                                   │
 * │    id                  string  Document ID                 │
 * │    userId              string  Owner Firebase Auth UID     │
 * │    period              string  "monthly" | "yearly"        │
 * │    startDate           string  ISO 8601 period start        │
 * │    endDate             string  ISO 8601 period end           │
 * │    automationsRun      number  Automations this period     │
 * │    productsResearched  number  Products researched         │
 * │    ordersProcessed     number  Orders processed           │
 * │    notificationsSent   number  Notifications sent          │
 * │    apiCalls            number  External API calls          │
 * │    storageGb           number  Approx. storage used (GB)   │
 * │    createdAt           string  ISO 8601 timestamp           │
 * │    updatedAt           string  ISO 8601 timestamp           │
 * │                                                             │
 * │  INDEXES:                                                   │
 * │    • userId + period (asc) → period lookup                 │
 * └─────────────────────────────────────────────────────────────┘
 *
 * ┌─────────────────────────────────────────────────────────────┐
 * │ 11b. subscriptions                                         │
 * ├─────────────────────────────────────────────────────────────┤
 * │  Document ID: Auto-generated Firestore ID                   │
 * │  Description: Subscription plan records per user.        │
 * │                                                             │
 * │  FIELDS:                                                   │
 * │    id                   string  Auto-generated document ID │
 * │    userId               string  Owner Firebase Auth UID    │
 * │    plan                 string  "free" | "starter" |       │
 * │                         "professional" | "enterprise"      │
 * │    status               string  "active" | "cancelled" |   │
 * │                         "past_due" | "trialing"           │
 * │    startedAt            string  ISO 8601 subscription start│
 * │    renewsAt             string  ISO 8601 renewal date      │
 * │    cancelledAt          string  ISO 8601 cancellation date  │
 * │    billingCycle         string  "monthly" | "yearly"       │
 * │    price                number  Plan price in cents         │
 * │    currency             string  Currency code (e.g. "USD") │
 * │    subscriptionId       string  External payment sub ID      │
 * │    createdAt            string  ISO 8601 timestamp          │
 * │    updatedAt            string  ISO 8601 timestamp          │
 * │                                                             │
 * │  INDEXES:                                                   │
 * │    • userId + status (asc) → active subscriptions          │
 * └─────────────────────────────────────────────────────────────┘
 *
 * ============================================================
 * FIRESTORE COMPOSITE INDEXES (deploy to Firebase)
 * ============================================================
 *
 * The following composite indexes should be created in your
 * Firebase Console (or via firebase.json) for optimal queries:
 *
 * COLLECTION      | FIELDS                              | PURPOSE
 * ---------------------------------------------------------------
 * products        | userId ASC, createdAt DESC          | Product feed
 * products        | userId ASC, status ASC              | Status filter
 * products        | userId ASC, score DESC              | Sort by score
 * products        | userId ASC, niche ASC               | Niche filter
 * products        | userId ASC, source ASC              | Source filter
 * suppliers       | userId ASC, isActive ASC            | Active list
 * suppliers       | userId ASC, platform ASC            | Platform filter
 * orders          | userId ASC, createdAt DESC          | Order feed
 * orders          | userId ASC, status ASC             | Status filter
 * orders          | userId ASC, orderNumber ASC         | Order lookup
 * automations     | userId ASC, createdAt DESC         | History feed
 * automations     | userId ASC, status ASC             | Status filter
 * automations     | userId ASC, moduleId ASC           | Module filter
 * workflows       | userId ASC, isActive ASC           | Active list
 * workflows       | userId ASC, createdAt DESC         | Workflow list
 * workflow_runs   | workflowId ASC, startedAt DESC     | Run history
 * workflow_runs   | userId ASC, startedAt DESC        | All runs
 * team_members    | userId ASC, role ASC              | Role filter
 * team_members    | userId ASC, email ASC             | Member lookup
 * team_members    | userId ASC, isActive ASC          | Active filter
 * team_invitations| email ASC, status ASC             | Invite lookup
 * team_invitations| invitedBy ASC, status ASC         | Pending by inviter
 * notifications   | userId ASC, createdAt DESC        | Notification feed
 * notifications   | userId ASC, read ASC, createdAt DESC | Unread-first
 * prompt_templates| userId ASC, moduleId ASC, updatedAt DESC | Templates
 * webhooks        | userId ASC, isActive ASC          | Active webhooks
 * webhook_deliveries| webhookId ASC, deliveredAt DESC  | Delivery history
 * webhook_deliveries| userId ASC, deliveredAt DESC    | All deliveries
 * audit_logs      | userId ASC, createdAt DESC        | Activity feed
 * audit_logs      | entityType ASC, entityId ASC      | Entity history
 * audit_logs      | action ASC, createdAt DESC        | Action filter
 * analytics       | userId ASC, date ASC              | Day lookup
 * analytics       | userId ASC, date DESC            | Range desc
 * billing_usage    | userId ASC, period ASC           | Period lookup
 * subscriptions   | userId ASC, status ASC           | Active sub lookup
 *
 * ============================================================
 * DATABASE DESIGN PRINCIPLES APPLIED
 * ============================================================
 *
 * 1. FLAT over NESTED: Top-level collections are preferred over
 *    deep sub-collections for simpler queries and lower cost.
 *
 * 2. USER-ISOLATION: Every collection includes userId as the
 *    first index field, ensuring strict data isolation between
 *    users (verified by firestore.rules).
 *
 * 3. DENORMALIZATION FOR SPEED: Frequently co-read documents
 *    (e.g. user settings) are written denormally to avoid deep
 *    sub-collection reads in serverless functions.
 *
 * 4. COMPOSITE DOC IDs: Analytics and billing_usage use
 *    composite IDs (userId_date / userId_period) to make
 *    single-doc reads for date/period ranges trivial.
 *
 * 5. IMMUTABLE AUDIT: audit_logs block all updates and deletes,
 *    ensuring audit trail integrity for compliance.
 *
 * 6. TIMELINE SUB-COLLECTIONS: Orders and automations have
 *    timeline sub-collections for rich event sourcing without
 *    bloating the parent document.
 *
 * 7. STEP SUB-COLLECTIONS: Automations store detailed step
 *    execution records in a dedicated sub-collection to keep
 *    the parent automation document lightweight.
 *
 * 8. API KEYS ENCRYPTED: All api_key fields are AES-encrypted
 *    before Firestore writes and decrypted on reads by the
 *    server-side Admin SDK only.
 *
 * 9. TYPESCRIPT ALIGNMENT: Every collection listed here maps
 *    1:1 to an interface in src/lib/database/types.ts so the
 *    operations.ts layer is always in sync.
 *
 * 10. SECURITY BY DEFAULT: All rules follow least-privilege —
 *     authenticated users can ONLY read/write their own documents.
 */
