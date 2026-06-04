import { addDocument, setDocument } from './firestore-service'
import { products, suppliers, orders } from './mock-data'

/**
 * Seed initial data into Firestore (production)
 * Run this once after setting up your database
 */
export async function seedFirestoreData() {
  console.log('🌱 Starting Firestore seeding...')

  try {
    // Seed Products
    console.log('📦 Seeding products...')
    for (const product of products) {
      await setDocument(`dropease_products/${product.id}`, product)
    }
    console.log(`✅ Seeded ${products.length} products`)

    // Seed Suppliers
    console.log('🏭 Seeding suppliers...')
    for (const supplier of suppliers) {
      await setDocument(`dropease_suppliers/${supplier.id}`, supplier)
    }
    console.log(`✅ Seeded ${suppliers.length} suppliers`)

    // Seed Orders
    console.log('🛒 Seeding orders...')
    for (const order of orders) {
      await setDocument(`dropease_orders/${order.id}`, order)
    }
    console.log(`✅ Seeded ${orders.length} orders`)

    console.log('🎉 Firestore seeding completed successfully!')
    console.log('You can now use the app with real data from Firestore.')
  } catch (error) {
    console.error('❌ Seeding failed:', error)
  }
}

// Make it available in browser console during development
if (typeof window !== 'undefined') {
  // @ts-ignore
  window.seedFirestoreData = seedFirestoreData
  console.log('%c[DropEase] Seeding ready. Run: seedFirestoreData()', 'color: #D4A853')
}
