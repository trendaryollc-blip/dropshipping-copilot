# Firebase Database Structure

This document explains the Firestore database structure for the Dropship Autopilot application.

## Collections

### 1. `users`
Stores user account information.

```typescript
{
  id: string;              // Firebase Auth UID
  email: string;
  displayName?: string;
  photoURL?: string;
  provider: "email" | "google";
  createdAt: string;       // ISO timestamp
  updatedAt: string;       // ISO timestamp
  isActive: boolean;
}
```

### 2. `api_keys`
Stores API keys for third-party integrations. One document per user.

```typescript
{
  id: string;              // User ID (document ID)
  userId: string;
  trendaryo_api_url?: string;
  trendaryo_api_key?: string;
  openrouter_api_key?: string;
  openrouter_model?: string;
  cj_api_key?: string;
  zendrop_api_key?: string;
  aliexpress_app_key?: string;
  meta_api_key?: string;
  createdAt: string;
  updatedAt: string;
}
```

### 3. `automations`
Stores automation run history and results.

```typescript
{
  id: string;              // Auto-generated
  userId: string;
  moduleId: "product-research" | "suppliers" | "copywriting" | "orders" | "full-pipeline";
  status: "running" | "completed" | "failed";
  input: Record<string, unknown>;
  output: Record<string, unknown>;
  steps: AutomationStep[];
  message: string;
  startedAt: string;
  completedAt?: string;
  createdAt: string;
}
```

### 4. `products`
Stores product research results.

```typescript
{
  id: string;              // Auto-generated
  userId: string;
  name: string;
  niche?: string;
  trend?: string;
  estimatedMargin?: string;
  score?: number;          // 0-100
  whyItWins?: string;
  supplierId?: string;
  supplierName?: string;
  unitCost?: number;
  retailPrice?: number;
  images?: string[];
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}
```

### 5. `suppliers`
Stores supplier information.

```typescript
{
  id: string;              // Auto-generated
  userId: string;
  name: string;
  platform: "cj" | "zendrop" | "aliexpress" | "custom";
  apiCredentials?: {
    apiKey?: string;
    appId?: string;
    appSecret?: string;
  };
  rating?: number;
  shippingDays?: string;
  minOrderQuantity?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### 6. `orders`
Stores order fulfillment information.

```typescript
{
  id: string;              // Auto-generated
  userId: string;
  orderId: string;         // Store order ID
  customerEmail: string;
  customerName: string;
  items: OrderItem[];
  totalAmount: number;
  currency: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "failed";
  supplierOrderId?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  supplierId?: string;
  createdAt: string;
  updatedAt: string;
  shippedAt?: string;
  deliveredAt?: string;
}
```

### 7. `settings`
Stores user preferences and notification settings. One document per user.

```typescript
{
  id: string;              // User ID (document ID)
  userId: string;
  notifications: {
    email: boolean;
    slack: boolean;
    slackWebhook?: string;
  };
  automation: {
    autoFulfillOrders: boolean;
    autoSyncTracking: boolean;
    scheduledScans: boolean;
    scanFrequency: "daily" | "weekly" | "monthly";
  };
  preferences: {
    defaultCurrency: string;
    timezone: string;
  };
  createdAt: string;
  updatedAt: string;
}
```

## Security Notes

- All API keys are stored encrypted in Firestore
- User data is isolated by `userId` field
- Authentication is handled by Firebase Auth (email/password and Google)
- Server-side operations use Firebase Admin SDK with service account credentials

## Client Auth Setup

1. Firebase Console → **Authentication** → enable **Email/Password** and **Google**
2. **Authentication** → **Settings** → **Authorized domains** — ensure these exist:
   - `localhost` (for `http://localhost:3000`)
   - `127.0.0.1` (if you use that URL)
   - Your PC’s network IP (e.g. `192.168.x.x`) only if you open the app via that IP
   - Direct link: [Authorized domains](https://console.firebase.google.com/project/new-automation-app-7dd33/authentication/settings)
2. Firebase Console → **Project settings** → Your apps → add **Web app**
3. Copy web config into `.env.local` as `NEXT_PUBLIC_FIREBASE_*` (see `.env.example`)
4. Keep Admin SDK vars (`FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`) for server/session cookies

Users sign in at `/login` or `/register`. API keys and automations are scoped by Firebase UID.

## API Endpoints

### Authentication
- `POST /api/auth/session` - Create httpOnly session from Firebase ID token
- `DELETE /api/auth/session` - Sign out (clear cookie)
- `GET /api/auth/me` - Current user profile
- `POST /api/auth/register` - Server-side registration (optional; UI uses client SDK)
- `POST /api/auth/google` - Legacy Google token exchange (prefer `/api/auth/session`)

### Settings
- `GET /api/settings/api-keys` - Get user's API keys
- `POST /api/settings/api-keys` - Save user's API keys

### Database Operations
All database operations are available in `src/lib/database/operations.ts`:
- `createUser`, `getUser`, `getUserByEmail`
- `saveApiKeys`, `getApiKeys`
- `createAutomation`, `updateAutomation`, `getUserAutomations`
- `createProduct`, `getUserProducts`
- `createSupplier`, `getUserSuppliers`
- `createOrder`, `updateOrder`, `getUserOrders`
- `saveSettings`, `getSettings`
