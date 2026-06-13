"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight } from "lucide-react"

const routeLabels: Record<string, string> = {
  "": "Dashboard",
  products: "Products",
  suppliers: "Suppliers",
  orders: "Orders",
  "my-products": "My Products",
  calculator: "Calculator",
  description: "Description AI",
  seo: "SEO Tools",
  returns: "Returns",
  customers: "CRM",
  shipping: "Shipping",
  reviews: "Reviews",
  analytics: "Analytics",
  automation: "Automation",
  "business-opportunities": "Opportunities",
  business: "Business Ops",
  trends: "Trends",
  competitors: "Competitors",
  "multi-store": "Multi-Store",
  mobile: "Mobile App",
  learn: "Learning Hub",
  search: "Search",
  campaigns: "Campaigns",
  "bulk-edit": "Bulk Edit",
  activity: "Activity",
  admin: "Admin",
  billing: "Billing",
  branding: "Branding",
  reports: "Reports",
  finance: "Finance",
  pnl: "Profit & Loss",
  integrations: "Integrations",
  auth: "Auth",
  login: "Login",
  register: "Register",
  profile: "Profile",
  "forgot-password": "Forgot Password",
}

export function Breadcrumbs() {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)

  if (segments.length === 0) return null

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-xs text-muted-foreground/60">
      <Link href="/" className="transition-colors hover:text-foreground">Home</Link>
      {segments.map((segment, i) => {
        const href = "/" + segments.slice(0, i + 1).join("/")
        const label = routeLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1)
        const isLast = i === segments.length - 1
        return (
          <span key={href} className="flex items-center gap-1">
            <ChevronRight className="size-3 text-muted-foreground/30" />
            {isLast ? (
              <span className="font-medium text-foreground/70">{label}</span>
            ) : (
              <Link href={href} className="transition-colors hover:text-foreground">{label}</Link>
            )}
          </span>
        )
      })}
    </nav>
  )
}