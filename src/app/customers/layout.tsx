import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "CRM – DropEase",
  description: "Manage your customer relationships, segments, and lifecycle automation.",
}

export default function CustomersLayout({ children }: { children: React.ReactNode }) {
  return children
}