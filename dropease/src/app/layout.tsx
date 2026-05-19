import type { Metadata } from "next"
import { Inter, Geist_Mono } from "next/font/google"
import "./globals.css"
import { SidebarProvider } from "@/components/ui/sidebar"
import { SidebarNav } from "@/components/layout/SidebarNav"
import { HeaderBar } from "@/components/layout/HeaderBar"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { LazyStockAlert } from "@/components/lazy-component"
import { QueryProvider } from "@/components/query-provider"
import { PerformanceToggle } from "@/components/performance-monitor"
import { ThemeProvider } from "@/components/theme-provider"
import { OnboardingWizard } from "@/components/onboarding-wizard"
import { PWARegister } from "@/components/pwa-register"
import { FirestoreTestLoader } from "@/components/FirestoreTestLoader"
import { FirestoreDataLoader } from "@/components/FirestoreDataLoader"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "DropEase – Your Dropshipping Assistant",
  description:
    "Find products, discover suppliers, generate descriptions and manage your dropshipping business easily.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <QueryProvider>
            <TooltipProvider>
              <SidebarProvider defaultOpen={true}>
                <div className="flex min-h-screen w-full bg-background text-foreground">
                  <SidebarNav />
                  <div className="flex flex-1 flex-col min-w-0">
                    <HeaderBar />
                    <LazyStockAlert />
                    <main className="flex-1 px-4 py-5 sm:px-6 lg:px-8">{children}</main>
                  </div>
                </div>
              </SidebarProvider>
              <Toaster richColors position="top-right" />
              <OnboardingWizard />
              <PWARegister />
              <FirestoreTestLoader />
              <FirestoreDataLoader />
            </TooltipProvider>
          </QueryProvider>
        </ThemeProvider>
        <PerformanceToggle />
      </body>
    </html>
  )
}
