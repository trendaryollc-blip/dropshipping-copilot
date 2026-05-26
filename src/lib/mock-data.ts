export const mockAnalytics = {
  summary: {
    revenue: 18420,
    orders: 312,
    averageOrderValue: 59.04,
    conversionRate: 3.8,
    automationSuccessRate: 96,
  },
  topProducts: [
    { name: "Smart Flame Air Humidifier", sales: 86, revenue: 2579.14 },
    { name: "Portable Neck Fan", sales: 64, revenue: 1279.36 },
    { name: "Pet Hair Remover Roller", sales: 51, revenue: 764.49 },
  ],
  suppliers: [
    { supplier: "Zendrop", orders: 120, onTimeRate: 94, defectRate: 1.2 },
    { supplier: "AliExpress", orders: 88, onTimeRate: 87, defectRate: 2.8 },
    { supplier: "CJ", orders: 104, onTimeRate: 91, defectRate: 1.9 },
  ],
  daily: [
    { date: "Mon", revenue: 2100, orders: 35 },
    { date: "Tue", revenue: 2600, orders: 42 },
    { date: "Wed", revenue: 2300, orders: 39 },
    { date: "Thu", revenue: 3100, orders: 51 },
    { date: "Fri", revenue: 4200, orders: 68 },
    { date: "Sat", revenue: 2500, orders: 44 },
    { date: "Sun", revenue: 1620, orders: 33 },
  ],
};

export const mockNotifications = [
  { id: "notif-1", type: "order", title: "Order needs attention", message: "Order #TR-1042 has a supplier delay exception.", read: false, createdAt: new Date().toISOString(), actionUrl: "/orders" },
  { id: "notif-2", type: "product", title: "New winning product found", message: "Smart Flame Air Humidifier scored 92/100 in the wellness niche.", read: false, createdAt: new Date(Date.now() - 3600000).toISOString(), actionUrl: "/products" },
  { id: "notif-3", type: "automation", title: "Weekly scan completed", message: "Your scheduled research scan added 4 products to the library.", read: true, createdAt: new Date(Date.now() - 86400000).toISOString(), actionUrl: "/history" },
];

export const mockOrders = [
  {
    id: "order-1",
    userId: "demo-user",
    orderNumber: "TR-1042",
    status: "processing",
    customer: { name: "Alex Carter", email: "alex@example.com", shippingAddress: { street: "123 Market St", city: "Austin", state: "TX", zip: "78701", country: "US" } },
    items: [{ id: "item-1", productId: "mock-prod-3", productName: "Smart Flame Air Humidifier", quantity: 2, unitPrice: 29.99, supplier: "zendrop" }],
    totals: { subtotal: 59.98, shipping: 4.99, tax: 3.9, total: 68.87 },
    supplierOrders: [{ supplier: "zendrop", supplierOrderId: "ZD-MOCK-9001", status: "confirmed", items: [], trackingNumber: "ZD123456789", trackingUrl: "https://tracking.example/ZD123456789", createdAt: new Date().toISOString() }],
    trackingNumbers: [{ carrier: "Placeholder Express", trackingNumber: "ZD123456789", trackingUrl: "https://tracking.example/ZD123456789", status: "in_transit", estimatedDelivery: "3 days", history: [] }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "order-2",
    userId: "demo-user",
    orderNumber: "TR-1041",
    status: "refund_requested",
    customer: { name: "Maya Lee", email: "maya@example.com", shippingAddress: { street: "88 River Rd", city: "Portland", state: "OR", zip: "97201", country: "US" } },
    items: [{ id: "item-2", productId: "mock-prod-2", productName: "Pet Hair Remover Roller", quantity: 1, unitPrice: 14.99, supplier: "aliexpress" }],
    totals: { subtotal: 14.99, shipping: 3.99, tax: 1.1, total: 20.08 },
    refundReason: "Customer requested return before shipment.",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
  },
];

export const mockTeamMembers = [
  { id: "member-1", userId: "demo-user", name: "Store Owner", email: "owner@example.com", role: "owner", invitedBy: "system", joinedAt: new Date().toISOString(), lastActiveAt: new Date().toISOString() },
  { id: "member-2", userId: "demo-user", name: "Fulfillment VA", email: "fulfillment@example.com", role: "editor", invitedBy: "demo-user", joinedAt: new Date(Date.now() - 604800000).toISOString(), lastActiveAt: new Date(Date.now() - 7200000).toISOString() },
];

export const mockWorkflows = [
  { id: "workflow-1", name: "Auto fulfill clean orders", description: "When a paid order arrives, split by supplier and create supplier orders.", trigger: "new_order", isActive: true, runCount: 128 },
  { id: "workflow-2", name: "Low stock supplier check", description: "Find backup suppliers when inventory drops below threshold.", trigger: "low_stock", isActive: true, runCount: 42 },
  { id: "workflow-3", name: "Weekly product digest", description: "Run product research and email a summary every Monday.", trigger: "schedule", isActive: false, runCount: 11 },
];

export const mockWebhooks = [
  { id: "webhook-1", name: "Order events to Zapier", url: "https://hooks.zapier.com/hooks/catch/placeholder", events: ["order.created", "order.shipped"], isActive: true, failureCount: 0, lastTriggeredAt: new Date().toISOString() },
  { id: "webhook-2", name: "Product alerts", url: "https://example.com/webhooks/products", events: ["product.added"], isActive: false, failureCount: 1, lastTriggeredAt: new Date(Date.now() - 86400000).toISOString() },
];

export const mockBilling = {
  plan: "professional",
  usage: { automationsRun: 312, productsResearched: 740, ordersProcessed: 156, notificationsSent: 89, apiCalls: 4220, storageGb: 1.8 },
  limits: { automations: 1000, products: 5000, orders: 1000, teamMembers: 10, apiCalls: 10000 },
};
