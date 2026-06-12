"use client"

import { useEffect, useState } from "react"
import { Users, Package, Globe, Star, AlertCircle, Clock, DollarSign, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { useParams } from "next/navigation"
import { useProducts, useSuppliers } from "@/hooks/useData"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

export default function SupplierDetailPage() {
  const params = useParams()
  const supplierId = Array.isArray(params.id) ? params.id[0] : params.id ?? ""
  const { products } = useProducts()
  const { suppliers, loading: suppliersLoading } = useSuppliers()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(suppliersLoading)
  }, [suppliersLoading])

  // Resolve supplier by id
  const supplier = suppliers.find((s) => String(s.id) === supplierId)
  const supplierName = supplier?.name || supplierId

  // Filter products by supplier name
  const supplierProducts = products.filter((p) => p.supplierName === supplierName)

  // Calculate metrics
  const totalProducts = supplierProducts.length
  const totalPrice = supplierProducts.reduce((sum, p) => sum + (p.price || 0), 0)
  const averagePrice = totalProducts > 0 ? totalPrice / totalProducts : 0
  const averageTrendScore = totalProducts > 0 ? supplierProducts.reduce((sum, p) => sum + (p.trendScore || 0), 0) / totalProducts : 0

  const [integrationTab, setIntegrationTab] = useState<"status" | "automation" | "logs">("status")
  const [autoOrderEnabled, setAutoOrderEnabled] = useState(true)
  const [connectionState, setConnectionState] = useState("Connected")
  const [lastSync, setLastSync] = useState("8 minutes ago")
  const [lastInventorySync, setLastInventorySync] = useState("12 minutes ago")
  const [lastPriceSync, setLastPriceSync] = useState("20 minutes ago")
  const [healthStatus, setHealthStatus] = useState("All systems operational")
  const [recentLogs] = useState([
    { time: "2m ago", text: "Inventory sync completed successfully." },
    { time: "14m ago", text: "Price refresh run for 54 SKU updates." },
    { time: "1h ago", text: "Supplier connection verified." },
  ])

  if (isLoading) {
    return (
      <div className="space-y-4 p-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="size-14 rounded-2xl border border-border/20">
            <AvatarImage src={supplier?.avatar} alt={supplierName} />
            <AvatarFallback>{(supplierName || "?").slice(0,2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{supplierName}</h1>
            <p className="text-sm text-muted-foreground">{supplier?.country || "Unknown"} · {supplier?.responseTime || "N/A"} response</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {supplier?.verified && <Badge className="bg-emerald-500/10 text-emerald-600">Verified</Badge>}
          <Badge className="bg-primary/10 text-primary">{totalProducts} products</Badge>
          <Button onClick={() => toast.success(`Message sent to ${supplierName}`)}>Message</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Users className="h-6 w-6 text-primary" />
              <h3 className="text-lg font-semibold">Overview</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-amber-500" />
                <span className="text-sm font-medium">Products: {supplier?.totalProducts ?? totalProducts}</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Min Order: {supplier?.minOrder ?? "—"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-amber-400" />
                <span className="text-sm font-medium">Trust: {supplier?.trustScore ?? "—"}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Integration panel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 lg:grid-cols-[1.4fr_0.8fr]">
              <div className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-3xl border border-border/50 bg-card/50 p-4">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground/70">Connection</p>
                    <p className="mt-2 text-sm font-semibold text-foreground">{connectionState}</p>
                  </div>
                  <div className="rounded-3xl border border-border/50 bg-card/50 p-4">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground/70">Last sync</p>
                    <p className="mt-2 text-sm font-semibold text-foreground">{lastSync}</p>
                  </div>
                  <div className="rounded-3xl border border-border/50 bg-card/50 p-4">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground/70">Health</p>
                    <p className="mt-2 text-sm font-semibold text-foreground">{healthStatus}</p>
                  </div>
                </div>

                <Tabs defaultValue="status" value={integrationTab} onValueChange={(value) => setIntegrationTab(value as any)} className="space-y-4">
                  <TabsList className="grid w-full grid-cols-3 rounded-2xl border border-border/50 bg-card/40 p-1">
                    <TabsTrigger value="status">Status</TabsTrigger>
                    <TabsTrigger value="automation">Automation</TabsTrigger>
                    <TabsTrigger value="logs">Logs</TabsTrigger>
                  </TabsList>

                  <TabsContent value="status" className="space-y-4">
                    <div className="rounded-3xl border border-border/50 bg-card/50 p-4">
                      <p className="text-sm font-semibold text-foreground">Sync controls</p>
                      <p className="text-xs text-muted-foreground/70">Run these actions for the supplier integration.</p>
                      <div className="mt-4 grid gap-3 sm:grid-cols-3">
                        <Button onClick={() => toast.success('Connection test passed')} variant="secondary">Test connection</Button>
                        <Button onClick={() => { setLastInventorySync('just now'); toast.success('Inventory sync started') }} variant="outline">Sync inventory</Button>
                        <Button onClick={() => { setLastPriceSync('just now'); toast.success('Price sync started') }} variant="outline">Sync pricing</Button>
                      </div>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-3xl border border-border/50 bg-card/50 p-4">
                        <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground/70">Inventory sync</p>
                        <p className="mt-2 text-sm font-semibold text-foreground">{lastInventorySync}</p>
                      </div>
                      <div className="rounded-3xl border border-border/50 bg-card/50 p-4">
                        <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground/70">Price sync</p>
                        <p className="mt-2 text-sm font-semibold text-foreground">{lastPriceSync}</p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="automation" className="space-y-4">
                    <div className="rounded-3xl border border-border/50 bg-card/50 p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold text-foreground">Auto-order rules</p>
                          <p className="text-xs text-muted-foreground/70">Automatically place orders when stock is low.</p>
                        </div>
                        <Button
                          className="h-9"
                          onClick={() => {
                            setAutoOrderEnabled(!autoOrderEnabled)
                            toast.success(`Auto reorder ${autoOrderEnabled ? 'disabled' : 'enabled'}`)
                          }}
                        >
                          {autoOrderEnabled ? 'Disable' : 'Enable'}
                        </Button>
                      </div>
                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        <div className="rounded-2xl border border-border/20 bg-card p-3">
                          <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground/70">Threshold</p>
                          <p className="mt-2 text-sm font-semibold text-foreground">Reorder at 15 units</p>
                        </div>
                        <div className="rounded-2xl border border-border/20 bg-card p-3">
                          <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground/70">Preferred shipping</p>
                          <p className="mt-2 text-sm font-semibold text-foreground">DHL Express</p>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-3xl border border-border/50 bg-card/50 p-4">
                      <p className="text-sm font-semibold text-foreground">Field mapping</p>
                      <div className="mt-3 grid gap-2 text-xs text-muted-foreground">
                        <span className="rounded-xl border border-muted/20 bg-muted/5 px-3 py-2">Supplier SKU → Local SKU</span>
                        <span className="rounded-xl border border-muted/20 bg-muted/5 px-3 py-2">Supplier stock → Inventory</span>
                        <span className="rounded-xl border border-muted/20 bg-muted/5 px-3 py-2">Supplier price → Cost</span>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="logs" className="space-y-4">
                    <div className="rounded-3xl border border-border/50 bg-card/50 p-4">
                      <p className="text-sm font-semibold text-foreground">Recent integration activity</p>
                      <div className="mt-3 space-y-3">
                        {recentLogs.map((log) => (
                          <div key={log.time} className="rounded-2xl border border-border/20 bg-card p-3">
                            <p className="text-sm font-medium text-foreground">{log.text}</p>
                            <p className="text-xs text-muted-foreground/70">{log.time}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              <div className="rounded-3xl border border-border/50 bg-card/40 p-5">
                <div className="flex items-center gap-2">
                  <Globe className="size-4 text-primary" />
                  <p className="text-sm font-semibold text-foreground">Live supplier integration</p>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">Manage the supplier API, sync health, and automation rules directly from this panel.</p>
                <div className="mt-5 space-y-4">
                  <div className="rounded-2xl bg-card p-3 text-sm">
                    <p className="text-muted-foreground/70">Active endpoint</p>
                    <p className="mt-1 font-medium text-foreground">api.supplier-integration.dropease.com</p>
                  </div>
                  <div className="rounded-2xl bg-card p-3 text-sm">
                    <p className="text-muted-foreground/70">Next scheduled sync</p>
                    <p className="mt-1 font-medium text-foreground">In 23 minutes</p>
                  </div>
                  <div className="rounded-2xl bg-card p-3 text-sm">
                    <p className="text-muted-foreground/70">Error queue</p>
                    <p className="mt-1 font-medium text-foreground">0 issues</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Products from {supplierName}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Product</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Niche</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Price</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Trend</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Competition</th>
                </tr>
              </thead>
              <tbody>
                {supplierProducts.map((product) => (
                  <tr key={product.id} className="border-b hover:bg-card/40">
                    <td className="px-4 py-3">
                      <div className="font-medium">{product.name}</div>
                      <div className="text-xs text-muted-foreground">Imported {product.importedAt || 'N/A'}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{product.niche}</td>
                    <td className="px-4 py-3">${(product.price || 0).toFixed(2)}</td>
                    <td className="px-4 py-3">{product.trendScore ?? '—'}</td>
                    <td className="px-4 py-3">{product.competition || 'medium'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}