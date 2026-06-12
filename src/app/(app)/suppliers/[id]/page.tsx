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
  const { id } = useParams()
  const { products } = useProducts()
  const { suppliers, loading: suppliersLoading } = useSuppliers()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(suppliersLoading)
  }, [suppliersLoading])

  // Resolve supplier by id
  const supplier = suppliers.find((s) => String(s.id) === String(id))
  const supplierName = supplier?.name || id

  // Filter products by supplier name
  const supplierProducts = products.filter((p) => p.supplierName === supplierName)

  // Calculate metrics
  const totalProducts = supplierProducts.length
  const totalPrice = supplierProducts.reduce((sum, p) => sum + (p.price || 0), 0)
  const averagePrice = totalProducts > 0 ? totalPrice / totalProducts : 0
  const averageTrendScore = totalProducts > 0 ? supplierProducts.reduce((sum, p) => sum + (p.trendScore || 0), 0) / totalProducts : 0

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
    </div>
  )
}