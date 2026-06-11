"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppStore } from "@/store/useAppStore"
import { useAuthStore } from "@/store/useAuthStore"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, BarChart2, DollarSign, ShoppingCart, Users, TrendingUp, Clock, ArrowUpRight } from "lucide-react"
import { AIInsightsPanel } from "@/components/dashboard/AIInsightsPanel"
import { toast } from "sonner"

export default function AnalyticsPage() {
  const { products, users, getProducts, getUsers } = useAppStore()
  const { isAuthenticated } = useAuthStore()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    if (isAuthenticated) {
      getProducts()
      getUsers()
    }
  }, [isAuthenticated])

  // Mock analytics data
  const mockAnalytics = {
    revenue: 12456.78,
    conversionRate: 0.035,
    avgOrderValue: 78.23,
    customerAcquisitionCost: 12.50,
    returnRate: 0.037,
    activeCustomers: 342,
    totalOrders: 187,
    totalProducts: 42,
    activeProducts: 35,
    lowStock: 12,
    trendingProducts: 15
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard")}
        >
          Back to Dashboard
        </Button>
      </div>

      {/* Search and Insights */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search analytics..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <AIInsightsPanel
          title="Total Revenue"
          description="Total sales for this month"
          value={`$${mockAnalytics.revenue.toFixed(2)}`}
          trend="↑ 12.5%"
          icon={<DollarSign className="h-4 w-4 text-primary" />}
        />
        <AIInsightsPanel
          title="Conversion Rate"
          description="Average order value"
          value={`${mockAnalytics.conversionRate * 100}%`}
          trend="↑ 3.1%"
          icon={<TrendingUp className="h-4 w-4 text-primary" />}
        />
        <AIInsightsPanel
          title="Average Order Value"
          description="Average order value"
          value={`$${mockAnalytics.avgOrderValue.toFixed(2)}`}
          trend="↑ 2.3%"
          icon={<ShoppingCart className="h-4 w-4 text-primary" />}
        />
        <AIInsightsPanel
          title="Customer Acquisition Cost"
          description="Cost to acquire a customer"
          value={`$${mockAnalytics.customerAcquisitionCost.toFixed(2)}`}
          trend="↓ 1.5%"
          icon={<Users className="h-4 w-4 text-primary" />}
        />
      </div>

      {/* Tabs Content */}
      <Tabs defaultValue="overview" className="mt-6">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Business Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Total Customers</span>
                    <span className="text-lg font-bold">{mockAnalytics.activeCustomers}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full">
                    <div className="h-full bg-primary rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Total Orders</span>
                    <span className="text-lg font-bold">{mockAnalytics.totalOrders}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full">
                    <div className="h-full bg-primary rounded-full" style={{ width: '70%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Total Products</span>
                    <span className="text-lg font-bold">{mockAnalytics.totalProducts}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full">
                    <div className="h-full bg-primary rounded-full" style={{ width: '90%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Active Products</span>
                    <span className="text-lg font-bold">{mockAnalytics.activeProducts}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full">
                    <div className="h-full bg-primary rounded-full" style={{ width: '80%' }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Monthly Revenue</span>
                    <span className="text-lg font-bold">${mockAnalytics.revenue.toFixed(2)}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full">
                    <div className="h-full bg-primary rounded-full" style={{ width: '95%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Return Rate</span>
                    <span className="text-lg font-bold">{mockAnalytics.returnRate * 100}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full">
                    <div className="h-full bg-destructive rounded-full" style={{ width: '35%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Conversion Rate</span>
                    <span className="text-lg font-bold">{mockAnalytics.conversionRate * 100}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full">
                    <div className="h-full bg-primary rounded-full" style={{ width: '70%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Customer Acquisition Cost</span>
                    <span className="text-lg font-bold">${mockAnalytics.customerAcquisitionCost.toFixed(2)}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full">
                    <div className="h-full bg-primary rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Product Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Trending Products</span>
                  <span className="text-lg font-bold">{mockAnalytics.trendingProducts}</span>
                </div>
                <div className="h-2 bg-muted rounded-full">
                  <div className="h-full bg-primary rounded-full" style={{ width: '80%' }}></div>
                </div>
              </div>

              <div className="rounded-md border mt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Supplier</TableHead>
                      <TableHead>Trend Score</TableHead>
                      <TableHead>Sales</TableHead>
                      <TableHead>Stock</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts
                      .sort((a, b) => b.trendScore - a.trendScore)
                      .slice(0, 5)
                      .map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>{product.name}</TableCell>
                          <TableCell>{product.supplierName}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-bold">{product.trendScore}</span>
                              <Badge variant="secondary">
                                {product.trendScore > 70 ? "High" : product.trendScore > 50 ? "Medium" : "Low"}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>N/A</TableCell>
                          <TableCell>{product.stock || 'N/A'}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}