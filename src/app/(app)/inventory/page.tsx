"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppStore } from "@/store/useAppStore"
import { useAuthStore } from "@/store/useAuthStore"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Package, AlertTriangle, TrendingUp, TrendingDown, ArrowUp, ArrowDown, Search, Plus } from "lucide-react"
import { toast } from "sonner"

export default function InventoryPage() {
  const { products, getProducts } = useAppStore()
  const { isAuthenticated } = useAuthStore()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [lowStockThreshold, setLowStockThreshold] = useState(10)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isAuthenticated) {
      const fetchData = async () => {
        try {
          setLoading(true)
          await getProducts()
        } catch (error) {
          toast.error("Failed to load inventory data")
        } finally {
          setLoading(false)
        }
      }
      fetchData()
    }
  }, [isAuthenticated, getProducts])

  // Filter products based on search term
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.niche.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.supplierName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Calculate inventory metrics
  const totalProducts = filteredProducts.length
  const lowStockProducts = filteredProducts.filter(p => (p.stock || 0) <= lowStockThreshold)
  const outOfStockProducts = filteredProducts.filter(p => (p.stock || 0) === 0)
  const totalStockValue = filteredProducts.reduce((sum, p) => sum + ((p.stock || 0) * (p.price || 0)), 0)

  // Categorize products by stock level
  const getStockStatus = (stock: number) => {
    if (stock === 0) return { text: "Out of Stock", variant: "destructive" as const }
    if (stock <= lowStockThreshold) return { text: "Low Stock", variant: "warning" as const }
    return { text: "In Stock", variant: "success" as const }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Inventory Management</h1>
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard")}
        >
          Back to Dashboard
        </Button>
      </div>

      {/* Inventory Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Total Products</p>
                <p className="text-2xl font-bold">{totalProducts}</p>
              </div>
              <Package className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Low Stock Items</p>
                <p className="text-2xl font-bold">{lowStockProducts.length}</p>
              </div>
              <AlertTriangle className="h-6 w-6 text-amber-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Out of Stock</p>
                <p className="text-2xl font-bold">{outOfStockProducts.length}</p>
              </div>
              <AlertTriangle className="h-6 w-6 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Total Stock Value</p>
                <p className="text-2xl font-bold">${totalStockValue.toFixed(2)}</p>
              </div>
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Low Stock Threshold:</span>
          <input
            type="number"
            min="1"
            value={lowStockThreshold}
            onChange={(e) => setLowStockThreshold(Number(e.target.value))}
            className="w-16 px-3 py-2 border rounded-md text-center"
          />
        </div>
      </div>

      <Tabs defaultValue="all" className="mt-6">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-4">
          <TabsTrigger value="all">All Products ({totalProducts})</TabsTrigger>
          <TabsTrigger value="low">Low Stock ({lowStockProducts.length})</TabsTrigger>
          <TabsTrigger value="out">Out of Stock ({outOfStockProducts.length})</TabsTrigger>
          <TabsTrigger value="trending">Trending Products</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <InventoryTable products={filteredProducts} getStockStatus={getStockStatus} />
        </TabsContent>

        <TabsContent value="low">
          <InventoryTable products={lowStockProducts} getStockStatus={getStockStatus} />
        </TabsContent>

        <TabsContent value="out">
          <InventoryTable products={outOfStockProducts} getStockStatus={getStockStatus} />
        </TabsContent>

        <TabsContent value="trending">
          <InventoryTable
            products={filteredProducts.filter(p => p.trendScore > 70).sort((a, b) => b.trendScore - a.trendScore)}
            getStockStatus={getStockStatus}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function InventoryTable({ products, getStockStatus }) {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Niche</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Trend Score</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Supplier</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length > 0 ? (
              products.map((product) => (
                <TableRow key={product.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div className="font-medium">{product.name}</div>
                    <div className="text-xs text-muted-foreground">{product.id}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{product.niche}</Badge>
                  </TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>${product.price?.toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {product.trendScore > 70 ? (
                        <ArrowUp className="h-4 w-4 text-green-500" />
                      ) : product.trendScore < 40 ? (
                        <ArrowDown className="h-4 w-4 text-red-500" />
                      ) : (
                        <span className="h-4 w-4" />
                      )}
                      <span>{product.trendScore}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStockStatus(product.stock).variant}>
                      {getStockStatus(product.stock).text}
                    </Badge>
                  </TableCell>
                  <TableCell>{product.supplierName}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  No products found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}