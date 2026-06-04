export type BrandingTheme = "default" | "dark" | "light"

export interface BrandingSettings {
  brandName: string
  logoUrl: string
  accentColor: string
  primaryColor: string
  supportEmail: string
  theme: BrandingTheme
  customDomain?: string
}

const defaultBranding: BrandingSettings = {
  brandName: "DropEase",
  logoUrl: "/logo.svg",
  accentColor: "#0ea5e9",
  primaryColor: "#0284c7",
  supportEmail: "support@dropease.com",
  theme: "default",
  customDomain: "",
}

let branding = { ...defaultBranding }

export async function loadBrandingSettings(): Promise<BrandingSettings> {
  return new Promise((resolve) => setTimeout(() => resolve({ ...branding }), 200))
}

export async function saveBrandingSettings(settings: BrandingSettings): Promise<BrandingSettings> {
  branding = { ...settings }
  return new Promise((resolve) => setTimeout(() => resolve({ ...branding }), 200))
}

export async function resetBrandingSettings(): Promise<BrandingSettings> {
  branding = { ...defaultBranding }
  return loadBrandingSettings()
}
