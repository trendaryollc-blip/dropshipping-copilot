import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Product Research – DropEase",
  description: "Discover winning products with high demand, low competition, and strong margin potential for your dropshipping store.",
}

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return children
}