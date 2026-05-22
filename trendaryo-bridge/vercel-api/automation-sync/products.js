const { checkApiKey } = require('../_lib/check-api-key')
const { getDb } = require('../_lib/firebase')

/** GET https://trendaryo.com/api/automation-sync/products */
module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }
  if (!checkApiKey(req, res)) return

  try {
    const snap = await getDb().collection('products').get()
    const products = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    return res.status(200).json(products)
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}
