import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Competitor Tracker – DropEase",
  description: "Monitor competitor pricing, products, and market positioning.",
}

export default function CompetitorsLayout({ children }: { children: React.ReactNode }) {
  return children
}