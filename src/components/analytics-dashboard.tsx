"use client"

import { useState, useEffect } from "react"
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  ShoppingCart, 
  Package, 
  Eye,
  Calendar,
  BarChart3,
  PieChart,
  Activity
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"

interface AnalyticsData {
  totalRevenue: number
  totalOrders: number
  totalCustomers: number
  conversionRate: number
  averageOrderValue: number
  topProducts: Array<{ name: string; sales: number; revenue: number }>
  salesByMonth: Array<{ month: string; revenue: number; orders: number }>
  customerDemographics: {
    new: number
    returning: number
    ageGroups: Array<{ range: string; percentage: number }>
    locations: Array<{ country: string; percentage: number }>
  }
  productPerformance: Array<{
    name: string
    views: number
    conversions: number
    revenue: number
    conversionRate: number
  }>
}

export function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState("30d")
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock analytics data - in real app, this would come from API
    setTimeout(() => {
      setData({
        totalRevenue: 45678,
        totalOrders: 1234,
        totalCustomers: 892,
        conversionRate: 3.2,
        averageOrderValue: 37.01,
        topProducts: [
          { name: "Wireless Earbuds Pro", sales: 234, revenue: 7020 },
          { name: "Smart Watch Ultra", sales: 189, revenue: 5670 },
          { name: "Portable Charger Set", sales: 156, revenue: 2340 },
          { name: "Phone Case Premium", sales: 145, revenue: 2175 },
          { name: "Bluetooth Speaker Mini", sales: 132, revenue: 1980 }
        ],
        salesByMonth: [
          { month: "Jan", revenue: 12000, orders: 320 },
          { month: "Feb", revenue: 15000, orders: 400 },
          { month: "Mar", revenue: 18000, orders: 480 },
          { month: "Apr", revenue: 22000, orders: 590 },
          { month: "May", revenue: 28000, orders: 750 },
          { month: "Jun", revenue: 32000, orders: 860 },
          { month: "Jul", revenue: 35000, orders: 940 },
          { month: "Aug", revenue: 31000, orders: 830 },
          { month: "Sep", revenue: 29000, orders: 780 },
          { month: "Oct", revenue: 26000, orders: 700 },
          { month: "Nov", revenue: 24000, orders: 640 },
          { month: "Dec", revenue: 22000, orders: 590 }
        ],
        customerDemographics: {
          new: 234,
          returning: 658,
          ageGroups: [
            { range: "18-24", percentage: 22 },
            { range: "25-34", percentage: 28 },
            { range: "35-44", percentage: 25 },
            { range: "45-54", percentage: 15 },
            { range: "55+", percentage: 10 }
          ],
          locations: [
            { country: "United States", percentage: 45 },
            { country: "Canada", percentage: 18 },
            { country: "United Kingdom", percentage: 12 },
            { country: "Australia", percentage: 8 },
            { country: "Germany", percentage: 7 },
            { country: "Other", percentage: 10 }
          ]
        },
        productPerformance: [
          { name: "Wireless Earbuds Pro", views: 5420, conversions: 234, revenue: 7020, conversionRate: 4.3 },
          { name: "Smart Watch Ultra", views: 4180, conversions: 189, revenue: 5670, conversionRate: 4.5 },
          { name: "Portable Charger Set", views: 3890, conversions: 156, revenue: 2340, conversionRate: 4.0 },
          { name: "Phone Case Premium", views: 3210, conversions: 145, revenue: 2175, conversionRate: 4.5 },
          { name: "Bluetooth Speaker Mini", views: 2870, conversions: 132, revenue: 1980, conversionRate: 4.6 }
        ]
      })
      setLoading(false)
    }, 1500)
  }, [])

  if (loading) {
    return (
      <div className="space-y-5">
        <div className="grid gap-5 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="flex items-center justify-center h-24">
                <div className="w-12 h-12 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-header">Analytics Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Monitor your store performance, customer insights, and sales trends.
          </p>
        </div>
        <Select value={timeRange} onValueChange={(value) => setTimeRange(value || "30d")}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="1y">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-5 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <DollarSign className="size-4 text-green-600" />
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${data?.totalRevenue?.toLocaleString() ?? '0'}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <TrendingUp className="size-3 text-green-600" />
              <span>+12.3% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <ShoppingCart className="size-4 text-blue-600" />
              Total Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.totalOrders?.toLocaleString() ?? '0'}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <TrendingUp className="size-3 text-blue-600" />
              <span>+8.1% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Users className="size-4 text-purple-600" />
              Total Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.totalCustomers?.toLocaleString() ?? '0'}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <TrendingUp className="size-3 text-purple-600" />
              <span>+15.2% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Activity className="size-4 text-orange-600" />
              Conversion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.conversionRate ?? 0}%</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <TrendingDown className="size-3 text-red-600" />
              <span>-2.1% from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-5 lg:grid-cols-2">
        {/* Sales Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <BarChart3 className="size-4" />
              Sales Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-6 gap-2 text-xs">
                {data?.salesByMonth?.map((month, index) => (
                  <div key={index} className="text-center">
                    <div className="font-medium">{month.month}</div>
                    <div className="text-muted-foreground">${(month.revenue / 1000).toFixed(1)}k</div>
                  </div>
                )) ?? []}
              </div>
              <div className="h-32 bg-muted rounded-lg p-4">
                <div className="flex items-end justify-between h-full gap-1">
                  {data?.salesByMonth?.map((month, index) => {
                    const height = (month.revenue / 35000) * 100
                    return (
                      <div key={index} className="flex-1 bg-primary rounded-t" style={{ height: `${height}%` }}>
                        <div className="text-xs text-center text-primary-foreground pt-1">
                          ${(month.revenue / 1000).toFixed(1)}k
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer Demographics */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Users className="size-4" />
              Customer Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-sm font-medium">Customer Types</div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">New</span>
                    <Badge className="bg-primary-light text-primary">{data?.customerDemographics?.new ?? 0}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Returning</span>
                    <Badge className="bg-success-light text-success">{data?.customerDemographics?.returning ?? 0}</Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">Age Groups</div>
                <div className="space-y-1">
                  {data?.customerDemographics?.ageGroups?.map((group, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{group.range}</span>
                        <span className="font-medium">{group.percentage}%</span>
                      </div>
                      <Progress value={group.percentage} className="h-2" />
                    </div>
                  )) ?? []}
                </div>
              </div>
            </div>

            <Separator />

            <div className="text-sm font-medium">Top Locations</div>
            <div className="space-y-2">
              {data?.customerDemographics?.locations?.slice(0, 3)?.map((location, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{location.country}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{location.percentage}%</span>
                    <Progress value={location.percentage} className="w-16 h-2" />
                  </div>
                </div>
              )) ?? []}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Product Performance */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <PieChart className="size-4" />
            Product Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4">
              {data?.productPerformance?.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{product.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {product.views?.toLocaleString() ?? '0'} views • {product.conversions ?? 0} conversions
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">${product.revenue?.toLocaleString() ?? '0'}</div>
                    <Badge 
                      className={
                        (product.conversionRate ?? 0) >= 4.5 ? "bg-success-light text-success" :
                        (product.conversionRate ?? 0) >= 4.0 ? "bg-warning-light text-warning" :
                        "bg-destructive-light text-destructive"
                      }
                    >
                      {product.conversionRate ?? 0}% CR
                    </Badge>
                  </div>
                </div>
              )) ?? []}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
