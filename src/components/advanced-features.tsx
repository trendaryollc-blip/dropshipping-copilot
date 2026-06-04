"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Zap,
  TrendingUp,
  Users,
  Code,
  FileText,
  Plus,
  Edit,
  Trash2,
  Share2,
  Download,
  Copy,
  Eye,
  EyeOff,
} from "lucide-react"
import { toast } from "sonner"

// ─── Onboarding Component ────────────────────────────────────────────────
export function OnboardingWizard() {
  const [completedSteps, setCompletedSteps] = useState<string[]>(["profile", "stores"])
  const steps = [
    { id: "profile", title: "Profile", icon: "👤" },
    { id: "stores", title: "Stores", icon: "🏪" },
    { id: "suppliers", title: "Suppliers", icon: "📦" },
    { id: "first_product", title: "First Product", icon: "🎯" },
    { id: "automation", title: "Automation", icon: "⚙️" },
  ]

  const completion = (completedSteps.length / steps.length) * 100

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Get Started</h3>
          <div className="w-full bg-muted rounded-full h-2">
            <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${completion}%` }} />
          </div>
        <p className="text-xs text-muted-foreground mt-2">{Math.round(completion)}% Complete</p>
      </div>

      <div className="flex justify-between gap-2">
        {steps.map((step) => (
          <div
            key={step.id}
            className={`flex-1 p-3 rounded-lg text-center transition-all ${
              completedSteps.includes(step.id) ? "bg-success-light" : "bg-muted"
            }`}
          >
            <div className="text-xl mb-1">{step.icon}</div>
            <p className="text-xs font-medium">{step.title}</p>
            {completedSteps.includes(step.id) && <p className="text-xs text-green-600">✓</p>}
          </div>
        ))}
      </div>
    </Card>
  )
}

// ─── Product Variants Component ──────────────────────────────────────────
export function ProductVariants() {
  const [variants, setVariants] = useState([
    { type: "Size", options: "S, M, L, XL", inventory: 48 },
    { type: "Color", options: "Red, Blue, Black", inventory: 36 },
  ])

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold">Product Variants</h3>
        <Dialog>
          <DialogTrigger
            render={
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Variant
              </Button>
            }
          />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Product Variant</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input placeholder="Variant Type (e.g., Size, Color)" />
              <Input placeholder="Options (comma-separated)" />
              <Button className="w-full">Create Variant</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {variants.map((variant, i) => (
          <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <p className="font-medium text-sm">{variant.type}</p>
              <p className="text-xs text-muted-foreground">{variant.options}</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline">{variant.inventory} total</Badge>
              <Button size="sm" variant="ghost">
                Edit
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

// ─── Discounts & Coupons Component ──────────────────────────────────────
export function DiscountsManager() {
  const [coupons, setCoupons] = useState([
    { code: "SAVE10", discount: "10%", uses: "45/100", status: "active" },
    { code: "SPRING20", discount: "$20", uses: "12/50", status: "active" },
  ])

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold">Coupons & Discounts</h3>
        <Dialog>
          <DialogTrigger
            render={
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Create Coupon
              </Button>
            }
          />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Coupon</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input placeholder="Coupon Code" />
              <Input placeholder="Discount Value" />
              <Input type="number" placeholder="Max Uses" />
              <Button className="w-full">Create Coupon</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {coupons.map((coupon) => (
          <div key={coupon.code} className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <p className="font-mono font-semibold">{coupon.code}</p>
              <p className="text-sm text-muted-foreground">{coupon.discount} off • {coupon.uses} used</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge>{coupon.status}</Badge>
              <Button size="sm" variant="ghost">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

// ─── Market Insights Component ──────────────────────────────────────────
export function MarketInsights() {
  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-6 flex items-center gap-2">
        <TrendingUp className="h-5 w-5" />
        Market Insights
      </h3>

      <Tabs defaultValue="trends" className="w-full">
        <TabsList>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="competitors">Competitors</TabsTrigger>
          <TabsTrigger value="seasons">Seasonality</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-4 mt-4">
          <div className="p-3 border rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Wireless Earbuds</p>
                <p className="text-xs text-muted-foreground">5.2K searches/week • ↗ 87% momentum</p>
              </div>
              <Badge className="bg-success-light text-success">Hot</Badge>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="competitors" className="space-y-4 mt-4">
          <div className="text-sm text-muted-foreground">Top competitors monitoring your product</div>
          {["Amazon", "eBay", "Etsy"].map((comp) => (
            <div key={comp} className="p-3 border rounded-lg">
              <p className="font-medium text-sm">{comp}</p>
              <p className="text-xs text-muted-foreground">Price: $24.99 • 45% market share</p>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="seasons" className="space-y-4 mt-4">
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((m) => (
              <div key={m} className="p-2 bg-blue-50 rounded">
                <p className="font-medium">{m}</p>
                <p className="text-muted-foreground">High</p>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  )
}

// ─── Team Collaboration Component ───────────────────────────────────────
export function TeamCollaboration() {
  const [members, setMembers] = useState([
    { name: "John Doe", email: "john@example.com", role: "Admin" },
    { name: "Jane Smith", email: "jane@example.com", role: "Manager" },
  ])

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold flex items-center gap-2">
          <Users className="h-5 w-5" />
          Team Members
        </h3>
        <Dialog>
          <DialogTrigger
            render={
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Invite
              </Button>
            }
          />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite Team Member</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input placeholder="Email Address" />
              <select className="w-full border rounded-md p-2">
                <option>Admin</option>
                <option>Manager</option>
                <option>Viewer</option>
              </select>
              <Button className="w-full">Send Invite</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {members.map((member) => (
          <div key={member.email} className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <p className="font-medium text-sm">{member.name}</p>
              <p className="text-xs text-muted-foreground">{member.email}</p>
            </div>
            <Badge variant="outline">{member.role}</Badge>
          </div>
        ))}
      </div>
    </Card>
  )
}

// ─── REST API Component ─────────────────────────────────────────────────
export function RestAPIManager() {
  const [showSecret, setShowSecret] = useState(false)

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold flex items-center gap-2">
          <Code className="h-5 w-5" />
          REST API
        </h3>
        <Button size="sm" variant="outline">
          Regenerate Keys
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-xs font-medium">API Key</label>
          <div className="flex items-center gap-2 mt-2">
            <input
              type="text"
              value="sk_live_abc123def456..."
              readOnly
              className="flex-1 px-3 py-2 border rounded-md text-sm font-mono"
            />
            <Button size="sm" variant="outline">
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div>
          <label className="text-xs font-medium">Secret Key</label>
          <div className="flex items-center gap-2 mt-2">
            <input
              type={showSecret ? "text" : "password"}
              value="sk_secret_xyz789..."
              readOnly
              className="flex-1 px-3 py-2 border rounded-md text-sm font-mono"
            />
            <Button size="sm" variant="outline" onClick={() => setShowSecret(!showSecret)}>
              {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
            <Button size="sm" variant="outline">
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Button variant="outline" className="w-full">
          View API Documentation
        </Button>
      </div>
    </Card>
  )
}

// ─── Custom Reports Component ──────────────────────────────────────────
export function CustomReports() {
  const [reports, setReports] = useState([
    { name: "Monthly Sales Report", frequency: "Monthly", nextRun: "2024-02-01" },
    { name: "Product Performance", frequency: "Weekly", nextRun: "2024-01-22" },
  ])

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Automated Reports
        </h3>
        <Dialog>
          <DialogTrigger
            render={
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Create Report
              </Button>
            }
          />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Automated Report</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input placeholder="Report Name" />
              <select className="w-full border rounded-md p-2">
                <option>Weekly</option>
                <option>Monthly</option>
                <option>Quarterly</option>
              </select>
              <Input placeholder="Email Recipients (comma-separated)" />
              <Button className="w-full">Schedule Report</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {reports.map((report, i) => (
          <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <p className="font-medium text-sm">{report.name}</p>
              <p className="text-xs text-muted-foreground">{report.frequency} • Next: {report.nextRun}</p>
            </div>
            <Button size="sm" variant="ghost">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </Card>
  )
}

// ─── Integrations Component ────────────────────────────────────────────
export function IntegrationManager() {
  const [integrations, setIntegrations] = useState([
    { platform: "Shopify", connected: true, products: 245 },
    { platform: "Amazon", connected: false, products: 0 },
    { platform: "Facebook", connected: true, products: 0 },
  ])

  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-6 flex items-center gap-2">
        <Share2 className="h-5 w-5" />
        Platform Integrations
      </h3>

      <div className="space-y-3">
        {integrations.map((integ) => (
          <div key={integ.platform} className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <p className="font-medium text-sm">{integ.platform}</p>
              {integ.connected && <p className="text-xs text-muted-foreground">{integ.products} products synced</p>}
            </div>
            {integ.connected ? (
              <Badge className="bg-success-light text-success">Connected</Badge>
            ) : (
              <Button size="sm">Connect</Button>
            )}
          </div>
        ))}
      </div>
    </Card>
  )
}
