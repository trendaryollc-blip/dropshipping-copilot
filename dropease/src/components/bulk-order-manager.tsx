"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ShoppingCart, Trash2, Plus, TrendingUp, Clock } from "lucide-react"
import { toast } from "sonner"
import { bulkOrderService } from "@/lib/supplier-service"
import type { BulkOrder } from "@/types"

export function BulkOrderManager() {
  const [orders, setOrders] = useState<BulkOrder[]>([])
  const [currentOrder, setCurrentOrder] = useState<BulkOrder["items"]>([])
  const [loading, setLoading] = useState(false)

  const handleAddItem = (productId: string, quantity: number, unitPrice: number) => {
    const existingItem = currentOrder.find((item) => item.productId === productId)

    if (existingItem) {
      setCurrentOrder(
        currentOrder.map((item) =>
          item.productId === productId ? { ...item, quantity: item.quantity + quantity } : item
        )
      )
    } else {
      setCurrentOrder([...currentOrder, { productId, quantity, unitPrice }])
    }
    toast.success("Item added to bulk order")
  }

  const handleRemoveItem = (productId: string) => {
    setCurrentOrder(currentOrder.filter((item) => item.productId !== productId))
  }

  const handleSubmitOrder = async () => {
    if (currentOrder.length === 0) {
      toast.error("Add items to bulk order")
      return
    }

    setLoading(true)
    try {
      const newOrder = await bulkOrderService.createBulkOrder(currentOrder)
      const submitted = await bulkOrderService.submitBulkOrder(newOrder.id)
      setOrders([{ ...newOrder, status: "confirmed" }, ...orders])
      setCurrentOrder([])
      toast.success(`Bulk order ${submitted.orderId} submitted!`)
    } catch (error) {
      toast.error("Failed to submit bulk order")
    } finally {
      setLoading(false)
    }
  }

  const totalCost = currentOrder.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
  const totalQty = currentOrder.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="space-y-6">
      {/* Active Bulk Order */}
      {currentOrder.length > 0 && (
        <Card className="p-6 border-blue-200 bg-blue-50">
          <h3 className="font-semibold mb-4">Current Bulk Order (Draft)</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product ID</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Unit Price</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentOrder.map((item) => (
                <TableRow key={item.productId}>
                  <TableCell className="font-medium">{item.productId}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>${item.unitPrice.toFixed(2)}</TableCell>
                  <TableCell>${(item.quantity * item.unitPrice).toFixed(2)}</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRemoveItem(item.productId)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-4 flex items-center justify-between border-t pt-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Quantity: {totalQty} units</p>
              <p className="text-lg font-semibold">Total Cost: ${totalCost.toFixed(2)}</p>
            </div>
            <Button onClick={handleSubmitOrder} disabled={loading} size="lg">
              {loading ? "Submitting..." : "Submit Order"}
            </Button>
          </div>
        </Card>
      )}

      {/* Add Items to Bulk Order */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Add Items to Bulk Order
          </h3>
          <Dialog>
            <DialogTrigger
              render={
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              }
            />
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Item to Bulk Order</DialogTitle>
              </DialogHeader>
              <AddItemForm onAdd={handleAddItem} />
            </DialogContent>
          </Dialog>
        </div>
      </Card>

      {/* Order History */}
      <Card className="p-6">
        <h3 className="font-semibold mb-6 flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recent Bulk Orders
        </h3>
        <div className="space-y-4">
          {orders.length === 0 ? (
            <p className="text-sm text-muted-foreground">No bulk orders yet</p>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{order.id}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.totalQuantity} units • ${order.totalCost.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={
                        order.status === "delivered"
                          ? "default"
                          : order.status === "in_transit"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {order.status.replace("_", " ")}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-2">
                      Est. Delivery: {new Date(order.estimatedDelivery).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="mt-4 text-xs text-muted-foreground">
                  {order.items.map((item) => (
                    <p key={item.productId}>
                      • Product {item.productId}: {item.quantity} × ${item.unitPrice.toFixed(2)}
                    </p>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  )
}

function AddItemForm({ onAdd }: { onAdd: (productId: string, quantity: number, unitPrice: number) => void }) {
  const [productId, setProductId] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [unitPrice, setUnitPrice] = useState(0)

  const handleSubmit = () => {
    if (!productId || quantity < 1 || unitPrice <= 0) {
      toast.error("Please fill in all fields correctly")
      return
    }
    onAdd(productId, quantity, unitPrice)
    setProductId("")
    setQuantity(1)
    setUnitPrice(0)
  }

  return (
    <div className="space-y-4">
      <Input
        placeholder="Product ID"
        value={productId}
        onChange={(e) => setProductId(e.target.value)}
      />
      <Input
        type="number"
        placeholder="Quantity"
        value={quantity}
        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
        min="1"
      />
      <Input
        type="number"
        placeholder="Unit Price"
        value={unitPrice}
        onChange={(e) => setUnitPrice(parseFloat(e.target.value) || 0)}
        step="0.01"
        min="0"
      />
      <Button onClick={handleSubmit} className="w-full">
        Add Item
      </Button>
    </div>
  )
}
