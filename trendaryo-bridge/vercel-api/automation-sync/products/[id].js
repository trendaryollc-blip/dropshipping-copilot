const { checkApiKey } = require('../../_lib/check-api-key')
const { getDb } = require('../../_lib/firebase')

/** PATCH https://trendaryo.com/api/automation-sync/products/:id */
module.exports = async (req, res) => {
  if (req.method !== 'PATCH') {
    return res.status(405).json({ error: 'Method not allowed' })
  }
  if (!checkApiKey(req, res)) return

  const { id } = req.query
  try {
    const { price, stock } = req.body || {}
    const updates = {
      updatedAt: new Date().toISOString(),
      automationLastSyncedAt: new Date().toISOString(),
      automationSource: 'dropease',
    }
    if (price !== undefined) updates.price = price
    if (stock !== undefined) updates.stock = stock

    await getDb().collection('products').doc(id).update(updates)
    return res.status(200).json({ success: true, id })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}
