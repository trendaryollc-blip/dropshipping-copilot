"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppStore } from "@/store/useAppStore"
import { useAuthStore } from "@/store/useAuthStore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Search, TrendingUp, AlertCircle, DollarSign, Package } from "lucide-react"
import { AIInsightsPanel } from "@/components/dashboard/AIInsightsPanel"
import { toast } from "sonner"

export default function ProductsPage() {
  const { products, getProducts, loading, error } = useAppStore()
  const { isAuthenticated } = useAuthStore()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    if (isAuthenticated) {
      getProducts()
    }
  }, [isAuthenticated])

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.supplierName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Calculate trends with fallback values
  const calculateTrend = (current: number, base: number = 20) => {
    return current > 0 ? `↑ ${Math.floor((current - base) / base * 10)}%` : "N/A"
  }

  if (loading) {
    return <div className="p-6">Loading products...</div>
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button
          onClick={() => router.push("/products/add")}
          className="flex items-center gap-2"
        >
          <Plus className="size-4" />
          Add Product
        </Button>
      </div>

      {/* Insights Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <AIInsightsPanel
          title="Total Products"
          description="Total products in your catalog"
          value={products.length.toString()}
          trend={calculateTrend(products.length)}
          icon={<Package className="h-4 w-4 text-primary" />}
        />
        <AIInsightsPanel
          title="Active Products"
          description="Products with active status"
          value={products.filter(p => p.status === "active").length.toString()}
          trend={calculateTrend(products.filter(p => p.status === "active").length)}
          icon={<TrendingUp className="h-4 w-4 text-primary" />}
        />
        <AIInsightsPanel
          title="Low Stock"
          description="Products with low stock"
          value={products.filter(p => p.stock && p.stock < 10).length.toString()}
          trend={calculateTrend(products.filter(p => p.stock && p.stock < 10).length)}
          icon={<AlertCircle className="h-4 w-4 text-primary" />}
        />
      </div>

      {/* Search and Table */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search products..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-muted-foreground">{product.description || "No description"}</div>
                    </TableCell>
                    <TableCell>{product.supplierName}</TableCell>
                    <TableCell>${product.price?.toFixed(2) || 'N/A'}</TableCell>
                    <TableCell>{product.stock !== undefined ? product.stock : 'N/A'}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.status === "active" ? "bg-green-100 text-green-800" :
                        product.status === "draft" || product.status === "archived" ? "bg-gray-100 text-gray-800" :
                        "bg-yellow-100 text-yellow-800"
                      }`}>
                        {product.status}
                      </span>
                    </TableCell>
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