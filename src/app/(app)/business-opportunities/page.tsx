"use client"

import { useState } from "react"
import { TrendingUp, Package, Users, DollarSign, Target, Zap, BarChart3, Search, ExternalLink, ArrowUpRight, ArrowDownRight, Lightbulb, ShoppingBag, Globe, Calendar, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"

const opportunityTabs = [
  { id: "products", label: "Product Opportunities", icon: Package },
  { id: "suppliers", label: "Supplier Opportunities", icon: Users },
  { id: "markets", label: "Market Gaps", icon: Target },
  { id: "trends", label: "Trending Niches", icon: TrendingUp },
]

const mockProductOpportunities = [
  { id: "P1", name: "Smart Home Security Camera", niche: "Electronics", demandScore: 92, competition: "Low", profitMargin: 45, trend: "up", price: 59 },
  { id: "P2", name: "Eco-Friendly Water Bottle", niche: "Lifestyle", demandScore: 87, competition: "Medium", profitMargin: 38, trend: "up", price: 24 },
  { id: "P3", name: "Magnetic Phone Mount", niche: "Tech Accessories", demandScore: 84, competition: "Low", profitMargin: 52, trend: "stable", price: 18 },
  { id: "P4", name: "LED Desk Lamp", niche: "Home Office", demandScore: 78, competition: "High", profitMargin: 32, trend: "down", price: 35 },
  { id: "P5", name: "Wireless Charger Pad", niche: "Electronics", demandScore: 85, competition: "Medium", profitMargin: 41, trend: "up", price: 28 },
]

const mockSupplierOpportunities = [
  { id: "S1", name: "TechGadgets Pro", location: "China", rating: 4.8, responseTime: "2.5 hrs", products: 1250, trustScore: 95, opportunity: "High demand electronics" },
  { id: "S2", name: "EcoLife Essentials", location: "India", rating: 4.6, responseTime: "4 hrs", products: 850, trustScore: 88, opportunity: "Growing eco-friendly market" },
  { id: "S3", name: "FastShip Logistics", location: "US", rating: 4.9, responseTime: "1 hr", products: 45, trustScore: 97, opportunity: "Fast domestic shipping" },
]

const mockMarketGaps = [
  { id: "M1", niche: "Gaming Accessories", gapScore: 94, avgPrice: 45, competitors: 12, opportunity: "High demand, low quality options" },
  { id: "M2", niche: "Pet Supplies", gapScore: 88, avgPrice: 28, competitors: 25, opportunity: "Growing pet ownership trend" },
  { id: "M3", niche: "Fitness Gear", gapScore: 85, avgPrice: 35, competitors: 31, opportunity: "Post-pandemic health focus" },
]

export default function BusinessOpportunitiesPage() {
  const [activeTab, setActiveTab] = useState("products")

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl border border-border/50 bg-card/60 p-6 backdrop-blur-sm sm:p-8 animate-in">
        <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-violet-500/5 blur-3xl" />
        <div className="absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-primary/5 blur-2xl" />
        <div className="relative z-10 flex flex-col gap-4">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-violet-600 dark:text-violet-400">
              <Target className="size-3" />
              Opportunities
            </span>
            <h1 className="hero-title">Business Opportunities</h1>
            <p className="max-w-lg text-sm leading-relaxed text-muted-foreground/70">
              Discover profitable products, reliable suppliers, and untapped market gaps to grow your dropshipping business.
            </p>
          </div>
        </div>
      </section>

      {/* Opportunity Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Opportunity Score</CardTitle>
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Lightbulb className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87/100</div>
            <p className="text-xs text-muted-foreground mt-1">Market potential rating</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hot Products</CardTitle>
            <div className="flex size-8 items-center justify-center rounded-lg bg-success-light text-success">
              <Package className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142</div>
            <p className="text-xs text-muted-foreground mt-1">Ready to import</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Profit Margin</CardTitle>
            <div className="flex size-8 items-center justify-center rounded-lg bg-warning-light text-warning">
              <DollarSign className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42%</div>
            <p className="text-xs text-muted-foreground mt-1">Across opportunities</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Competition</CardTitle>
            <div className="flex size-8 items-center justify-center rounded-lg bg-cyan-100 text-cyan-600">
              <Target className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68</div>
            <p className="text-xs text-muted-foreground mt-1">Easy-entry niches</p>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border/50 pb-4">
        {opportunityTabs.map((tab) => {
          const Icon = tab.icon
          return (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              className={`h-9 px-4 text-sm ${activeTab === tab.id ? "" : "text-muted-foreground"}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon className="size-4 mr-2" />
              {tab.label}
            </Button>
          )
        })}
      </div>

      {/* Tab Content */}
      {activeTab === "products" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="size-5 text-primary" />
                Hot Product Opportunities
              </CardTitle>
              <CardDescription>Products with high demand and low competition</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input placeholder="Search opportunities..." className="pl-9 h-9" />
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-40 h-9">
                    <SelectValue placeholder="Filter by niche" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Niches</SelectItem>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="lifestyle">Lifestyle</SelectItem>
                    <SelectItem value="fashion">Fashion</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Niche</TableHead>
                      <TableHead>Demand</TableHead>
                      <TableHead>Competition</TableHead>
                      <TableHead>Profit</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockProductOpportunities.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{product.name}</span>
                            {product.trend === "up" && <ArrowUpRight className="size-3.5 text-emerald-500" />}
                            {product.trend === "down" && <ArrowDownRight className="size-3.5 text-red-500" />}
                          </div>
                        </TableCell>
                        <TableCell>{product.niche}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={product.demandScore} className="w-16 h-2" />
                            <span className="text-xs">{product.demandScore}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={product.competition === "Low" ? "default" : product.competition === "Medium" ? "secondary" : "destructive"} className="capitalize">
                            {product.competition}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="font-semibold text-success">{product.profitMargin}%</span>
                        </TableCell>
                        <TableCell>
                          <Link href={`/products?search=${encodeURIComponent(product.name)}`}>
                            <Button variant="outline" size="sm" className="h-7">
                              <ExternalLink className="size-3 mr-1" />
                              View
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "suppliers" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="size-5 text-primary" />
                Trusted Supplier Opportunities
              </CardTitle>
              <CardDescription>High-rated suppliers for your product categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {mockSupplierOpportunities.map((supplier) => (
                  <Card key={supplier.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-5">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-semibold">{supplier.name}</p>
                          <p className="text-xs text-muted-foreground">{supplier.location}</p>
                        </div>
                        <Badge className="bg-success-light text-success">{supplier.rating}★</Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Response Time</span>
                          <span className="font-medium">{supplier.responseTime}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Products</span>
                          <span className="font-medium">{supplier.products}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Trust Score</span>
                          <span className="font-medium">{supplier.trustScore}/100</span>
                        </div>
                      </div>
                      <p className="mt-3 text-xs text-muted-foreground">{supplier.opportunity}</p>
                      <Link href="/suppliers" className="mt-4 block">
                        <Button variant="outline" size="sm" className="w-full">
                          <ExternalLink className="size-3 mr-1" />
                          Explore Supplier
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "markets" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="size-5 text-primary" />
                Untapped Market Gaps
              </CardTitle>
              <CardDescription>Niches with low competition and high demand</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {mockMarketGaps.map((market) => (
                  <Card key={market.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-5">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-lg">{market.niche}</h3>
                        <Badge className="bg-primary/10 text-primary">{market.gapScore} gap score</Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Avg Price</span>
                          <span className="font-medium">${market.avgPrice}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Competitors</span>
                          <span className="font-medium">{market.competitors}</span>
                        </div>
                      </div>
                      <p className="mt-3 text-xs text-muted-foreground">{market.opportunity}</p>
                      <Link href={`/products?niche=${encodeURIComponent(market.niche)}`} className="mt-4 block">
                        <Button variant="outline" size="sm" className="w-full">
                          <Search className="size-3 mr-1" />
                          Find Products
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "trends" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="size-5 text-primary" />
                Trending Opportunities
              </CardTitle>
              <CardDescription>Niches gaining momentum this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "AI Tech Accessories", growth: 65, demand: "High", tags: ["AI", "Gadgets", "Future"] },
                  { name: "Sustainable Living", growth: 52, demand: "Rising", tags: ["Eco", "Green", "Lifestyle"] },
                  { name: "Remote Work Tools", growth: 48, demand: "Steady", tags: ["Home Office", "Productivity"] },
                ].map((trend, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-card/60 transition-colors">
                    <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <TrendingUp className="size-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{trend.name}</p>
                      <div className="mt-2 flex items-center gap-3">
                        <span className="text-xs text-muted-foreground">Growth: +{trend.growth}%</span>
                        <Badge variant="secondary" className="text-xs">{trend.demand}</Badge>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {trend.tags.map((tag) => (
                          <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-muted">{tag}</span>
                        ))}
                      </div>
                    </div>
                    <Link href="/trends">
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="size-4" />
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}