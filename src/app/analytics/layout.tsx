import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Analytics – DropEase",
  description: "Track your store performance with detailed analytics and insights.",
}

export default function AnalyticsLayout({ children }: { children: React.ReactNode }) {
  return children
}