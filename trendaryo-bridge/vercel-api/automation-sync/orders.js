const { checkApiKey } = require('../_lib/check-api-key')
const { getDb } = require('../_lib/firebase')

/** GET + POST https://trendaryo.com/api/automation-sync/orders */
module.exports = async (req, res) => {
  if (!checkApiKey(req, res)) return

  if (req.method === 'GET') {
    try {
      const snap = await getDb().collection('orders').get()
      const orders = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      return res.status(200).json(orders)
    } catch (error) {
      console.error('[Automation Sync] Failed to fetch orders:', error)
      return res.status(500).json({ error: 'Internal server error while fetching orders' })
    }
  }

  if (req.method === 'POST') {
    try {
      const { userId, items, total, shippingAddress } = req.body || {}
      
      // Basic input validation
      if (!userId || !items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'Invalid order data: userId and items array are required' })
      }
      if (typeof total !== 'number' || total <= 0) {
        return res.status(400).json({ error: 'Invalid order data: total must be a positive number' })
      }

      const orderData = {
        userId,
        items,
        total,
        shippingAddress: shippingAddress || {},
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        automationSource: 'dropease',
        automationSynced: true,
      }

      const docRef = await getDb().collection('orders').add(orderData)
      return res.status(201).json({ id: docRef.id, success: true, status: 'pending' })
    } catch (error) {
      console.error('[Automation Sync] Failed to create order:', error)
      return res.status(500).json({ error: 'Internal server error while creating order' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
