"use client"

import { useEffect, useRef } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Loader2 } from "lucide-react"
import { useAuthStore } from "@/store/useAuthStore"

/**
 * AuthGuard — client-side route guard.
 *
 * Usage in a page:
 * ```tsx
 * export default function ProtectedPage() {
 *   return (
 *     <AuthGuard>
 *       <ProtectedContent />
 *     </AuthGuard>
 *   )
 * }
 * ```
 *
 * Waits for the `isInitialised` flag before deciding whether to redirect so we
 * never flash an unauthenticated shell or redirect before Firebase finishes
 * hydrating the session.
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isInitialised } = useAuthStore()
  const router = useRouter()
  const pathname = usePathname()
  const redirected = useRef(false)

  useEffect(() => {
    if (isInitialised && !isAuthenticated && !redirected.current) {
      redirected.current = true
      const params = new URLSearchParams({ callbackUrl: pathname })
      router.replace(`/auth/login?${params.toString()}`)
    }
  }, [isInitialised, isAuthenticated, pathname, router])

  if (!isInitialised) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!isAuthenticated) return null
  return <>{children}</>
}
