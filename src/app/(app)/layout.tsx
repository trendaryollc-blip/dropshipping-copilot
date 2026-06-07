"use client"

import { Suspense, lazy } from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { SidebarNav } from "@/components/layout/SidebarNav"
import { MobileSidebar } from "@/components/layout/MobileSidebar"
import { HeaderBar } from "@/components/layout/HeaderBar"
import { Breadcrumbs } from "@/components/ui/breadcrumbs"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryProvider } from "@/components/query-provider"
import { RouteLoadingIndicator } from "@/components/ui/route-loading-indicator"
import { ClientOnlyWidgets } from "@/components/ui/client-only-widgets"
import { AuthGuard } from "@/components/AuthGuard"

// Lazy-load heavy components that aren't needed on initial paint
const OnboardingWizard = lazy(() =>
  import("@/components/onboarding-wizard").then((m) => ({ default: m.OnboardingWizard }))
)

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
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
            <Suspense fallback={null}>
              <OnboardingWizard />
            </Suspense>
            <ClientOnlyWidgets />
          </AuthGuard>
        </TooltipProvider>
      </QueryProvider>
    </>
  )
}