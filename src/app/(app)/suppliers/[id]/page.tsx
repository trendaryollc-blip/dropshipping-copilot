"use client"

import { useEffect, useState } from "react"
import { Users, Package, Globe, Star, AlertCircle, Clock, DollarSign, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAppStore } from "@/store/useAppStore"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { useParams } from "next/navigation"

export default function SupplierDetailPage() {
  const { id } = useParams()
  const { products, loadFromFirestore } = useAppStore()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        await loadFromFirestore()
      } catch (error) {
        toast.error("Failed to load supplier data")
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [loadFromFirestore])

  // Filter products by supplier
  const supplierProducts = products.filter(p => p.supplierName === id)

  // Calculate metrics
  const totalProducts = supplierProducts.length
  const totalPrice = supplierProducts.reduce((sum, p) => sum + (p.price || 0), 0)
  const averagePrice = totalProducts > 0 ? totalPrice / totalProducts : 0
  const averageTrendScore = supplierProducts.reduce((sum, p) => sum + (p.trendScore || 0), 0) / totalProducts

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Supplier: {id}</h1>
          <p className="text-sm text-muted-foreground">Product details and performance metrics</p>
        </div>
        <Badge className="bg-primary/10 text-primary">
          {totalProducts} products
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Supplier Overview Card */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Users className="h-6 w-6 text-primary" />
              <h3 className="text-lg font-semibold">Supplier Overview</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-amber-500" />
                <span className="text-sm font-medium">Products: {totalProducts}</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Avg Price: ${averagePrice.toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-amber-400" />
                <span className="text-sm font-medium">Avg Trend Score: {averageTrendScore.toFixed(1)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product List */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Products from {id}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Product Name</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Niche</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Price</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Trend Score</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Competition</th>
                  </tr>
                </thead>
                <tbody>
                  {supplierProducts.map((product) => (
                    <tr key={product.id} className="border-b">
                      <td className="px-4 py-3">
                        <div className="font-medium">{product.name}</div>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {product.niche}
                      </td>
                      <td className="px-4 py-3">
                        ${(product.price || 0).toFixed(2)}
                      </td>
                      <td className="px-4 py-3">
                        {product.trendScore || 0}
                      </td>
                      <td className="px-4 py-3">
                        {product.competition || "medium"}
                      </td>
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