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
import { Search, Users, DollarSign, ShoppingCart, Clock, ArrowUpRight } from "lucide-react"
import { AIInsightsPanel } from "@/components/dashboard/AIInsightsPanel"
import { toast } from "sonner"

export default function CustomersPage() {
  const { users, getUsers } = useAppStore()
  const { isAuthenticated } = useAuthStore()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    if (isAuthenticated) {
      getUsers()
    }
  }, [isAuthenticated])

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Customers</h1>
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard")}
        >
          Back to Dashboard
        </Button>
      </div>

      {/* Insights Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <AIInsightsPanel
          title="Total Customers"
          description="Total unique customers"
          value={filteredUsers.length.toString()}
          trend="↑ 14.7%"
          icon={<Users className="h-4 w-4 text-primary" />}
        />
        <AIInsightsPanel
          title="Active Customers"
          description="Customers with active status"
          value={filteredUsers.filter(u => u.plan === "pro").length.toString()}
          trend="↑ 8.3%"
          icon={<ShoppingCart className="h-4 w-4 text-primary" />}
        />
        <AIInsightsPanel
          title="Lifetime Value"
          description="Average customer lifetime value"
          value="$1,245.67"
          trend="↑ 5.2%"
          icon={<DollarSign className="h-4 w-4 text-primary" />}
        />
        <AIInsightsPanel
          title="Recent Activity"
          description="Customers with recent activity"
          value="42"
          trend="↑ 12.5%"
          icon={<Clock className="h-4 w-4 text-primary" />}
        />
      </div>

      {/* Search and Table */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search customers..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Activity</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={user.plan === "pro" ? "default" : "secondary"}>
                        {user.plan}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.isOnboarded ? "default" : "secondary"}>
                        {user.isOnboarded ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(user.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toast.info(`Viewing customer details for ${user.name}`)}
                      >
                        <ArrowUpRight className="size-4" />
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