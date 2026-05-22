/** Shared API key check for Trendaryo serverless routes */
function checkApiKey(req, res) {
  const expected = process.env.DROPEASE_API_KEY
  if (!expected) {
    res.status(500).json({ error: 'DROPEASE_API_KEY is not set' })
    return false
  }
  const provided = req.headers['x-api-key']
  if (provided !== expected) {
    res.status(401).json({ error: 'Unauthorized' })
    return false
  }
  return true
}

module.exports = { checkApiKey }
