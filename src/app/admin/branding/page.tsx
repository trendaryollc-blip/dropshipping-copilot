"use client"

import { useEffect, useState } from "react"
import { Brush, Globe, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { loadBrandingSettings, saveBrandingSettings, resetBrandingSettings } from "@/lib/branding-service"

export default function AdminBrandingPage() {
  const [settings, setSettings] = useState<Awaited<ReturnType<typeof loadBrandingSettings>> | null>(null)

  useEffect(() => {
    loadBrandingSettings().then(setSettings)
  }, [])

  const handleSave = async () => {
    if (!settings) return
    const saved = await saveBrandingSettings(settings)
    setSettings(saved)
    toast.success("Branding settings saved")
  }

  const handleReset = async () => {
    const reset = await resetBrandingSettings()
    setSettings(reset)
    toast.success("Branding reset to defaults")
  }

  if (!settings) return null

  return (
    <div className="space-y-5">
      <div>
        <h1 className="page-header">Branding & White-Label</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Customize your app identity, brand colors, and customer-facing domain.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Visual Brand</CardTitle>
            <CardDescription>Update your logo, accent color and promotional brand name.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-xs font-medium">Brand Name</Label>
              <Input value={settings.brandName} onChange={(event) => setSettings({ ...settings, brandName: event.target.value })} />
            </div>
            <div>
              <Label className="text-xs font-medium">Logo URL</Label>
              <Input value={settings.logoUrl} onChange={(event) => setSettings({ ...settings, logoUrl: event.target.value })} />
            </div>
            <div>
              <Label className="text-xs font-medium">Accent Color</Label>
              <Input type="color" value={settings.accentColor} onChange={(event) => setSettings({ ...settings, accentColor: event.target.value })} className="h-10 w-full rounded-lg border" />
            </div>
            <div>
              <Label className="text-xs font-medium">Support Email</Label>
              <Input value={settings.supportEmail} onChange={(event) => setSettings({ ...settings, supportEmail: event.target.value })} />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave}>Save Branding</Button>
              <Button variant="outline" onClick={handleReset}>
                <RotateCcw className="mr-2 h-4 w-4" /> Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>White-Label Options</CardTitle>
            <CardDescription>Enable custom domain and product-facing brand identity.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Current theme:</p>
              <div className="grid grid-cols-3 gap-2">
                {(["default", "dark", "light"] as const).map((theme) => (
                  <button
                    key={theme}
                    onClick={() => setSettings({ ...settings, theme })}
                    className={`rounded-xl border px-3 py-2 text-sm transition ${settings.theme === theme ? "border-primary bg-primary/10 text-primary" : "border-border bg-background text-foreground"}`}
                  >
                    {theme}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label className="text-xs font-medium">Custom Domain</Label>
              <Input value={settings.customDomain} onChange={(event) => setSettings({ ...settings, customDomain: event.target.value })} placeholder="store.yourbrand.com" />
            </div>
            <div className="rounded-2xl border border-border bg-muted p-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Brush className="size-4" />
                <p>Custom branding can be extended into email templates, invoices, and storefront embeds.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 text-sm text-muted-foreground">
        <div className="flex items-start gap-3">
          <Globe className="size-5 text-primary" />
          <div>
            <p className="font-semibold">White-label placeholder</p>
            <p className="mt-1">Wire in your custom domain and logo assets in production to fully white-label DropEase.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
