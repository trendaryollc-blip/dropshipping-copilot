"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, LogIn, Loader2, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuthStore } from "@/store/useAuthStore"
import { toast } from "sonner"
import {
  googleSignIn,
  isGoogleRedirectInFlight,
  clearGoogleRedirectFlag,
  handleGoogleRedirect,
} from "@/lib/firebase-auth"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { login } = useAuthStore()
  const router = useRouter()

  // ── Consume Google OAuth redirect result on mount ──────────────────────────
  // After Google redirects back, `handleGoogleRedirect()` calls `getRedirectResult()`
  // which synchronously sets `currentUser` so `onAuthStateChanged` fires → store is
  // populated.  We do NOT use `isGoogleRedirectInFlight()` to guard here because
  // a redirect round-trip is a normal post-login page navigation, not an error.
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const resolved = await handleGoogleRedirect()
        if (resolved && !cancelled) {
          clearGoogleRedirectFlag()
          toast.success("Signed in with Google! 👋")
        }
      } catch {
        // no-op — redirect wasn't pending
      } finally {
        clearGoogleRedirectFlag()
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    if (!email || !password) {
      setError("Please enter your email and password.")
      return
    }
    setLoading(true)
    try {
      const result = await login(email, password)
      if (result.ok) {
        toast.success("Welcome back! 👋")
        router.push("/")
        router.refresh()
      } else {
        setError(result.error || "Sign in failed. Please try again.")
      }
    } catch (err: any) {
      const code = err?.code?.replace("auth/", "").replace(/-/g, " ") || "Sign in failed."
      setError(code.charAt(0).toUpperCase() + code.slice(1) + ".")
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle() {
    setError("")
    try {
      await googleSignIn("redirect")
    } catch (err: any) {
      const code = err?.code || ""
      let msg = "Google sign-in failed."
      if (code === "auth/popup-closed-by-user") {
        msg = "Google sign-in cancelled."
      } else if (code.startsWith("auth/")) {
        msg = code.replace("auth/", "").replace(/-/g, " ")
        msg = msg.charAt(0).toUpperCase() + msg.slice(1)
      }
      setError(msg)
    }
  }

  return (
    <Card className="w-full max-w-sm shadow-xl">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-xl">Welcome back</CardTitle>
        <CardDescription>Sign in to your DropEase account</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-destructive/10 px-3 py-2.5 text-xs text-destructive">
              <AlertCircle className="size-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Google Sign-In */}
          <Button
            type="button"
            variant="outline"
            className="w-full h-11 text-sm font-medium gap-2"
            onClick={handleGoogle}
            disabled={loading}
          >
            <svg viewBox="0 0 24 24" className="size-5">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </Button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase">
              <span className="bg-card px-2 text-muted-foreground">or sign in with email</span>
            </div>
          </div>

          {/* Email / Password form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Email</Label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="h-11"
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium">Password</Label>
                <Link
                  href="/auth/forgot-password"
                  className="text-[11px] text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  type={showPw ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="pr-10 h-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                >
                  {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full h-11 text-sm font-medium" disabled={loading}>
              {loading ? (
                <><Loader2 className="size-4 animate-spin" /> Signing in…</>
              ) : (
                <><LogIn className="size-4" /> Sign In</>
              )}
            </Button>
          </form>

          <div className="mt-1 text-center text-xs text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="text-primary hover:underline font-medium">
              Create one free
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
