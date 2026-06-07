import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "SEO Tools – DropEase",
  description: "Optimize your product listings with powerful SEO tools for better visibility.",
}

export default function SeoLayout({ children }: { children: React.ReactNode }) {
  return children
}