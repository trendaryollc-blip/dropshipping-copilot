const { checkApiKey } = require('../../_lib/check-api-key')
const { getDb } = require('../../_lib/firebase')

/** PATCH https://trendaryo.com/api/automation-sync/products/:id */
module.exports = async (req, res) => {
  if (req.method !== 'PATCH') {
    return res.status(405).json({ error: 'Method not allowed' })
  }
  if (!checkApiKey(req, res)) return

  const { id } = req.query
  if (!id) {
    return res.status(400).json({ error: 'Product ID is required' })
  }

  try {
    const { price, stock } = req.body || {}
    
    // Input validation
    if (price !== undefined && typeof price !== 'number') {
      return res.status(400).json({ error: 'Price must be a number' })
    }
    if (stock !== undefined && typeof stock !== 'number') {
      return res.status(400).json({ error: 'Stock must be a number' })
    }

    const productRef = getDb().collection('products').doc(id)
    const doc = await productRef.get()

    if (!doc.exists) {
      return res.status(404).json({ error: 'Product not found' })
    }

    const updates = {
      updatedAt: new Date().toISOString(),
      automationLastSyncedAt: new Date().toISOString(),
      automationSource: 'dropease',
      automationSynced: true,
    }
    if (price !== undefined) updates.price = Number(price)
    if (stock !== undefined) updates.stock = Number(stock)

    await productRef.update(updates)
    return res.status(200).json({ success: true, id, updatedFields: Object.keys(updates) })
  } catch (error) {
    console.error(`[Automation Sync] Failed to update product ${id}:`, error)
    return res.status(500).json({ error: 'Internal server error while updating product' })
  }
}
