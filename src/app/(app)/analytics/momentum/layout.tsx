import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Weekly Momentum – DropEase",
  description: "Deep dive analysis of your weekly store performance.",
}

export default function MomentumLayout({ children }: { children: React.ReactNode }) {
  return children
}