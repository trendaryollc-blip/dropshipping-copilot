import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Learning Hub – DropEase",
  description: "Guides, tutorials, and best practices for building your dropshipping business.",
}

export default function LearnLayout({ children }: { children: React.ReactNode }) {
  return children
}