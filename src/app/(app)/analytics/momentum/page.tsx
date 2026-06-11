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
import { Search, BarChart2, DollarSign, ShoppingCart, Users, TrendingUp, Clock, ArrowUpRight, ArrowDownRight, ArrowUpLeft } from "lucide-react"
import { AIInsightsPanel } from "@/components/dashboard/AIInsightsPanel"
import { toast } from "sonner"

export default function MomentumPage() {
  const { products, getProducts } = useAppStore()
  const { isAuthenticated } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) {
      getProducts()
    }
  }, [isAuthenticated])

  // Mock momentum data
  const mockMomentum = {
    weeklyRevenueGrowth: 18,
    topProduct: {
      name: "Wireless Earbuds Pro",
      category: "Electronics",
      conversionRate: 0.085,
      sales: 423
    },
    customerFavorites: [
      { category: "Beauty & Wellness", repeatRate: 0.72 },
      { category: "Home Goods", repeatRate: 0.68 },
      { category: "Electronics", repeatRate: 0.65 }
    ],
    topSuppliers: [
      { name: "TechSupplies Inc", performanceScore: 92 },
      { name: "HomeFurnish Co", performanceScore: 88 },
      { name: "BeautyEssentials", performanceScore: 90 }
    ]
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Weekly Momentum</h1>
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard")}
        >
          Back to Dashboard
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <AIInsightsPanel
          title="Revenue Growth"
          description="Weekly revenue growth"
          value={`${mockMomentum.weeklyRevenueGrowth}%`}
          trend="↑ 18%"
          icon={<ArrowUpRight className="h-4 w-4 text-primary" />}
          trendColor="success"
        />
        <AIInsightsPanel
          title="Conversion Rate"
          description="Top product conversion rate"
          value={`${mockMomentum.topProduct.conversionRate * 100}%`}
          trend="↑ 8.5%"
          icon={<TrendingUp className="h-4 w-4 text-primary" />}
          trendColor="success"
        />
        <AIInsightsPanel
          title="Repeat Customers"
          description="Customer repeat rate"
          value={`${mockMomentum.customerFavorites[0].repeatRate * 100}%`}
          trend="↑ 72%"
          icon={<Users className="h-4 w-4 text-primary" />}
          trendColor="success"
        />
        <AIInsightsPanel
          title="Supplier Performance"
          description="Top supplier performance"
          value={`${mockMomentum.topSuppliers[0].performanceScore}/100`}
          trend="↑ 92%"
          icon={<ShoppingCart className="h-4 w-4 text-primary" />}
          trendColor="success"
        />
      </div>

      <Tabs defaultValue="revenue" className="mt-6">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3">
          <TabsTrigger value="revenue">Revenue Growth</TabsTrigger>
          <TabsTrigger value="products">Top Products</TabsTrigger>
          <TabsTrigger value="customers">Customer Favorites</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Growth Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Weekly Revenue Growth</span>
                  <span className="text-lg font-bold">{mockMomentum.weeklyRevenueGrowth}%</span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">Revenue climbed 18% this week, driven by electronics and home goods.</p>
                <div className="h-2 bg-muted rounded-full">
                  <div className="h-full bg-primary rounded-full" style={{ width: '95%' }}></div>
                </div>
              </div>

              <div className="rounded-md border mt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead>Growth</TableHead>
                      <TableHead>Contribution</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Electronics</TableCell>
                      <TableCell>22%</TableCell>
                      <TableCell>45%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Home Goods</TableCell>
                      <TableCell>15%</TableCell>
                      <TableCell>30%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Beauty & Wellness</TableCell>
                      <TableCell>10%</TableCell>
                      <TableCell>15%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Other</TableCell>
                      <TableCell>5%</TableCell>
                      <TableCell>10%</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold">Top product pick</h3>
                  <Badge variant="secondary">{mockMomentum.topProduct.name}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">Wireless Earbuds Pro remains the highest converting product.</p>
              </div>

              <div className="rounded-md border mt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Conversion Rate</TableHead>
                      <TableHead>Sales</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>{mockMomentum.topProduct.name}</TableCell>
                      <TableCell>{mockMomentum.topProduct.category}</TableCell>
                      <TableCell>{mockMomentum.topProduct.conversionRate * 100}%</TableCell>
                      <TableCell>{mockMomentum.topProduct.sales}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers">
          <Card>
            <CardHeader>
              <CardTitle>Customer Favorites</CardTitle>
            </CardHeader>
            <CardContent>
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">Customer favorite</h3>
          <Badge variant="secondary">Beauty & Wellness</Badge>
        </div>
        <p className="text-sm text-muted-foreground">Beauty and wellness products show the strongest repeat demand.</p>
      </div>

              <div className="rounded-md border mt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead>Repeat Rate</TableHead>
                      <TableHead>Sales Volume</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockMomentum.customerFavorites.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>{item.repeatRate * 100}%</TableCell>
                        <TableCell>High</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Motivation</h3>
                <p className="text-sm text-muted-foreground">Keep optimizing your top 3 suppliers and automate follow-up funnels.</p>
                <div className="mt-3">
                  <h4 className="font-medium text-sm mb-2">Top Suppliers to Optimize:</h4>
                  <div className="space-y-2">
                    {mockMomentum.topSuppliers.map((supplier, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-background rounded">
                        <span className="text-sm">{supplier.name}</span>
                        <span className="text-sm font-medium">{supplier.performanceScore}/100</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}