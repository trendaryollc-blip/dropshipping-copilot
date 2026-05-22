/**
 * DropEase ↔ Trendaryo bridge (Express)
 * Mount in your server: app.use('/api/automation-sync', require('./api/automation-sync'))
 *
 * Requires: express, firebase-admin
 * Env: DROPEASE_API_KEY, plus Firebase Admin (see README-HTML-SITE.md)
 */

const express = require('express')
const admin = require('firebase-admin')

const router = express.Router()

function getDb() {
  if (!admin.apps.length) {
    if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON)
      admin.initializeApp({ credential: admin.credential.cert(serviceAccount) })
    } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      admin.initializeApp({ credential: admin.credential.applicationDefault() })
    } else {
      throw new Error(
        'Firebase Admin not configured. Set FIREBASE_SERVICE_ACCOUNT_JSON or GOOGLE_APPLICATION_CREDENTIALS',
      )
    }
  }
  return admin.firestore()
}

function checkApiKey(req, res, next) {
  const expected = process.env.DROPEASE_API_KEY
  if (!expected) {
    return res.status(500).json({ error: 'DROPEASE_API_KEY is not set on server' })
  }
  const apiKey = req.headers['x-api-key']
  if (apiKey === expected) return next()
  return res.status(401).json({ error: 'Unauthorized' })
}

router.use(checkApiKey)

router.get('/products', async (req, res) => {
  try {
    const snapshot = await getDb().collection('products').get()
    const products = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    res.json(products)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.patch('/products/:id', async (req, res) => {
  try {
    const { price, stock } = req.body
    const updates = {
      updatedAt: new Date().toISOString(),
      automationLastSyncedAt: new Date().toISOString(),
      automationSource: 'dropease',
    }
    if (price !== undefined) updates.price = price
    if (stock !== undefined) updates.stock = stock

    await getDb().collection('products').doc(req.params.id).update(updates)
    res.json({ success: true, id: req.params.id })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.get('/orders', async (req, res) => {
  try {
    const snapshot = await getDb().collection('orders').get()
    const orders = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    res.json(orders)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.post('/orders', async (req, res) => {
  try {
    const docRef = await getDb().collection('orders').add({
      ...req.body,
      status: req.body.status || 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      automationSource: 'dropease',
    })
    res.json({ id: docRef.id, success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.patch('/orders/:id', async (req, res) => {
  try {
    await getDb().collection('orders').doc(req.params.id).update({
      status: req.body.status,
      updatedAt: new Date().toISOString(),
    })
    res.json({ success: true, id: req.params.id })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
