import type { CustomerProfile } from "@/types"

const STORAGE_KEY = "dropease_customers_v1"

export function loadCustomersFromLocal(): CustomerProfile[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as CustomerProfile[]
  } catch (e) {
    console.error("Failed to load customers", e)
    return []
  }
}

export function saveCustomersToLocal(customers: CustomerProfile[]) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customers))
  } catch (e) {
    console.error("Failed to save customers", e)
  }
}

export function generateMockCustomers(): CustomerProfile[] {
  const now = new Date().toISOString().split("T")[0]
  return [
    { id: "cust_1", name: "Sarah Mitchell", email: "sarah@example.com", segment: "Loyal", lifetimeValue: 420.5, orders: 5, lastOrderDate: now, status: "active", lastContacted: "2024-01-10" },
    { id: "cust_2", name: "James Cooper", email: "james@example.com", segment: "New", lifetimeValue: 24.99, orders: 1, lastOrderDate: now, status: "active", lastContacted: "2024-01-12" },
    { id: "cust_3", name: "Emily Chen", email: "emily@example.com", segment: "At-risk", lifetimeValue: 19.99, orders: 2, lastOrderDate: now, status: "inactive", lastContacted: "2023-12-01" },
  ]
}
