const { checkApiKey } = require('../../_lib/check-api-key')
const { getDb } = require('../../_lib/firebase')

const VALID_ORDER_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']

/** PATCH https://trendaryo.com/api/automation-sync/orders/:id */
module.exports = async (req, res) => {
  if (req.method !== 'PATCH') {
    return res.status(405).json({ error: 'Method not allowed' })
  }
  if (!checkApiKey(req, res)) return

  const { id } = req.query
  if (!id) {
    return res.status(400).json({ error: 'Order ID is required' })
  }

  try {
    const { status, trackingNumber } = req.body || {}
    
    // Input validation
    if (status !== undefined && !VALID_ORDER_STATUSES.includes(status)) {
      return res.status(400).json({ 
        error: `Invalid status. Must be one of: ${VALID_ORDER_STATUSES.join(', ')}` 
      })
    }

    const orderRef = getDb().collection('orders').doc(id)
    const doc = await orderRef.get()

    if (!doc.exists) {
      return res.status(404).json({ error: 'Order not found' })
    }

    const updates = {
      updatedAt: new Date().toISOString(),
      automationSource: 'dropease',
    }
    if (status !== undefined) updates.status = status
    if (trackingNumber !== undefined) updates.trackingNumber = trackingNumber

    await orderRef.update(updates)
    return res.status(200).json({ success: true, id, updatedFields: Object.keys(updates) })
  } catch (error) {
    console.error(`[Automation Sync] Failed to update order ${id}:`, error)
    return res.status(500).json({ error: 'Internal server error while updating order' })
  }
}
