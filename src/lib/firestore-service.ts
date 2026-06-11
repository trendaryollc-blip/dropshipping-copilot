import { initializeApp } from "firebase/app"
import { getFirestore, collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from "firebase/firestore"
import { getApp } from "firebase/app"

// Initialize Firebase with mock configuration
const firebaseConfig = {
  apiKey: "mock-api-key",
  authDomain: "mock-auth-domain.firebaseapp.com",
  projectId: "mock-project-id",
  storageBucket: "mock-bucket.appspot.com",
  messagingSenderId: "mock-sender-id",
  appId: "mock-app-id"
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// Mock data storage
const mockData: Record<string, any[]> = {
  copilot_products: [],
  copilot_orders: [],
  copilot_suppliers: [],
  copilot_automation_rules: [],
  copilot_users: []
}

// Initialize with some sample data
function initializeMockData() {
  // Initialize with some sample products
  if (mockData.copilot_products.length === 0) {
    const sampleProducts = [
      {
        id: "prod-1",
        name: "Wireless Bluetooth Headphones",
        image: "https://example.com/headphones.jpg",
        niche: "Electronics",
        priceRange: { min: 49.99, max: 59.99 },
        competition: "medium",
        trendScore: 75,
        supplierName: "TechSupplies Inc.",
        status: "active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        stock: 42,
        price: 54.99
      },
      {
        id: "prod-2",
        name: "Smartphone Stand",
        image: "https://example.com/stand.jpg",
        niche: "Electronics",
        priceRange: { min: 14.99, max: 19.99 },
        competition: "low",
        trendScore: 60,
        supplierName: "GadgetWorld",
        status: "active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        stock: 120,
        price: 17.99
      },
      {
        id: "prod-3",
        name: "Organic Cotton T-Shirt",
        image: "https://example.com/tshirt.jpg",
        niche: "Clothing",
        priceRange: { min: 19.99, max: 24.99 },
        competition: "medium",
        trendScore: 80,
        supplierName: "FashionFiber",
        status: "draft",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        stock: 75,
        price: 22.49
      }
    ]
    mockData.copilot_products = sampleProducts
  }

  // Initialize with some sample users
  if (mockData.copilot_users.length === 0) {
    mockData.copilot_users = [
      {
        id: "user-1",
        name: "John Doe",
        email: "john@example.com",
        avatar: "https://i.pravatar.cc/80?u=john@example.com",
        plan: "free",
        createdAt: new Date().toISOString(),
        isOnboarded: true
      }
    ]
  }
}

// Initialize mock data
initializeMockData()

// Helper function to get collection with mock data
async function getCollection<T>(collectionName: string): Promise<T[]> {
  // Return mock data instead of actual Firestore query
  return mockData[collectionName] || []
}

// Helper function to add document with mock data
async function addDocument<T>(collectionName: string, data: T): Promise<void> {
  // Add to mock data
  const newItem = { ...data, id: `mock-${Date.now()}` }
  mockData[collectionName] = mockData[collectionName] || []
  mockData[collectionName].push(newItem)
}

// Helper function to update document with mock data
async function updateDocument<T>(collectionName: string, id: string, updates: Partial<T>): Promise<void> {
  // Update in mock data
  mockData[collectionName] = mockData[collectionName] || []
  const index = mockData[collectionName].findIndex(item => item.id === id)
  if (index !== -1) {
    mockData[collectionName][index] = { ...mockData[collectionName][index], ...updates }
  }
}

// Helper function to delete document with mock data
async function deleteDocument<T>(collectionName: string, id: string): Promise<void> {
  // Delete from mock data
  mockData[collectionName] = mockData[collectionName] || []
  mockData[collectionName] = mockData[collectionName].filter(item => item.id !== id)
}

export {
  getCollection,
  addDocument,
  updateDocument,
  deleteDocument
}