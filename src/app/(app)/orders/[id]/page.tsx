"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Package, Star, TrendingUp, Globe, ShoppingCart, DollarSign, BarChart2, Tag, Truck, AlertCircle, CheckCircle, Clock, MapPin, CreditCard, User, Phone, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAppStore } from "@/store/useAppStore"
import { toast } from "sonner"
import Link from "next/link"

export default function OrderDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [order, setOrder] = useState<any>(null)
  const [notFound, setNotFound] = useState(false)

  // Mock order data - in a real app, this would come from an API or store
  const mockOrders = [
    {
      id: "order-1",
      orderNumber: "DROP-2023-0042",
      customerName: "Sarah Johnson",
      customerEmail: "sarah@example.com",
      customerPhone: "+1 (555) 123-4567",
      orderDate: "2023-11-15",
      status: "processing",
      totalAmount: 129.99,
      shippingMethod: "Standard Shipping",
      trackingNumber: "USPS9400110200881901726758",
      paymentMethod: "Credit Card",
      paymentStatus: "paid",
      items: [
        {
          id: "item-1",
          productName: "Wireless Bluetooth Earbuds",
          productId: "prod-001",
          quantity: 2,
          price: 49.99,
          image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150&h=150&fit=crop",
          status: "processing"
        },
        {
          id: "item-2",
          productName: "Phone Stand with Wireless Charger",
          productId: "prod-002",
          quantity: 1,
          price: 29.99,
          image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=150&h=150&fit=crop",
          status: "processing"
        }
      ],
      shippingAddress: {
        name: "Sarah Johnson",
        address: "123 Main Street, Apt 4B",
        city: "New York",
        state: "NY",
        zip: "10001",
        country: "United States"
      },
      billingAddress: {
        name: "Sarah Johnson",
        address: "123 Main Street, Apt 4B",
        city: "New York",
        state: "NY",
        zip: "10001",
        country: "United States"
      }
    },
    {
      id: "order-2",
      orderNumber: "DROP-2023-0043",
      customerName: "Michael Chen",
      customerEmail: "michael@example.com",
      customerPhone: "+1 (555) 987-6543",
      orderDate: "2023-11-14",
      status: "shipped",
      totalAmount: 89.98,
      shippingMethod: "Express Shipping",
      trackingNumber: "FedEx794613582794",
      paymentMethod: "PayPal",
      paymentStatus: "paid",
      items: [
        {
          id: "item-1",
          productName: "Smart Watch Fitness Tracker",
          productId: "prod-003",
          quantity: 1,
          price: 89.98,
          image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150&h=150&fit=crop",
          status: "shipped"
        }
      ],
      shippingAddress: {
        name: "Michael Chen",
        address: "456 Oak Avenue",
        city: "San Francisco",
        state: "CA",
        zip: "94102",
        country: "United States"
      },
      billingAddress: {
        name: "Michael Chen",
        address: "456 Oak Avenue",
        city: "San Francisco",
        state: "CA",
        zip: "94102",
        country: "United States"
      }
    }
  ]

  useEffect(() => {
    if (id) {
      const foundOrder = mockOrders.find(o => o.id === id)
      if (foundOrder) {
        setOrder(foundOrder)
      } else {
        setNotFound(true)
      }
      setLoading(false)
    }
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <AlertCircle className="size-10 text-muted-foreground/40" />
        <h2 className="text-xl font-semibold text-foreground">Order Not Found</h2>
        <p className="text-sm text-muted-foreground">The order you're looking for doesn't exist or has been removed.</p>
        <Button variant="outline" onClick={() => router.push('/orders')}>
          <ArrowLeft className="size-4 mr-2" />
          Back to Orders
        </Button>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <AlertCircle className="size-10 text-muted-foreground/40" />
        <h2 className="text-xl font-semibold text-foreground">No Order Data</h2>
        <p className="text-sm text-muted-foreground">Order data could not be loaded.</p>
        <Button variant="outline" onClick={() => router.push('/orders')}>
          <ArrowLeft className="size-4 mr-2" />
          Back to Orders
        </Button>
      </div>
    )
  }

  // Status styling
  const getStatusBadge = (status: string) => {
    switch(status.toLowerCase()) {
      case 'processing':
        return <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20 text-xs">Processing</Badge>
      case 'shipped':
        return <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/20 text-xs">Shipped</Badge>
      case 'delivered':
        return <Badge className="bg-green-500/10 text-green-600 border-green-500/20 text-xs">Delivered</Badge>
      case 'cancelled':
        return <Badge className="bg-red-500/10 text-red-600 border-red-500/20 text-xs">Cancelled</Badge>
      case 'refunded':
        return <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-xs">Refunded</Badge>
      default:
        return <Badge className="bg-muted text-muted-foreground border-border text-xs">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Back Navigation */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/orders')}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4 mr-2" />
          Back to Orders
        </Button>
      </div>

      {/* Order Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Order #{order.orderNumber}</h1>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-sm text-muted-foreground">Placed on {order.orderDate}</span>
            <span className="text-sm text-muted-foreground">•</span>
            <span className="text-sm text-muted-foreground">Total: ${order.totalAmount.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {getStatusBadge(order.status)}
          {order.paymentStatus === 'paid' && (
            <Badge className="bg-green-500/10 text-green-600 border-green-500/20 text-xs">
              Payment Received
            </Badge>
          )}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Order Items and Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Order Items ({order.items.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.items.map((item: any) => (
                <div key={item.id} className="flex items-start gap-4 p-3 rounded-lg border border-border/50 hover:bg-muted/50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.productName}
                    className="size-16 rounded-lg object-cover border border-border"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground">{item.productName}</h3>
                    <p className="text-sm text-muted-foreground">Product ID: {item.productId}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">${item.price.toFixed(2)}</span>
                        <span className="text-xs text-muted-foreground">× {item.quantity}</span>
                      </div>
                      <span className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Order Summary Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="size-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Subtotal</span>
                  </div>
                  <span className="font-medium">${(order.items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0)).toFixed(2)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Truck className="size-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Shipping</span>
                  </div>
                  <span className="font-medium">Free</span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border/50">
                  <div className="flex items-center gap-2">
                    <DollarSign className="size-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Total</span>
                  </div>
                  <span className="text-lg font-bold">${order.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Customer and Shipping Info */}
        <div className="space-y-6">
          {/* Customer Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center size-9 rounded-full bg-primary/10">
                    <User className="size-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{order.customerName}</p>
                    <a href={`mailto:${order.customerEmail}`} className="text-sm text-primary hover:underline">
                      {order.customerEmail}
                    </a>
                    <a href={`tel:${order.customerPhone}`} className="block text-sm text-primary hover:underline">
                      {order.customerPhone}
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Shipping Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Shipping Method</p>
                <p className="font-medium">{order.shippingMethod}</p>

                {order.trackingNumber && (
                  <>
                    <p className="text-sm text-muted-foreground pt-2">Tracking Number</p>
                    <div className="flex items-center justify-between">
                      <p className="font-mono text-sm font-medium">{order.trackingNumber}</p>
                      <Button size="sm" variant="outline" className="text-xs">
                        Track Package
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Address Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Addresses</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-foreground mb-1">Shipping Address</p>
                  <div className="text-sm text-muted-foreground/80 space-y-1">
                    <p>{order.shippingAddress.name}</p>
                    <p>{order.shippingAddress.address}</p>
                    <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</p>
                    <p>{order.shippingAddress.country}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-border/50">
                  <p className="text-sm font-medium text-foreground mb-1">Billing Address</p>
                  <div className="text-sm text-muted-foreground/80 space-y-1">
                    <p>{order.billingAddress.name}</p>
                    <p>{order.billingAddress.address}</p>
                    <p>{order.billingAddress.city}, {order.billingAddress.state} {order.billingAddress.zip}</p>
                    <p>{order.billingAddress.country}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Order Actions */}
      <div className="flex flex-wrap gap-3">
        <Button
          className="gap-2"
          onClick={() => {
            toast.info("Print label functionality")
          }}
        >
          <Truck className="size-4" />
          Print Shipping Label
        </Button>
        <Button
          variant="outline"
          className="gap-2"
          onClick={() => {
            toast.info("Update status functionality")
          }}
        >
          <CheckCircle className="size-4" />
          Mark as Shipped
        </Button>
        <Button
          variant="outline"
          className="gap-2"
          onClick={() => {
            toast.info("Contact customer functionality")
          }}
        >
          <Mail className="size-4" />
          Contact Customer
        </Button>
      </div>
    </div>
  )
}