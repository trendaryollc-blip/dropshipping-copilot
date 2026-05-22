const { checkApiKey } = require('../../_lib/check-api-key')
const { getDb } = require('../../_lib/firebase')

/** PATCH https://trendaryo.com/api/automation-sync/orders/:id */
module.exports = async (req, res) => {
  if (req.method !== 'PATCH') {
    return res.status(405).json({ error: 'Method not allowed' })
  }
  if (!checkApiKey(req, res)) return

  const { id } = req.query
  try {
    await getDb().collection('orders').doc(id).update({
      status: req.body?.status,
      updatedAt: new Date().toISOString(),
    })
    return res.status(200).json({ success: true, id })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}
