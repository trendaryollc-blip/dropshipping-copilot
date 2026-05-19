"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { User, Camera, ArrowLeft, Loader2, CheckCircle2, Mail } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AuthGuard } from "@/components/AuthGuard"
import { useAuthStore } from "@/store/useAuthStore"
import { updateAuthProfile } from "@/lib/firebase-auth"
import { toast } from "sonner"

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuthStore()
  const router = useRouter()

  const [name, setName] = useState("")
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (user) setName(user.name)
  }, [user])

  if (!isAuthenticated) return null

  const initials = (name || "U")
    .split(" ")
    .map((s) => s[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    try {
      const updated = await updateAuthProfile({ displayName: name })
      useAuthStore.getState().updateProfile({ name: updated.name })
      toast.success("Profile updated successfully")
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err: any) {
      const msg = err?.message || "Failed to update profile."
      toast.error(msg)
    } finally {
      setSaving(false)
    }
  }

  return (
    <AuthGuard>
      <div className="mx-auto max-w-lg space-y-8">
        {/* Back */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition"
        >
          <ArrowLeft className="size-3.5" />
          Go back
        </button>

        {/* Header */}
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Account</p>
          <h1 className="page-header mt-1">Profile settings</h1>
        </div>

        {/* Avatar card */}
        <Card className="overflow-visible">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4 sm:flex-row">
              <div className="relative group">
                <div className="flex size-20 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 text-2xl font-bold text-white shadow-xl">
                  {initials}
                </div>
                <button
                  type="button"
                  className="absolute -bottom-1 -right-1 flex size-7 items-center justify-center rounded-full border-2 border-background bg-accent text-accent-foreground shadow transition hover:bg-primary hover:text-primary-foreground"
                  title="Change avatar (handled by Firebase)"
                >
                  <Camera className="size-3.5" />
                </button>
              </div>
              <div className="space-y-1 text-center sm:text-left">
                <p className="text-base font-semibold">{user?.name}</p>
                <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground sm:justify-start">
                  <Mail className="size-3" />
                  {user?.email}
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Member since {user?.createdAt}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit form */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Edit profile</CardTitle>
            <CardDescription>Update your display name — avatar changes are handled in your Google account.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-5">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Display Name</Label>
                <Input
                  type="text"
                  placeholder="Your display name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-11"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Email</Label>
                <Input
                  type="email"
                  value={user?.email ?? ""}
                  disabled
                  className="h-11 opacity-60"
                />
                <p className="text-[11px] text-muted-foreground mt-1">
                  Email cannot be changed here. Use your account provider to update it.
                </p>
              </div>

              <Button type="submit" className="w-full h-11" disabled={saving || saved}>
                {saved ? (
                  <><CheckCircle2 className="size-4" /> Saved!</>
                ) : saving ? (
                  <><Loader2 className="size-4 animate-spin" /> Saving…</>
                ) : (
                  <><User className="size-4" /> Save Changes</>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Account info */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Account</CardTitle>
            <CardDescription>Your account details and settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b">
                <div>
                  <p className="text-sm font-medium">Plan</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Manage subscription</p>
                </div>
                <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                  {user?.plan ?? "free"}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <div>
                  <p className="text-sm font-medium">User ID</p>
                  <p className="text-xs text-muted-foreground mt-0.5 font-mono">{user?.id}</p>
                </div>
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium">Member since</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{user?.createdAt}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthGuard>
  )
}
