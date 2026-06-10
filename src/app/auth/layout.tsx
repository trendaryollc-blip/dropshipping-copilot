import type { Metadata } from "next"
import { Zap } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: {
    default: "DropEase",
    template: "%s – DropEase",
  },
  icons: { icon: "/favicon.ico" },
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      {/* Brand */}
      <Link href="/" className="mb-8 flex items-center gap-2.5">
        <div className="flex size-9 items-center justify-center rounded-xl bg-primary shadow-lg">
          <Zap className="size-5 text-white" />
        </div>
        <span className="text-xl font-bold tracking-tight text-foreground">DropEase</span>
      </Link>
      {children}
      <p className="mt-6 text-center text-xs text-muted-foreground">
        By continuing you agree to our{" "}
        <Link href="/legal/terms" className="underline hover:text-foreground">Terms of Service</Link>{" "}
        and{" "}
        <Link href="/legal/privacy" className="underline hover:text-foreground">Privacy Policy</Link>.
      </p>
    </div>
  )
}