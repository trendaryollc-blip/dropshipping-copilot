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
      return res.status(500).json({ error: error.message })
    }
  }

  if (req.method === 'POST') {
    try {
      const docRef = await getDb().collection('orders').add({
        ...req.body,
        status: req.body?.status || 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        automationSource: 'dropease',
      })
      return res.status(200).json({ id: docRef.id, success: true })
    } catch (error) {
      return res.status(500).json({ error: error.message })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
