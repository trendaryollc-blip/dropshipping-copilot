import { getFirestoreClient, isFirestoreConfigured } from './firebase-client'
import { doc, setDoc, getDoc, deleteDoc, serverTimestamp } from 'firebase/firestore'

/**
 * Test Firestore connection by writing and reading a test document.
 * Run this in the browser console or import it temporarily in a page.
 */
export async function testFirestoreConnection() {
  console.log('🔥 Starting Firestore connection test...')

  if (!isFirestoreConfigured()) {
    console.error('❌ Firestore is NOT configured. Check your .env file.')
    return false
  }

  const db = getFirestoreClient()
  if (!db) {
    console.error('❌ Could not get Firestore client.')
    return false
  }

  const testDocPath = 'dropease_test/connection-test'
  const testData = {
    message: 'Hello from DropEase!',
    timestamp: serverTimestamp(),
    testNumber: Math.floor(Math.random() * 1000),
  }

  try {
    // Write test
    console.log('📝 Writing test document...')
    await setDoc(doc(db, testDocPath), testData)
    console.log('✅ Write successful!')

    // Read test
    console.log('📖 Reading test document...')
    const snap = await getDoc(doc(db, testDocPath))

    if (snap.exists()) {
      console.log('✅ Read successful!')
      console.log('📄 Document data:', snap.data())
    } else {
      console.warn('⚠️ Document was written but could not be read back.')
    }

    // Cleanup (optional)
    console.log('🧹 Cleaning up test document...')
    await deleteDoc(doc(db, testDocPath))
    console.log('✅ Cleanup done.')

    console.log('🎉 Firestore connection test PASSED!')
    return true
  } catch (error) {
    console.error('❌ Firestore test FAILED:', error)
    return false
  }
}

// Auto-run if imported in browser
if (typeof window !== 'undefined') {
  // @ts-ignore
  window.testFirestoreConnection = testFirestoreConnection
  console.log('%c[DropEase] Firestore test ready. Run: testFirestoreConnection()', 'color: #D4A853')
}
