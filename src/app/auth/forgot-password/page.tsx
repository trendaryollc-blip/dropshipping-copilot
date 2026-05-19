"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Loader2, Mail, AlertCircle, CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { resetPassword } from "@/lib/firebase-auth"
import { toast } from "sonner"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    try {
      await resetPassword(email)
      setSent(true)
    } catch (err: any) {
      const msg = err?.code?.replace("auth/", "").replace(/-/g, " ") || "Failed to send reset email."
      toast.error(msg.charAt(0).toUpperCase() + msg.slice(1) + ".")
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <Card className="w-full max-w-sm shadow-xl">
        <CardContent className="pt-6 pb-6">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-emerald-500/10">
              <CheckCircle2 className="size-6 text-emerald-500" />
            </div>
            <CardTitle className="text-xl">Check your inbox</CardTitle>
            <CardDescription className="text-sm leading-relaxed">
              If an account exists for{" "}
              <span className="font-medium text-foreground">{email}</span>, you&apos;ll receive a
              password-reset link shortly.
              <br />
              <span className="text-xs text-muted-foreground">(Check your spam folder.)</span>
            </CardDescription>
            <Button variant="outline" className="mt-2" onClick={() => setSent(false)}>
              Try a different email
            </Button>
            <Link href="/auth/login" className="text-xs text-primary hover:underline mt-1">
              ← Back to sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-sm shadow-xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl text-center">Reset password</CardTitle>
        <CardDescription className="text-center text-xs">
          Enter your email and we&apos;ll send you a secure reset link.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Email</Label>
            <div className="relative">
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="pl-10 h-11"
              />
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            </div>
          </div>
          <Button type="submit" className="w-full h-11 text-sm font-medium" disabled={loading}>
            {loading ? (
              <><Loader2 className="size-4 animate-spin" /> Sending…</>
            ) : (
              <><Mail className="size-4" /> Send Reset Link</>
            )}
          </Button>
        </form>

        <div className="mt-4 flex items-center gap-2 rounded-lg bg-accent/50 px-3 py-2.5 text-[11px] text-muted-foreground">
          <AlertCircle className="size-3.5 shrink-0" />
          <span>
            You&apos;ll stay signed out until you use the reset link to set a new password.
          </span>
        </div>

        <Link
          href="/auth/login"
          className="mt-4 flex items-center justify-center gap-1.5 text-xs text-primary hover:underline"
        >
          <ArrowLeft className="size-3.5" />
          Back to sign in
        </Link>
      </CardContent>
    </Card>
  )
}
