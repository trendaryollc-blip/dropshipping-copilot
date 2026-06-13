"use client"

import { useState } from "react"
import Link from "next/link"
import { BarChart3, TrendingUp, DollarSign, ShoppingCart, Users, Package, Target, Calendar, Clock, Download, RefreshCw, Eye, AlertTriangle, CheckCircle, ArrowUpRight, ArrowDownRight, Zap, Sparkles, Globe, ExternalLink } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { AIInsightsPanel } from "@/components/dashboard/AIInsightsPanel"

const analyticsSections = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "revenue", label: "Revenue", icon: DollarSign },
  { id: "orders", label: "Orders", icon: ShoppingCart },
  { id: "products", label: "Products", icon: Package },
  { id: "customers", label: "Customers", icon: Users },
  { id: "performance", label: "Performance", icon: TrendingUp },
]

const mockRevenueData = [
  { period: "Jan", revenue: 12500, orders: 142, growth: 12 },
  { period: "Feb", revenue: 15600, orders: 168, growth: 25 },
  { period: "Mar", revenue: 18900, orders: 192, growth: 21 },
  { period: "Apr", revenue: 22100, orders: 215, growth: 17 },
  { period: "May", revenue: 25400, orders: 248, growth: 15 },
  { period: "Jun", revenue: 28700, orders: 287, growth: 13 },
]

const mockTopProducts = [
  { id: "1", name: "Wireless Earbuds Pro", sales: 423, revenue: "$12,690", margin: "42%", trend: "up" },
  { id: "2", name: "Minimalist Watch Band", sales: 312, revenue: "$7,800", margin: "38%", trend: "up" },
  { id: "3", name: "LED Desk Lamp", sales: 256, revenue: "$8,960", margin: "45%", trend: "stable" },
  { id: "4", name: "Foldable Travel Bag", sales: 189, revenue: "$5,670", margin: "35%", trend: "down" },
]

const mockCustomerMetrics = [
  { segment: "High Value", count: 87, percentage: 15, avgOrder: "$127" },
  { segment: "Regular", count: 234, percentage: 42, avgOrder: "$64" },
  { segment: "New", count: 156, percentage: 28, avgOrder: "$42" },
  { segment: "Inactive", count: 123, percentage: 25, avgOrder: "$0" },
]

export default function AnalyticsPage() {
  const [activeSection, setActiveSection] = useState("overview")
  const [dateRange, setDateRange] = useState("7d")

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl border border-border/50 bg-card/60 p-6 backdrop-blur-sm sm:p-8 animate-in">
        <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-violet-500/5 blur-3xl" />
        <div className="absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-primary/5 blur-2xl" />

        <div className="relative z-10 flex flex-col gap-4">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-violet-600 dark:text-violet-400">
              <BarChart3 className="size-3" />
              Analytics
            </span>
            <h1 className="hero-title">Analytics Dashboard</h1>
            <p className="max-w-lg text-sm leading-relaxed text-muted-foreground/70">
              Monitor your store performance, customer insights, and sales trends in real-time.
            </p>
          </div>
        </div>
      </section>

      {/* Date Range Filter */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {analyticsSections.map((section) => {
            const Icon = section.icon
            return (
              <Button
                key={section.id}
                variant={activeSection === section.id ? "default" : "ghost"}
                className={`h-9 px-3 text-xs ${activeSection === section.id ? "" : "text-muted-foreground"}`}
                onClick={() => setActiveSection(section.id)}
              >
                <Icon className="size-3.5 mr-1.5" />
                {section.label}
              </Button>
            )
          })}
        </div>
        <div className="flex items-center gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-32 h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" className="h-8 w-8">
            <Download className="size-3.5" />
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      {activeSection === "overview" && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <DollarSign className="size-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$28,700</div>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <ArrowUpRight className="size-3 text-emerald-500" />
                  +13% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <div className="flex size-8 items-center justify-center rounded-lg bg-success/10 text-success">
                  <ShoppingCart className="size-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">287</div>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <ArrowUpRight className="size-3 text-emerald-500" />
                  +13% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Order Value</CardTitle>
                <div className="flex size-8 items-center justify-center rounded-lg bg-warning/10 text-warning">
                  <Package className="size-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$98.26</div>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <ArrowUpRight className="size-3 text-emerald-500" />
                  +2% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                <div className="flex size-8 items-center justify-center rounded-lg bg-cyan-100 text-cyan-600">
                  <Target className="size-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3.2%</div>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <ArrowUpRight className="size-3 text-emerald-500" />
                  +0.4% from last month
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Revenue Trend Chart Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trend</CardTitle>
              <CardDescription>Monthly revenue and order volume</CardDescription>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="h-64 w-full rounded-lg bg-gradient-to-br from-primary/5 via-transparent to-transparent flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="size-8 text-primary/30 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Chart visualization placeholder</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-6 gap-2">
                {mockRevenueData.map((month) => (
                  <div key={month.period} className="text-center">
                    <div className="h-20 bg-primary/10 rounded-t" style={{ height: `${(month.revenue / 30000) * 100}%` }} />
                    <p className="text-[10px] text-muted-foreground mt-1">{month.period}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI Insights */}
          <AIInsightsPanel />

          {/* Quick Links */}
          <div className="grid gap-4 sm:grid-cols-3">
            <Link href="/analytics/momentum">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <TrendingUp className="size-5" />
                    </div>
                    <div>
                      <p className="font-semibold">Weekly Momentum</p>
                      <p className="text-xs text-muted-foreground">Deep dive analysis</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
            <Link href="/orders">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-success/10 text-success">
                      <ShoppingCart className="size-5" />
                    </div>
                    <div>
                      <p className="font-semibold">Order Analytics</p>
                      <p className="text-xs text-muted-foreground">Track & optimize</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
            <Link href="/automation">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-warning/10 text-warning">
                      <Zap className="size-5" />
                    </div>
                    <div>
                      <p className="font-semibold">Automation Insights</p>
                      <p className="text-xs text-muted-foreground">Optimize workflows</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </>
      )}

      {/* Revenue Section */}
      {activeSection === "revenue" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Breakdown</CardTitle>
              <CardDescription>Detailed revenue analysis by channel</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { channel: "Shopify Store", revenue: 18500, percentage: 64 },
                  { channel: "Amazon", revenue: 7800, percentage: 27 },
                  { channel: "eBay", revenue: 2400, percentage: 9 },
                ].map((channel) => (
                  <div key={channel.channel} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{channel.channel}</span>
                      <span className="font-medium">${channel.revenue.toLocaleString()}</span>
                    </div>
                    <Progress value={channel.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Link href="/finance/pnl">
            <Button variant="outline">
              <ExternalLink className="size-4 mr-2" />
              View Full P&L Report
            </Button>
          </Link>
        </div>
      )}

      {/* Orders Section */}
      {activeSection === "orders" && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold">287</p>
                  <p className="text-xs text-muted-foreground">Total Orders</p>
                </div>
              </CardContent>
            </div>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold">12</p>
                  <p className="text-xs text-muted-foreground">Pending</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold">268</p>
                  <p className="text-xs text-muted-foreground">Fulfilled</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold">98.5%</p>
                  <p className="text-xs text-muted-foreground">Success Rate</p>
                </div>
              </CardContent>
            </Card>
          </div>
          <Link href="/orders">
            <Button variant="outline">
              <ExternalLink className="size-4 mr-2" />
              Manage All Orders
            </Button>
          </Link>
        </div>
      )}

      {/* Products Section */}
      {activeSection === "products" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Products</CardTitle>
              <CardDescription>Products with highest revenue this period</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Sales</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead>Margin</TableHead>
                      <TableHead>Trend</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockTopProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.sales}</TableCell>
                        <TableCell>{product.revenue}</TableCell>
                        <TableCell>
                          <Badge className="bg-success-light text-success">{product.margin}</Badge>
                        </TableCell>
                        <TableCell>
                          {product.trend === "up" && <ArrowUpRight className="size-4 text-emerald-500" />}
                          {product.trend === "down" && <ArrowDownRight className="size-4 text-red-500" />}
                          {product.trend === "stable" && <span className="text-muted-foreground">─</span>}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
          <Link href="/my-products">
            <Button variant="outline">
              <ExternalLink className="size-4 mr-2" />
              View All Products
            </Button>
          </Link>
        </div>
      )}

      {/* Customers Section */}
      {activeSection === "customers" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Segments</CardTitle>
              <CardDescription>Breakdown of customer types</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockCustomerMetrics.map((segment) => (
                  <div key={segment.segment} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{segment.segment}</span>
                      <span className="font-medium">{segment.count} customers ({segment.percentage}%)</span>
                    </div>
                    <Progress value={segment.percentage} className="h-2" />
                    <p className="text-xs text-muted-foreground">Avg Order: {segment.avgOrder}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Link href="/customers">
            <Button variant="outline">
              <ExternalLink className="size-4 mr-2" />
              View Customer CRM
            </Button>
          </Link>
        </div>
      )}

      {/* Performance Section */}
      {activeSection === "performance" && (
        <div className="space-y-6">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Site Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Page Load Time</span>
                  <Badge className="bg-success-light text-success">1.2s</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Uptime</span>
                  <Badge className="bg-success-light text-success">99.9%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">SEO Score</span>
                  <Badge className="bg-warning-light text-warning">78/100</Badge>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Conversion Funnel</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Product Views</span>
                    <span>12,450</span>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Add to Cart</span>
                    <span>1,870 (15%)</span>
                  </div>
                  <Progress value={15} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Checkout Started</span>
                    <span>1,240 (10%)</span>
                  </div>
                  <Progress value={10} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Purchased</span>
                    <span>287 (3.2%)</span>
                  </div>
                  <Progress value={3.2} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}