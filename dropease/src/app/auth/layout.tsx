import type { Metadata } from "next"
import { Geist } from "next/font/google"
import "../globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { Zap } from "lucide-react"
import Link from "next/link"

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Sign In – DropEase",
  icons: { icon: "/favicon.ico" },
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} antialiased`} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
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
              <span className="underline cursor-pointer hover:text-foreground">Terms of Service</span>{" "}
              and{" "}
              <span className="underline cursor-pointer hover:text-foreground">Privacy Policy</span>.
            </p>
          </div>
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  )
}
