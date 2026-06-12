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
import { Mail, MessageCircle, TrendingUp, TrendingDown, ArrowUp, ArrowDown, Search, Users, DollarSign, BarChart2, Calendar, Target, Plus } from "lucide-react"
import { toast } from "sonner"

export default function MarketingPage() {
  const { products } = useAppStore()
  const { isAuthenticated } = useAuthStore()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login")
    } else {
      setLoading(false)
    }
  }, [isAuthenticated, router])

  // Mock marketing campaign data
  const [campaigns] = useState([
    {
      id: "campaign-1",
      name: "Summer Sale 2026",
      type: "Email",
      status: "active",
      startDate: "2026-06-01",
      endDate: "2026-08-31",
      budget: 5000,
      spent: 2345,
      impressions: 45678,
      clicks: 1234,
      conversions: 87,
      roi: 4.2,
      products: ["prod-1", "prod-2", "prod-3"]
    },
    {
      id: "campaign-2",
      name: "New Product Launch",
      type: "Social Media",
      status: "completed",
      startDate: "2026-05-15",
      endDate: "2026-05-30",
      budget: 3000,
      spent: 2875,
      impressions: 32456,
      clicks: 987,
      conversions: 45,
      roi: 3.8,
      products: ["prod-4", "prod-5"]
    },
    {
      id: "campaign-3",
      name: "Abandoned Cart Recovery",
      type: "Email",
      status: "active",
      startDate: "2026-01-01",
      endDate: "2026-12-31",
      budget: 10000,
      spent: 6789,
      impressions: 123456,
      clicks: 4567,
      conversions: 321,
      roi: 5.1,
      products: ["prod-1", "prod-3", "prod-6"]
    }
  ])

  // Filter campaigns based on search term
  const filteredCampaigns = campaigns.filter(campaign =>
    campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    campaign.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    campaign.status.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Calculate marketing metrics
  const activeCampaigns = filteredCampaigns.filter(c => c.status === "active")
  const totalBudget = filteredCampaigns.reduce((sum, c) => sum + c.budget, 0)
  const totalSpent = filteredCampaigns.reduce((sum, c) => sum + c.spent, 0)
  const totalImpressions = filteredCampaigns.reduce((sum, c) => sum + c.impressions, 0)
  const totalConversions = filteredCampaigns.reduce((sum, c) => sum + c.conversions, 0)
  const avgRoi = totalConversions > 0 ? (totalSpent / totalConversions) * 100 : 0

  // Get product names for campaigns
  const getProductNames = (productIds: string[]) => {
    return productIds.map(id => {
      const product = products.find(p => p.id === id)
      return product ? product.name : "Unknown Product"
    }).join(", ")
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Marketing Campaigns</h1>
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard")}
        >
          Back to Dashboard
        </Button>
      </div>

      {/* Marketing Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Active Campaigns</p>
                <p className="text-2xl font-bold">{activeCampaigns.length}</p>
              </div>
              <Target className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Total Budget</p>
                <p className="text-2xl font-bold">${totalBudget.toLocaleString()}</p>
              </div>
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Total Impressions</p>
                <p className="text-2xl font-bold">{totalImpressions.toLocaleString()}</p>
              </div>
              <Users className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Total Conversions</p>
                <p className="text-2xl font-bold">{totalConversions.toLocaleString()}</p>
              </div>
              <BarChart2 className="h-6 w-6 text-primary" />
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
            placeholder="Search campaigns..."
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button>
          <Plus className="size-4 mr-2" />
          Create Campaign
        </Button>
      </div>

      <Tabs defaultValue="active" className="mt-6">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3">
          <TabsTrigger value="active">Active Campaigns ({activeCampaigns.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed Campaigns ({filteredCampaigns.filter(c => c.status === "completed").length})</TabsTrigger>
          <TabsTrigger value="all">All Campaigns ({filteredCampaigns.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <CampaignTable campaigns={activeCampaigns} getProductNames={getProductNames} />
        </TabsContent>

        <TabsContent value="completed">
          <CampaignTable campaigns={filteredCampaigns.filter(c => c.status === "completed")} getProductNames={getProductNames} />
        </TabsContent>

        <TabsContent value="all">
          <CampaignTable campaigns={filteredCampaigns} getProductNames={getProductNames} />
        </TabsContent>
      </Tabs>

      {/* Top Performing Products */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Top Performing Products in Campaigns</h2>
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Niche</TableHead>
                  <TableHead>Trend Score</TableHead>
                  <TableHead>Campaigns</TableHead>
                  <TableHead>Performance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products
                  .filter(p => p.trendScore > 70)
                  .sort((a, b) => b.trendScore - a.trendScore)
                  .slice(0, 5)
                  .map((product) => (
                    <TableRow key={product.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-xs text-muted-foreground">{product.id}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{product.niche}</Badge>
                      </TableCell>
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
                        {campaigns.filter(c => c.products.includes(product.id)).length}
                      </TableCell>
                      <TableCell>
                      <Badge>High Performer</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function CampaignTable({ campaigns, getProductNames }: { campaigns: any[], getProductNames: (ids: string[]) => string }) {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Campaign Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Budget</TableHead>
              <TableHead>Spent</TableHead>
              <TableHead>ROI</TableHead>
              <TableHead>Products</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {campaigns.length > 0 ? (
              campaigns.map((campaign) => (
                <TableRow key={campaign.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div className="font-medium">{campaign.name}</div>
                    <div className="text-xs text-muted-foreground">{campaign.id}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {campaign.type === "Email" ? <Mail className="h-3 w-3 inline mr-1" /> : null}
                      {campaign.type === "Social Media" ? <MessageCircle className="h-3 w-3 inline mr-1" /> : null}
                      {campaign.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={campaign.status === "active" ? "secondary" : "secondary"}>
                      {campaign.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{new Date(campaign.startDate).toLocaleDateString()}</div>
                      <div className="text-xs text-muted-foreground">to</div>
                      <div>{new Date(campaign.endDate).toLocaleDateString()}</div>
                    </div>
                  </TableCell>
                  <TableCell>${campaign.budget.toLocaleString()}</TableCell>
                  <TableCell>${campaign.spent.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {campaign.roi > 4 ? (
                        <ArrowUp className="h-4 w-4 text-green-500" />
                      ) : campaign.roi < 3 ? (
                        <ArrowDown className="h-4 w-4 text-red-500" />
                      ) : (
                        <span className="h-4 w-4" />
                      )}
                      <span>{campaign.roi}x</span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[200px]">
                    <div className="text-sm">{getProductNames(campaign.products)}</div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
                  No campaigns found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}