import type {
  Product,
  Supplier,
  Order,
  ActivityItem,
  DashboardStats,
  LearnArticle,
  Store,
} from "@/types"

export const dashboardStats: DashboardStats = {
  productsImported: 24,
  suppliersConnected: 8,
  ordersPending: 3,
  monthlyRevenue: 1240,
  revenueChange: 18,
  ordersChange: 5,
  suppliersChange: 2,
  productsChange: 6,
}

export const recentActivity: ActivityItem[] = [
  { id: "1", type: "import", message: 'Imported "Wireless Earbuds Pro" to My Products', time: "2 min ago" },
  { id: "2", type: "order", message: "New order #ORD-1042 received from Sarah M.", time: "15 min ago" },
  { id: "3", type: "supplier", message: 'Added "TechSupply Co" as a trusted supplier', time: "1 hr ago" },
  { id: "4", type: "description", message: 'Generated description for "Minimalist Watch Band"', time: "2 hrs ago" },
  { id: "5", type: "order", message: "Order #ORD-1038 marked as Shipped", time: "3 hrs ago" },
]

export const products: Product[] = [
  { id: "1", name: "Wireless Earbuds Pro", image: "https://picsum.photos/seed/earbuds/400/300", niche: "Electronics", priceRange: { min: 15, max: 45 }, competition: "low", trendScore: 87, supplierName: "TechSupply Co", status: "active", trendaryoUrl: "/products/wireless-earbuds-pro", price: 2499, currency: "INR", priceLastUpdated: "2026-05-18T04:00:00Z", importedAt: "2024-01-10", views: 1240 },
  { id: "2", name: "Minimalist Watch Band", image: "https://picsum.photos/seed/watch/400/300", niche: "Fashion", priceRange: { min: 5, max: 18 }, competition: "medium", trendScore: 72, supplierName: "FashionHub", status: "active", importedAt: "2024-01-12", views: 870 },
  { id: "3", name: "Portable LED Desk Lamp", image: "https://picsum.photos/seed/lamp/400/300", niche: "Home & Garden", priceRange: { min: 12, max: 35 }, competition: "low", trendScore: 91, supplierName: "HomeGoods Direct", status: "draft", importedAt: "2024-01-08", views: 630 },
  { id: "4", name: "Bamboo Cutting Board Set", image: "https://picsum.photos/seed/bamboo/400/300", niche: "Home & Garden", priceRange: { min: 8, max: 25 }, competition: "medium", trendScore: 65, supplierName: "EcoSupply", status: "active", trendaryoUrl: "/products/bamboo-cutting-board-set", price: 699, currency: "INR", priceLastUpdated: "2026-05-18T04:00:00Z", importedAt: "2024-01-08", views: 450 },
  { id: "5", name: "Facial Roller Massager", image: "https://picsum.photos/seed/roller/400/300", niche: "Beauty", priceRange: { min: 6, max: 20 }, competition: "high", trendScore: 78, supplierName: "BeautyPro", status: "active", trendaryoUrl: "/products/facial-roller-massager", price: 599, currency: "INR", priceLastUpdated: "2026-05-18T04:00:00Z", importedAt: "2024-01-15", views: 2100 },
  { id: "6", name: "Resistance Band Set", image: "https://picsum.photos/seed/bands/400/300", niche: "Sports", priceRange: { min: 10, max: 30 }, competition: "low", trendScore: 83, supplierName: "FitGear Supply", status: "draft", importedAt: "2024-01-10", views: 380 },
  { id: "7", name: "Phone Grip Stand", image: "https://picsum.photos/seed/phonegrip/400/300", niche: "Electronics", priceRange: { min: 3, max: 12 }, competition: "high", trendScore: 55, supplierName: "TechSupply Co", status: "archived", importedAt: "2024-01-07", views: 980 },
  { id: "8", name: "Reusable Water Bottle", image: "https://picsum.photos/seed/bottle/400/300", niche: "Sports", priceRange: { min: 8, max: 22 }, competition: "medium", trendScore: 70, supplierName: "EcoSupply", status: "active", trendaryoUrl: "/products/reusable-water-bottle", price: 499, currency: "INR", priceLastUpdated: "2026-05-18T04:00:00Z", importedAt: "2024-01-09", views: 760 },
  { id: "9", name: "Candle Making Kit", image: "https://picsum.photos/seed/candle/400/300", niche: "Home & Garden", priceRange: { min: 18, max: 40 }, competition: "low", trendScore: 80, supplierName: "HomeGoods Direct", status: "active", importedAt: "2024-01-11", views: 510 },
  { id: "10", name: "Magnetic Phone Wallet", image: "https://picsum.photos/seed/wallet/400/300", niche: "Fashion", priceRange: { min: 4, max: 15 }, competition: "medium", trendScore: 68, supplierName: "FashionHub", status: "draft", importedAt: "2024-01-10", views: 340 },
  { id: "11", name: "Essential Oil Diffuser", image: "https://picsum.photos/seed/diffuser/400/300", niche: "Beauty", priceRange: { min: 14, max: 38 }, competition: "medium", trendScore: 75, supplierName: "BeautyPro", status: "active", trendaryoUrl: "/products/essential-oil-diffuser", price: 899, currency: "INR", priceLastUpdated: "2026-05-18T04:00:00Z", importedAt: "2024-01-13", views: 890 },
  { id: "12", name: "Foldable Travel Bag", image: "https://picsum.photos/seed/bag/400/300", niche: "Fashion", priceRange: { min: 10, max: 28 }, competition: "low", trendScore: 88, supplierName: "FashionHub", status: "active", trendaryoUrl: "/products/foldable-travel-bag", price: 1299, currency: "INR", priceLastUpdated: "2026-05-18T04:00:00Z", importedAt: "2024-01-14", views: 1450 },
]

export const suppliers: Supplier[] = [
  { id: "1", name: "TechSupply Co", avatar: "https://i.pravatar.cc/80?u=techsupply", categories: ["Electronics", "Gadgets"], trustScore: 4.8, responseTime: "< 2 hrs", country: "China", totalProducts: 2400, verified: true, minOrder: 1 },
  { id: "2", name: "FashionHub", avatar: "https://i.pravatar.cc/80?u=fashionhub", categories: ["Fashion", "Accessories"], trustScore: 4.5, responseTime: "< 4 hrs", country: "Turkey", totalProducts: 1800, verified: true, minOrder: 5 },
  { id: "3", name: "HomeGoods Direct", avatar: "https://i.pravatar.cc/80?u=homegoods", categories: ["Home & Garden", "Kitchen"], trustScore: 4.7, responseTime: "< 6 hrs", country: "China", totalProducts: 3200, verified: true, minOrder: 1 },
  { id: "4", name: "BeautyPro", avatar: "https://i.pravatar.cc/80?u=beautypro", categories: ["Beauty", "Skincare"], trustScore: 4.6, responseTime: "< 3 hrs", country: "South Korea", totalProducts: 950, verified: true, minOrder: 3 },
  { id: "5", name: "FitGear Supply", avatar: "https://i.pravatar.cc/80?u=fitgear", categories: ["Sports", "Fitness"], trustScore: 4.4, responseTime: "< 8 hrs", country: "USA", totalProducts: 680, verified: false, minOrder: 1 },
  { id: "6", name: "EcoSupply", avatar: "https://i.pravatar.cc/80?u=ecosupply", categories: ["Home & Garden", "Sports", "Eco"], trustScore: 4.9, responseTime: "< 2 hrs", country: "Germany", totalProducts: 420, verified: true, minOrder: 2 },
  { id: "7", name: "GadgetWorld", avatar: "https://i.pravatar.cc/80?u=gadgetworld", categories: ["Electronics", "Toys"], trustScore: 4.2, responseTime: "< 12 hrs", country: "China", totalProducts: 5600, verified: false, minOrder: 1 },
  { id: "8", name: "PetLove Supplies", avatar: "https://i.pravatar.cc/80?u=petlove", categories: ["Pet Supplies"], trustScore: 4.7, responseTime: "< 5 hrs", country: "USA", totalProducts: 320, verified: true, minOrder: 2 },
]

export const orders: Order[] = [
  { id: "ORD-1042", productName: "Wireless Earbuds Pro", productImage: "https://picsum.photos/seed/earbuds/60/60", customer: "Sarah Mitchell", status: "pending", orderDate: "2024-01-15", estimatedDelivery: "2024-01-25", total: 38.99, quantity: 1 },
  { id: "ORD-1041", productName: "Foldable Travel Bag", productImage: "https://picsum.photos/seed/bag/60/60", customer: "James Cooper", status: "processing", orderDate: "2024-01-14", estimatedDelivery: "2024-01-24", trackingNumber: "CN123456789", total: 24.99, quantity: 2 },
  { id: "ORD-1040", productName: "Bamboo Cutting Board Set", productImage: "https://picsum.photos/seed/bamboo/60/60", customer: "Emily Chen", status: "shipped", orderDate: "2024-01-13", estimatedDelivery: "2024-01-22", trackingNumber: "YT987654321", total: 19.99, quantity: 1 },
  { id: "ORD-1039", productName: "Facial Roller Massager", productImage: "https://picsum.photos/seed/roller/60/60", customer: "Aisha Khan", status: "shipped", orderDate: "2024-01-12", estimatedDelivery: "2024-01-21", trackingNumber: "SF456789123", total: 16.99, quantity: 1 },
  { id: "ORD-1038", productName: "Resistance Band Set", productImage: "https://picsum.photos/seed/bands/60/60", customer: "Luca Romano", status: "delivered", orderDate: "2024-01-08", estimatedDelivery: "2024-01-18", trackingNumber: "DHL789123456", total: 27.99, quantity: 1 },
  { id: "ORD-1037", productName: "Essential Oil Diffuser", productImage: "https://picsum.photos/seed/diffuser/60/60", customer: "Priya Sharma", status: "delivered", orderDate: "2024-01-07", estimatedDelivery: "2024-01-17", trackingNumber: "UPS321654987", total: 31.99, quantity: 1 },
  { id: "ORD-1036", productName: "Candle Making Kit", productImage: "https://picsum.photos/seed/candle/60/60", customer: "Noah Williams", status: "cancelled", orderDate: "2024-01-06", estimatedDelivery: "2024-01-16", total: 35.99, quantity: 1 },
]

export const learnArticles: LearnArticle[] = [
  {
    id: "1", category: "Getting Started",
    title: "What is Dropshipping? A Complete Beginner's Guide",
    summary: "Understand the business model, how it works, and whether it's right for you.",
    readTime: "5 min read",
    content: "Dropshipping is a retail fulfillment method where you don't keep products in stock. When you make a sale, you purchase the item from a third party and have it shipped directly to your customer...",
  },
  {
    id: "2", category: "Getting Started",
    title: "Setting Up Your First Online Store",
    summary: "Step-by-step instructions for launching your dropshipping store from scratch.",
    readTime: "8 min read",
    content: "Choosing the right platform is the first step. Shopify, WooCommerce, and BigCommerce are popular options for dropshippers...",
  },
  {
    id: "3", category: "Product Research",
    title: "How to Find Winning Products in 2024",
    summary: "Proven strategies for identifying products with high demand and low competition.",
    readTime: "7 min read",
    content: "Winning products have three key traits: high demand, reasonable margins, and relatively low competition. Tools like Google Trends, TikTok, and Amazon can help you spot emerging trends...",
  },
  {
    id: "4", category: "Product Research",
    title: "Understanding Competition Levels",
    summary: "Learn how to analyze market saturation and find your niche.",
    readTime: "4 min read",
    content: "Competition level refers to how many other sellers are selling the same or similar product. A low competition product means fewer sellers, which makes it easier for you to rank and get sales...",
  },
  {
    id: "5", category: "Supplier Tips",
    title: "How to Evaluate a Supplier's Reliability",
    summary: "Key factors to look for when choosing suppliers for your business.",
    readTime: "6 min read",
    content: "A reliable supplier is the backbone of your dropshipping business. Look for fast response times, positive reviews, sample policy, and clear communication...",
  },
  {
    id: "6", category: "Supplier Tips",
    title: "AliExpress vs Private Suppliers: What's Better?",
    summary: "Compare the pros and cons of using AliExpress versus working directly with suppliers.",
    readTime: "5 min read",
    content: "AliExpress is great for beginners because of its low minimum order quantities and huge product selection. However, private suppliers can offer better pricing and branding once you scale...",
  },
  {
    id: "7", category: "Marketing",
    title: "Beginner's Guide to Facebook Ads for Dropshipping",
    summary: "Learn how to run your first profitable Facebook ad campaign with a small budget.",
    readTime: "10 min read",
    content: "Facebook Ads remain one of the most powerful tools for dropshippers. Start with a small budget ($5-10/day) and test multiple ad creatives before scaling what works...",
  },
  {
    id: "8", category: "Scaling",
    title: "When and How to Scale Your Dropshipping Store",
    summary: "Signs that you're ready to scale, and the strategies to do it successfully.",
    readTime: "9 min read",
    content: "Scaling too early is one of the most common mistakes beginners make. Make sure you have consistent sales, a reliable supplier, and enough profit margin before scaling ad spend...",
  },
]

export const stores: Store[] = [
  {
    id: "1",
    name: "My Electronics Store",
    platform: "shopify",
    url: "https://myelectronics.myshopify.com",
    status: "active",
    connectedAt: "2024-01-05",
    productsCount: 12,
    ordersCount: 45,
  },
  {
    id: "2",
    name: "Fashion Finds",
    platform: "woocommerce",
    url: "https://fashionfinds.com",
    status: "active",
    connectedAt: "2024-01-08",
    productsCount: 8,
    ordersCount: 23,
  },
  {
    id: "3",
    name: "Home Decor Hub",
    platform: "shopify",
    url: "https://homedecorhub.myshopify.com",
    status: "inactive",
    connectedAt: "2024-01-10",
    productsCount: 5,
    ordersCount: 0,
  },
]
