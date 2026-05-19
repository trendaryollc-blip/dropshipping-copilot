# DropEase ↔ Trendaryo Integration Guide

This guide explains how to connect the **DropEase automation app** with the **Trendaryo live store** so they can sync products, prices, orders, and stock automatically.

Both projects are in **different Firebase projects** but the same Google account.

---

## Recommended Integration Method: REST API

The simplest and most secure way is to create a few API endpoints in Trendaryo that DropEase can call.

### Why REST API?
- Easy to secure with API keys
- Works across different Firebase projects
- No complex cross-project permissions needed
- You stay in control of what data is shared

---

## Step 1: Create API Endpoints in Trendaryo

Create a new file in Trendaryo project:

**Path:** `D:\web sites\trendaryo live site\api\automation-sync.js`

```javascript
// Simple API endpoints for DropEase automation

const express = require('express');
const admin = require('firebase-admin');
const router = express.Router();

// Middleware: Check API Key (simple security)
function checkApiKey(req, res, next) {
  const apiKey = req.headers['x-api-key'];
  if (apiKey === process.env.DROPEASE_API_KEY) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
}

// 1. Get all products (for price/stock sync)
router.get('/products', checkApiKey, async (req, res) => {
  try {
    const snapshot = await admin.firestore().collection('products').get();
    const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Update product price or stock
router.patch('/products/:id', checkApiKey, async (req, res) => {
  try {
    const { price, stock } = req.body;
    const updates = {};
    if (price !== undefined) updates.price = price;
    if (stock !== undefined) updates.stock = stock;
    updates.updatedAt = new Date().toISOString();

    await admin.firestore().collection('products').doc(req.params.id).update(updates);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Create new order from automation
router.post('/orders', checkApiKey, async (req, res) => {
  try {
    const orderData = req.body;
    const docRef = await admin.firestore().collection('orders').add({
      ...orderData,
      createdAt: new Date().toISOString(),
      status: 'pending'
    });
    res.json({ id: docRef.id, success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Update order status
router.patch('/orders/:id', checkApiKey, async (req, res) => {
  try {
    await admin.firestore().collection('orders').doc(req.params.id).update({
      status: req.body.status,
      updatedAt: new Date().toISOString()
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

---

## Step 2: Add API Key in Trendaryo

Add this in Trendaryo’s `.env` file:

```env
DROPEASE_API_KEY=your-secret-key-here
```

Generate a strong random key (you can use any password generator).

---

## Step 3: Call These APIs from DropEase

In your DropEase automation app, create a simple function to talk to Trendaryo:

**Example in DropEase (Node.js):**

```javascript
const axios = require('axios');

const TRENDARYO_API = 'https://your-trendaryo-site.vercel.app/api';
const API_KEY = 'your-secret-key-here';

async function updateTrendaryoProduct(productId, price, stock) {
  try {
    await axios.patch(`${TRENDARYO_API}/products/${productId}`, {
      price,
      stock
    }, {
      headers: { 'x-api-key': API_KEY }
    });
    console.log(`Updated product ${productId} in Trendaryo`);
  } catch (error) {
    console.error('Failed to update Trendaryo:', error.message);
  }
}

// Example usage
updateTrendaryoProduct('PRD-FTB-001', 1199, 140);
```

---

## Step 4: Common Sync Scenarios

### A. Price Monitoring → Update Trendaryo
When DropEase automation detects a competitor price change:
1. DropEase updates its own database
2. DropEase calls Trendaryo API to update price

### B. New Order in Trendaryo → Notify DropEase
You can also create a webhook in Trendaryo that notifies DropEase when a new order is placed.

### C. Stock Sync
DropEase can pull current stock from Trendaryo or push updated stock after supplier orders.

---

## Simple Integration Flow

```
DropEase Automation
        ↓ (calls API)
Trendaryo Live Store
        ↓ (updates Firestore)
Customer sees updated price/stock
```

---

## Security Tips

1. Never put the API key in frontend code.
2. Only allow specific IP addresses if possible (advanced).
3. Use HTTPS only.
4. Rotate the API key every few months.

---

## Next Steps

1. Add the `api/automation-sync.js` file in Trendaryo.
2. Add the API key in `.env`.
3. Test the endpoints using Postman or your browser.
4. Call these endpoints from DropEase automation rules.

Would you like me to also create the webhook version (Trendaryo → DropEase) so orders in Trendaryo automatically trigger actions in DropEase?
