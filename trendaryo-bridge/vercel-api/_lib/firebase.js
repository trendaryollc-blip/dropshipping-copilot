const admin = require('firebase-admin')

function getDb() {
  if (!admin.apps.length) {
    if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON)
      admin.initializeApp({ credential: admin.credential.cert(serviceAccount) })
    } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      admin.initializeApp({ credential: admin.credential.applicationDefault() })
    } else {
      throw new Error('Firebase Admin not configured')
    }
  }
  return admin.firestore()
}

module.exports = { getDb }
