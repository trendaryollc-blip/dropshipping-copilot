"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppStore } from "@/store/useAppStore"
import { useAuthStore } from "@/store/useAuthStore"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, TrendingUp, AlertCircle, DollarSign, Package } from "lucide-react"
import { InsightPanel } from "@/components/dashboard/InsightPanel"
import { toast } from "sonner"

export default function TrendingProductsPage() {
  const { products } = useAppStore()
  const { isAuthenticated } = useAuthStore()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login")
    }
  }, [isAuthenticated, router])

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.supplierName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Sort by trend score descending
  const trendingProducts = [...filteredProducts].sort((a, b) => b.trendScore - a.trendScore)

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Trending Products</h1>
        <Button
          variant="outline"
          onClick={() => router.push("/products")}
        >
          View All Products
        </Button>
      </div>

      {/* Insights Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <InsightPanel
          title="Trending Products"
          description="Products with highest trend scores"
          value={trendingProducts.length.toString()}
          trend="↑ 15.2%"
          icon={<TrendingUp className="h-4 w-4 text-primary" />}
        />
      </div>

      {/* Search and Table */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search trending products..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Trending Products List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Trend Score</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trendingProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-muted-foreground">{product.description || "No description"}</div>
                    </TableCell>
                    <TableCell>{product.supplierName}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold">{product.trendScore}</span>
                        <Badge variant="secondary">
                          {product.trendScore > 70 ? "High" : product.trendScore > 50 ? "Medium" : "Low"}
                        </Badge>
                      </div>
                    </TableCell>
                  <TableCell>${product.price?.toFixed(2) || 'N/A'}</TableCell>
                  <TableCell>N/A</TableCell>
                  <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => router.push(`/products/${product.id}`)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}