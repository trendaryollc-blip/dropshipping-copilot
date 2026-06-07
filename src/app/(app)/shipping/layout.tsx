import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Shipping Hub – DropEase",
  description: "Manage shipping rates, track packages, and optimize fulfillment.",
}

export default function ShippingLayout({ children }: { children: React.ReactNode }) {
  return children
}