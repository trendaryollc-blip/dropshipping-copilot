import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Supplier Finder – DropEase",
  description: "Find and connect with reliable suppliers for your dropshipping products.",
}

export default function SuppliersLayout({ children }: { children: React.ReactNode }) {
  return children
}