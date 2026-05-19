# Trendaryo Database Structure (Live E-commerce Store)

Trendaryo is the customer-facing live store built from scratch. It uses its own Firebase project (separate from DropEase automation app) and Firestore for all data.

This schema is production-grade, scalable, and designed to integrate cleanly with the DropEase automation platform.

---

## 1. Collection Overview

| Collection          | Purpose                              | Primary Key     | Notes |
|---------------------|--------------------------------------|-----------------|-------|
| `users`             | Customer accounts                    | uid             | Firebase Auth users |
| `products`          | Master product catalog               | productId       | Core inventory |
| `categories`        | Product categories                   | categoryId      | Hierarchical support |
| `orders`            | Customer orders                      | orderId         | Main transactional data |
| `order_items`       | Line items (sub-collection)          | itemId          | Nested under orders |
| `reviews`           | Product & store reviews              | reviewId        | Customer feedback |
| `cart`              | Active shopping carts                | cartId          | Session-based or user-based |
| `payments`          | Payment transactions                 | paymentId       | Linked to orders |
| `coupons`           | Discount & promo codes               | code            | Marketing tools |
| `settings`          | Store configuration                  | key             | Global settings |
| `inventory_logs`    | Stock change history                 | logId           | Audit trail |
| `analytics_events`  | Tracking events (optional)           | eventId         | For reporting |

---

## 2. Document Schemas

### users/{uid}
```json
{
  "uid": "firebase_auth_uid",
  "email": "customer@example.com",
  "displayName": "John Doe",
  "phone": "+91-9876543210",
  "photoURL": "https://...",
  "addresses": [
    {
      "type": "shipping",
      "fullName": "John Doe",
      "line1": "123 Main St",
      "line2": "",
      "city": "Mumbai",
      "state": "MH",
      "pinCode": "400001",
      "country": "IN",
      "isDefault": true
    }
  ],
  "totalOrders": 12,
  "totalSpent": 18500,
  "createdAt": "2025-08-10T09:00:00Z",
  "updatedAt": "2026-05-18T06:00:00Z"
}
```

### products/{productId}
```json
{
  "productId": "PRD-FTB-001",
  "name": "Foldable Travel Bag",
  "slug": "foldable-travel-bag",
  "description": "Waterproof foldable duffel bag...",
  "shortDescription": "Compact travel essential",
  "price": 1299,
  "compareAtPrice": 1599,
  "currency": "INR",
  "stock": 150,
  "lowStockThreshold": 20,
  "images": [
    "https://cdn.trendaryo.com/products/ftb-001-1.jpg",
    "https://cdn.trendaryo.com/products/ftb-001-2.jpg"
  ],
  "categoryId": "CAT-FASHION",
  "tags": ["travel", "bags", "foldable"],
  "status": "active",                    // active | draft | archived | out_of_stock
  "visibility": "public",
  "seoTitle": "Foldable Travel Bag | Trendaryo",
  "seoDescription": "Shop the best foldable travel bag...",
  "seoKeywords": ["travel bag", "foldable"],
  "weight": 380,
  "dimensions": { "length": 52, "width": 32, "height": 20, "unit": "cm" },
  "automationLastSyncedAt": "2026-05-18T05:30:00Z",   // For DropEase integration
  "automationSource": "dropease",
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2026-05-18T06:00:00Z"
}
```

### categories/{categoryId}
```json
{
  "categoryId": "CAT-FASHION",
  "name": "Fashion & Accessories",
  "slug": "fashion-accessories",
  "description": "Trendy fashion and travel gear",
  "parentId": null,                      // For sub-categories
  "image": "https://cdn.trendaryo.com/categories/fashion.jpg",
  "productCount": 245,
  "sortOrder": 1,
  "isActive": true,
  "createdAt": "...",
  "updatedAt": "..."
}
```

### orders/{orderId}
```json
{
  "orderId": "ORD-10042",
  "userId": "firebase_auth_uid",
  "status": "processing",                // pending | processing | shipped | delivered | cancelled | refunded
  "paymentStatus": "paid",               // pending | paid | refunded
  "fulfillmentStatus": "awaiting_supplier",
  "currency": "INR",
  "subtotal": 2598,
  "tax": 0,
  "shippingCost": 0,
  "discount": 0,
  "total": 2598,
  "shippingAddress": { ... },
  "billingAddress": { ... },
  "tracking": {
    "provider": "Delhivery",
    "trackingNumber": "DL1234567890",
    "statusUrl": "https://..."
  },
  "notes": "Gift wrap requested",
  "automationSynced": true,
  "createdAt": "2026-05-15T14:30:00Z",
  "updatedAt": "2026-05-18T06:00:00Z"
}
```

### orders/{orderId}/items/{itemId} (sub-collection)
```json
{
  "itemId": "IT-001",
  "productId": "PRD-FTB-001",
  "productName": "Foldable Travel Bag",
  "variantId": "v2",
  "variantName": "Black",
  "sku": "FTB-001-BK",
  "quantity": 2,
  "unitPrice": 1299,
  "lineTotal": 2598,
  "currency": "INR"
}
```

### reviews/{reviewId}
```json
{
  "reviewId": "REV-2001",
  "productId": "PRD-FTB-001",
  "userId": "firebase_auth_uid",
  "rating": 4,
  "title": "Great quality",
  "body": "Received exactly as described...",
  "verifiedPurchase": true,
  "createdAt": "..."
}
```

### cart/{cartId}
```json
{
  "cartId": "CART-uuid-or-userId",
  "userId": "firebase_auth_uid",
  "items": [
    {
      "productId": "PRD-FTB-001",
      "quantity": 1,
      "addedAt": "..."
    }
  ],
  "updatedAt": "..."
}
```

### payments/{paymentId}
```json
{
  "paymentId": "PAY-001",
  "orderId": "ORD-10042",
  "userId": "firebase_auth_uid",
  "amount": 2598,
  "currency": "INR",
  "method": "razorpay",
  "status": "success",
  "gatewayReference": "pay_abc123",
  "createdAt": "..."
}
```

### coupons/{code}
```json
{
  "code": "SUMMER20",
  "type": "percentage",                  // percentage | fixed
  "value": 20,
  "minOrderAmount": 1000,
  "maxDiscount": 500,
  "usageLimit": 100,
  "usedCount": 47,
  "validFrom": "...",
  "validUntil": "...",
  "isActive": true
}
```

### settings/{key}
```json
{
  "key": "store",
  "value": {
    "name": "Trendaryo",
    "currency": "INR",
    "taxRate": 0,
    "freeShippingThreshold": 2000,
    "supportEmail": "support@trendaryo.com"
  }
}
```

---

## 3. Composite Indexes (firestore.indexes.json)

```json
{
  "indexes": [
    {
      "collectionGroup": "products",
      "fields": [
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "orders",
      "fields": [
        { "fieldPath": "userId", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "reviews",
      "fields": [
        { "fieldPath": "productId", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    }
  ]
}
```

---

## 4. Security Rules (Production)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Users can read/write their own profile
    match /users/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }

    // Public read for products & categories
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }

    match /categories/{categoryId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }

    // Orders – only owner or admin
    match /orders/{orderId} {
      allow read, write: if request.auth != null && 
        (resource.data.userId == request.auth.uid || request.auth.token.admin == true);
    }

    // Reviews – anyone can read, owner can write
    match /reviews/{reviewId} {
      allow read: if true;
      allow write: if request.auth != null && 
        (resource.data.userId == request.auth.uid || request.auth.token.admin == true);
    }

    // Admin-only collections
    match /coupons/{code} { allow write: if request.auth.token.admin == true; }
    match /settings/{key} { allow write: if request.auth.token.admin == true; }
    match /inventory_logs/{logId} { allow write: if request.auth.token.admin == true; }

    // Default deny
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

---

## 5. Integration with DropEase Automation App

Since Trendaryo and DropEase are in **different Firebase projects**, recommended integration patterns:

### Option A: REST API (Recommended)
- Expose secure endpoints in Trendaryo (e.g., `/api/products`, `/api/orders/sync`).
- DropEase calls these endpoints using API keys or JWT.

### Option B: Cross-Project Service Account
- Create a service account in Trendaryo project.
- Grant it read/write access to Trendaryo Firestore.
- DropEase uses this service account via Admin SDK.

### Recommended Sync Fields (already included)
- `automationLastSyncedAt`
- `automationSource: "dropease"`
- `automationSynced: true`

These fields allow DropEase to track which records have been processed.

---

## 6. Next Steps

1. Create a new Firebase project for Trendaryo (if not already done).
2. Run a migration script (similar to DropEase) to seed initial data.
3. Deploy the security rules above.
4. Set up Cloud Functions or API routes for DropEase integration.
5. Add the composite indexes via Firebase Console or `firebase deploy --only firestore:indexes`.

---

**This structure is now ready for production use and clean integration with your DropEase automation platform.**
