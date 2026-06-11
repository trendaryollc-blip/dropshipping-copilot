"use client"

import { useEffect, useState } from "react"
import { Users, Package, Globe, Search } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAppStore } from "@/store/useAppStore"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import Link from "next/link"

export default function SuppliersPage() {
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

  // Get unique suppliers from products
  const suppliers = [...new Set(products.map(p => p.supplierName || "Unknown"))]
    .filter(name => name)
    .sort()

  // Group products by supplier
  const productsBySupplier: Record<string, any[]> = {}
  products.forEach(product => {
    if (product.supplierName && !productsBySupplier[product.supplierName]) {
      productsBySupplier[product.supplierName] = []
    }
    if (product.supplierName) {
      productsBySupplier[product.supplierName].push(product)
    }
  })

  if (isLoading) {
    return (
      <div className="space-y-4 p-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
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
          <h1 className="text-2xl font-bold">Suppliers</h1>
          <p className="text-sm text-muted-foreground">Find reliable suppliers for your products</p>
        </div>
        <Badge className="bg-primary/10 text-primary">
          {suppliers.length} suppliers
        </Badge>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search suppliers..."
            className="flex-1 rounded-lg border border-border/30 bg-card/50 pl-8 pr-3 py-2 text-sm"
          />
        </div>

        <Tabs defaultValue="all" className="mt-4">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
            <TabsTrigger value="all">All Suppliers</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {suppliers.map((supplier) => (
                <Card key={supplier} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-4 w-4 text-primary" />
                      <span className="text-xs font-medium text-muted-foreground">
                        Supplier: {supplier}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <Package className="h-4 w-4 text-amber-500" />
                      <span className="text-xs font-medium text-muted-foreground">
                        Products: {productsBySupplier[supplier]?.length || 0}
                      </span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <h3 className="font-semibold text-foreground">{supplier}</h3>
                      <p className="text-xs text-muted-foreground">
                        {productsBySupplier[supplier]?.length || 0} products available
                      </p>
                      <Link
                        href={`/suppliers/${supplier}`}
                        className="mt-2 inline-flex items-center gap-1 text-sm text-primary hover:underline"
                      >
                        View Supplier
                        <Globe className="h-3 w-3" />
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}