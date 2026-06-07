import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Reviews – DropEase",
  description: "Import, manage, and respond to customer reviews across platforms.",
}

export default function ReviewsLayout({ children }: { children: React.ReactNode }) {
  return children
}