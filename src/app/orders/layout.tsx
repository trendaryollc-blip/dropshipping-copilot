import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Order Tracker – DropEase",
  description: "Track and manage all your dropshipping orders with real-time updates in one place.",
}

export default function OrdersLayout({ children }: { children: React.ReactNode }) {
  return children
}