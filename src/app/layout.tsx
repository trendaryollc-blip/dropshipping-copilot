import type { Metadata, Viewport } from "next"
import { Inter, Geist_Mono } from "next/font/google"
import "./globals.css"
import { SidebarProvider } from "@/components/ui/sidebar"
import { SidebarNav } from "@/components/layout/SidebarNav"
import { MobileSidebar } from "@/components/layout/MobileSidebar"
import { HeaderBar } from "@/components/layout/HeaderBar"
import { Breadcrumbs } from "@/components/ui/breadcrumbs"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryProvider } from "@/components/query-provider"
import { RouteLoadingIndicator } from "@/components/ui/route-loading-indicator"
import { PerformanceToggle } from "@/components/performance-monitor"
import { ThemeProvider } from "@/components/theme-provider"
import { OnboardingWizard } from "@/components/onboarding-wizard"
import { ClientOnlyWidgets } from "@/components/ui/client-only-widgets"
import { AuthGuard } from "@/components/AuthGuard"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

// Next.js 15: viewport must be exported separately from `metadata`.
// See https://nextjs.org/docs/app/api-reference/functions/generate-viewport
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
}

export const metadata: Metadata = {
  title: "DropEase – Your Dropshipping Assistant",
  description:
    "Find products, discover suppliers, generate descriptions and manage your dropshipping business easily.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "DropEase",
  },
  formatDetection: {
    telephone: false,
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
        {/* Skip to content for keyboard users */}
        <a href="#main-content" className="skip-to-content">
          Skip to content
        </a>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {/* Animated mesh gradient background */}
          <div className="mesh-bg" aria-hidden="true" />
          <RouteLoadingIndicator />
          <QueryProvider>
            <TooltipProvider>
              <AuthGuard>
                <MobileSidebar />
                <SidebarProvider defaultOpen={true}>
                  <div className="flex min-h-screen w-full">
                    {/* Desktop sidebar — hidden on small screens */}
                    <div className="hidden lg:block">
                      <SidebarNav />
                    </div>
                    <div className="flex flex-1 flex-col min-w-0">
                      <HeaderBar />
                      <main id="main-content" className="flex-1 px-4 py-4 sm:px-6 lg:px-8 xl:px-10" role="main">
                        <div className="mb-4">
                          <Breadcrumbs />
                        </div>
                        {children}
                      </main>
                    </div>
                  </div>
                </SidebarProvider>
                <Toaster richColors position="top-right" />
                <OnboardingWizard />
                <ClientOnlyWidgets />
                <PerformanceToggle />
              </AuthGuard>
            </TooltipProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}