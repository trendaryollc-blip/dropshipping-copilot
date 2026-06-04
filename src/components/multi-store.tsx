"use client"

import { useState } from "react"
import { Plus, MoreVertical, Trash2, ExternalLink, Store, CheckCircle, XCircle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { useAppStore } from "@/store/useAppStore"
import { toast } from "sonner"
import type { StoreStatus, StorePlatform } from "@/types"

const statusConfig: Record<StoreStatus, { label: string; class: string; icon: React.ElementType }> = {
  active: { label: "Active", class: "bg-success-light text-success border-success", icon: CheckCircle },
  inactive: { label: "Inactive", class: "bg-muted text-muted-foreground border-border", icon: XCircle },
  disconnected: { label: "Disconnected", class: "bg-destructive-light text-destructive border-destructive", icon: Clock },
}

const platformConfig: Record<StorePlatform, { label: string; color: string }> = {
  shopify: { label: "Shopify", color: "bg-success-light text-success" },
  woocommerce: { label: "WooCommerce", color: "bg-purple-100 text-purple-700" },
  bigcommerce: { label: "BigCommerce", color: "bg-primary-light text-primary" },
  magento: { label: "Magento", color: "bg-warning-light text-warning" },
  custom: { label: "Custom", color: "bg-muted text-muted-foreground" },
}

export function MultiStore() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newStore, setNewStore] = useState({
    name: "",
    platform: "shopify" as StorePlatform,
    url: "",
    status: "active" as StoreStatus,
    productsCount: 0,
    ordersCount: 0,
  })
  const { stores, addStore, updateStoreStatus, deleteStore } = useAppStore()

  const filtered = stores.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.url.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === "all" || s.status === statusFilter
    return matchSearch && matchStatus
  })

  const handleAddStore = () => {
    if (!newStore.name || !newStore.url) {
      toast.error("Please fill in all required fields")
      return
    }
    addStore(newStore)
    toast.success("Store added successfully")
    setIsAddDialogOpen(false)
    setNewStore({
      name: "",
      platform: "shopify",
      url: "",
      status: "active",
      productsCount: 0,
      ordersCount: 0,
    })
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="page-header">Multi-Store Management</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage all your connected stores in one place. Add, monitor, and control multiple dropshipping stores.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-primary/20 bg-gradient-to-br from-emerald-50 to-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Store className="size-4 text-primary" />
              Total Stores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">{stores.length}</p>
            <p className="text-xs text-muted-foreground mt-1">Connected platforms</p>
          </CardContent>
        </Card>
        <Card className="border-primary/20 bg-gradient-to-br from-blue-50 to-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <CheckCircle className="size-4 text-blue-600" />
              Active Stores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">{stores.filter(s => s.status === "active").length}</p>
            <p className="text-xs text-muted-foreground mt-1">Currently operating</p>
          </CardContent>
        </Card>
        <Card className="border-primary/20 bg-gradient-to-br from-purple-50 to-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Store className="size-4 text-purple-600" />
              Total Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">{stores.reduce((acc, s) => acc + s.productsCount, 0)}</p>
            <p className="text-xs text-muted-foreground mt-1">Across all stores</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-full max-w-xs">
          <Store className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search stores..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-8 text-sm"
          />
        </div>
        <Select value={statusFilter} onValueChange={(value) => value && setStatusFilter(value)}>
          <SelectTrigger size="sm" className="w-36 h-8 text-xs">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="disconnected">Disconnected</SelectItem>
          </SelectContent>
        </Select>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger
            render={
              <Button size="sm" className="h-8 text-xs">
                <Plus className="size-3.5 mr-1" /> Add Store
              </Button>
            }
          />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Store</DialogTitle>
              <DialogDescription>
                Connect a new store to manage your dropshipping business.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Store Name *</Label>
                <Input
                  id="name"
                  placeholder="Your Store Name"
                  value={newStore.name}
                  onChange={(e) => setNewStore({ ...newStore, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="platform">Platform</Label>
                <Select value={newStore.platform} onValueChange={(value) => value && setNewStore({ ...newStore, platform: value as StorePlatform })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="shopify">Shopify</SelectItem>
                    <SelectItem value="woocommerce">WooCommerce</SelectItem>
                    <SelectItem value="bigcommerce">BigCommerce</SelectItem>
                    <SelectItem value="magento">Magento</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="url">Store URL *</Label>
                <Input
                  id="url"
                  placeholder="https://your-store.com"
                  value={newStore.url}
                  onChange={(e) => setNewStore({ ...newStore, url: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Initial Status</Label>
                <Select value={newStore.status} onValueChange={(value) => value && setNewStore({ ...newStore, status: value as StoreStatus })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="disconnected">Disconnected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddStore}>Add Store</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <p className="ml-auto text-xs text-muted-foreground">{filtered.length} stores</p>
      </div>

      {filtered.length > 0 ? (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="text-xs font-medium text-muted-foreground w-[280px]">Store</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Platform</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Status</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Products</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Orders</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Connected</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((store) => {
                const status = statusConfig[store.status]
                const platform = platformConfig[store.platform]
                const StatusIcon = status.icon
                return (
                  <TableRow key={store.id} className="hover:bg-muted/20">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
                          <Store className="size-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground leading-snug">{store.name}</p>
                          <a href={store.url} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1">
                            {store.url} <ExternalLink className="size-2.5" />
                          </a>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`text-[10px] border ${platform.color}`}>{platform.label}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={`text-[10px] border flex items-center gap-1 ${status.class}`}>
                        <StatusIcon className="size-2.5" />
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs font-medium">{store.productsCount}</TableCell>
                    <TableCell className="text-xs font-medium">{store.ordersCount}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{store.connectedAt}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button variant="ghost" size="icon" className="size-7">
                              <MoreVertical className="size-3.5" />
                            </Button>
                          }
                        />
                        <DropdownMenuContent align="end" className="w-44">
                          {store.status !== "active" && (
                            <DropdownMenuItem onClick={() => { updateStoreStatus(store.id, "active"); toast.success("Store activated") }}>
                              <CheckCircle className="size-3.5 mr-2" /> Set Active
                            </DropdownMenuItem>
                          )}
                          {store.status !== "inactive" && (
                            <DropdownMenuItem onClick={() => { updateStoreStatus(store.id, "inactive"); toast.success("Store set to inactive") }}>
                              <XCircle className="size-3.5 mr-2" /> Set Inactive
                            </DropdownMenuItem>
                          )}
                          {store.status !== "disconnected" && (
                            <DropdownMenuItem onClick={() => { updateStoreStatus(store.id, "disconnected"); toast.success("Store disconnected") }}>
                              <Clock className="size-3.5 mr-2" /> Disconnect
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => { deleteStore(store.id); toast.success("Store deleted") }}
                          >
                            <Trash2 className="size-3.5 mr-2" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 py-20 text-center rounded-xl border border-dashed border-border">
          <Store className="size-10 text-muted-foreground/40" />
          <p className="text-sm font-medium text-muted-foreground">No stores connected yet.</p>
          <p className="text-xs text-muted-foreground">Connect your first store to start managing multiple platforms.</p>
          <Button size="sm" variant="outline" onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="size-3.5 mr-1" /> Add Your First Store
          </Button>
        </div>
      )}
    </div>
  )
}
