import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Profit Calculator – DropEase",
  description: "Calculate your profit margins and optimize pricing for your dropshipping products.",
}

export default function CalculatorLayout({ children }: { children: React.ReactNode }) {
  return children
}