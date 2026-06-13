"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAppStore } from "@/store/useAppStore"
import { useAuthStore } from "@/store/useAuthStore"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, DollarSign, BarChart2, ShoppingCart, Users, TrendingUp, Clock, ArrowUpRight, FileText, Calendar, ArrowDownRight, ArrowUpLeft } from "lucide-react"
import { InsightPanel } from "@/components/dashboard/InsightPanel"
import { toast } from "sonner"

export default function PnLPage() {
  const { products } = useAppStore()
  const { isAuthenticated } = useAuthStore()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login")
    }
  }, [isAuthenticated, router])

  // Mock P&L data
  const mockPnL = {
    revenue: 12456.78,
    costOfGoodsSold: 6228.39,
    grossProfit: 6228.39,
    operatingExpenses: 1875.45,
    netProfit: 4352.94,
    revenueByMonth: [
      { month: "Jan", value: 8562.34 },
      { month: "Feb", value: 9234.56 },
      { month: "Mar", value: 10123.45 },
      { month: "Apr", value: 11234.56 },
      { month: "May", value: 12456.78 },
      { month: "Jun", value: 13567.89 }
    ],
    expensesByCategory: [
      { category: "Marketing", value: 1234.56 },
      { category: "Administration", value: 456.78 },
      { category: "R&D", value: 789.01 },
      { category: "Shipping", value: 345.67 },
      { category: "Other", value: 234.56 }
    ]
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-6 space-y-8">
      <section className="space-y-6 rounded-3xl border border-border/50 bg-card/60 p-6 backdrop-blur-sm shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              <FileText className="size-4" /> Finance
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Profit & Loss Statement</h1>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                Review revenue, costs, and cashflow trends with simple, actionable financial insights for your dropshipping business.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/admin/reports">
              <Button className="min-w-[160px]">Open Reports</Button>
            </Link>
            <Link href="/admin/billing">
              <Button variant="outline" className="min-w-[160px]">Billing Settings</Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              title: "Forecast Target",
              description: "Set quarterly profit goals.",
              href: "/admin/reports",
            },
            {
              title: "Connect payments",
              description: "Sync Stripe or PayPal billing.",
              href: "/admin/billing",
            },
            {
              title: "Sync sales data",
              description: "Pull order history from integrations.",
              href: "/integrations",
            },
          ].map((tile) => (
            <Link key={tile.href} href={tile.href} className="group rounded-3xl border border-border/70 bg-background p-5 transition hover:border-primary/70 hover:bg-primary/5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-foreground">{tile.title}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{tile.description}</p>
                </div>
                <ArrowRight className="size-4 text-muted-foreground transition group-hover:text-primary" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search financial data..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <InsightPanel
          title="Total Revenue"
          description="Total sales for this period"
          value={`$${mockPnL.revenue.toFixed(2)}`}
          trend="↑ 12.5%"
          icon={<DollarSign className="h-4 w-4 text-primary" />}
        />
        <InsightPanel
          title="Gross Profit"
          description="Revenue minus cost of goods sold"
          value={`$${mockPnL.grossProfit.toFixed(2)}`}
          trend="↑ 8.3%"
          icon={<BarChart2 className="h-4 w-4 text-primary" />}
        />
        <InsightPanel
          title="Net Profit"
          description="Final profit after all expenses"
          value={`$${mockPnL.netProfit.toFixed(2)}`}
          trend="↑ 15.2%"
          icon={<TrendingUp className="h-4 w-4 text-primary" />}
          trendColor="success"
        />
        <InsightPanel
          title="COGS"
          description="Cost of goods sold"
          value={`$${mockPnL.costOfGoodsSold.toFixed(2)}`}
          trend="↓ 2.1%"
          icon={<ShoppingCart className="h-4 w-4 text-primary" />}
        />
      </div>

      {/* Tabs Content */}
      <Tabs defaultValue="summary" className="mt-6">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
        </TabsList>

        <TabsContent value="summary">
          <Card>
            <CardHeader>
              <CardTitle>Profit & Loss Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Revenue</span>
                    <span className="text-lg font-bold">${mockPnL.revenue.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Cost of Goods Sold</span>
                    <span className="text-lg font-bold">${mockPnL.costOfGoodsSold.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Gross Profit</span>
                    <span className="text-lg font-bold">${mockPnL.grossProfit.toFixed(2)}</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Operating Expenses</span>
                    <span className="text-lg font-bold">${mockPnL.operatingExpenses.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Net Profit</span>
                    <span className="text-lg font-bold">${mockPnL.netProfit.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Profit Margin</span>
                    <span className="text-lg font-bold">{((mockPnL.netProfit / mockPnL.revenue) * 100).toFixed(1)}%</span>
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
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Monthly Revenue</span>
                  <span className="text-lg font-bold">${mockPnL.revenue.toFixed(2)}</span>
                </div>
                <div className="h-2 bg-muted rounded-full">
                  <div className="h-full bg-primary rounded-full" style={{ width: '95%' }}></div>
                </div>
              </div>

              <div className="rounded-md border mt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Month</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead>Change</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockPnL.revenueByMonth.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.month}</TableCell>
                        <TableCell>${item.value.toFixed(2)}</TableCell>
                        <TableCell>
                          <div className={`flex items-center gap-1 ${index > 0 && item.value > mockPnL.revenueByMonth[index-1].value ? 'text-green-600' : 'text-red-600'}`}>
                            {index > 0 && (
                              <>
                                {item.value > mockPnL.revenueByMonth[index-1].value ? '↑' : '↓'}
                                {((item.value - mockPnL.revenueByMonth[index-1].value) / mockPnL.revenueByMonth[index-1].value * 100).toFixed(1)}%
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses">
          <Card>
            <CardHeader>
              <CardTitle>Expense Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Total Expenses</span>
                  <span className="text-lg font-bold">${mockPnL.operatingExpenses.toFixed(2)}</span>
                </div>
                <div className="h-2 bg-muted rounded-full">
                  <div className="h-full bg-destructive rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>

              <div className="rounded-md border mt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Percentage</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockPnL.expensesByCategory.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>${item.value.toFixed(2)}</TableCell>
                        <TableCell>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className="bg-primary rounded-full h-full"
                              style={{ width: `${(item.value / mockPnL.operatingExpenses) * 100}%` }}
                            ></div>
                          </div>
                        </TableCell>
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