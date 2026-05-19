# Environment Variables for DropEase Integrations

## Trendaryo Live Store Integration

Add these variables to your `.env.local` or `.env` file:

```env
# Trendaryo API Configuration
TRENDARYO_API_URL=https://your-trendaryo-site.vercel.app
TRENDARYO_API_KEY=your-strong-secret-key-here
```

### How to get the values:

1. **TRENDARYO_API_URL**
   - This is the base URL of your deployed Trendaryo site
   - Example: `https://trendaryo.vercel.app`

2. **TRENDARYO_API_KEY**
   - Must match the `DROPEASE_API_KEY` you set in Trendaryo's `.env` file
   - Use a strong random string (minimum 32 characters recommended)

---

## Usage Example

```typescript
import { createTrendaryoAPI } from '@/lib/integrations/trendaryo-api';

const trendaryo = createTrendaryoAPI();

// Get all products
const products = await trendaryo.getAllProducts();

// Update price and stock
await trendaryo.updateProduct('PRD-FTB-001', {
  price: 1199,
  stock: 140,
});

// Create a new order
await trendaryo.createOrder({
  userId: 'firebase_uid_here',
  items: [{ productId: 'PRD-FTB-001', quantity: 2, unitPrice: 1299 }],
  total: 2598,
  shippingAddress: { ... },
});
```
