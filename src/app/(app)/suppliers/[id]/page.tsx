"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Star, TrendingUp, Globe, ShoppingCart, DollarSign, BarChart2, Tag, Truck, AlertCircle, CheckCircle, Package, Users, Phone, Mail, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAppStore } from "@/store/useAppStore"
import { toast } from "sonner"
import Link from "next/link"

export default function SupplierDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [supplier, setSupplier] = useState<any>(null)
  const [notFound, setNotFound] = useState(false)

  // Mock supplier data - in a real app, this would come from an API or store
  const mockSuppliers = [
    {
      id: "supplier-1",
      name: "Global Electronics Co.",
      category: "Electronics",
      productsCount: 42,
      reliabilityScore: 95,
      location: "Shenzhen, China",
      shippingTime: "7-14 days",
      minOrder: 50,
      contactEmail: "sales@globalelectronics.com",
      contactPhone: "+86 123 456 7890",
      rating: 4.8,
      yearsInBusiness: 8,
      paymentMethods: ["Credit Card", "PayPal", "Bank Transfer", "Alipay"],
      description: "Global Electronics Co. is a leading manufacturer and supplier of consumer electronics with over 8 years of experience in the industry. We specialize in high-quality products with competitive pricing and reliable shipping."
    },
    {
      id: "supplier-2",
      name: "Fashion Trends Ltd.",
      category: "Fashion & Accessories",
      productsCount: 38,
      reliabilityScore: 92,
      location: "Guangzhou, China",
      shippingTime: "10-18 days",
      minOrder: 30,
      contactEmail: "info@fashiontrends.com",
      contactPhone: "+86 987 654 3210",
      rating: 4.7,
      yearsInBusiness: 6,
      paymentMethods: ["Credit Card", "PayPal", "Western Union"],
      description: "Fashion Trends Ltd. offers the latest fashion accessories and apparel at wholesale prices. We work with top designers and manufacturers to bring you trendy products with fast turnaround times."
    }
  ]

  useEffect(() => {
    if (id) {
      const foundSupplier = mockSuppliers.find(s => s.id === id)
      if (foundSupplier) {
        setSupplier(foundSupplier)
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
        <h2 className="text-xl font-semibold text-foreground">Supplier Not Found</h2>
        <p className="text-sm text-muted-foreground">The supplier you're looking for doesn't exist or has been removed.</p>
        <Button variant="outline" onClick={() => router.push('/suppliers')}>
          <ArrowLeft className="size-4 mr-2" />
          Back to Suppliers
        </Button>
      </div>
    )
  }

  if (!supplier) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <AlertCircle className="size-10 text-muted-foreground/40" />
        <h2 className="text-xl font-semibold text-foreground">No Supplier Data</h2>
        <p className="text-sm text-muted-foreground">Supplier data could not be loaded.</p>
        <Button variant="outline" onClick={() => router.push('/suppliers')}>
          <ArrowLeft className="size-4 mr-2" />
          Back to Suppliers
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Back Navigation */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/suppliers')}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4 mr-2" />
          Back to Suppliers
        </Button>
      </div>

      {/* Supplier Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{supplier.name}</h1>
          <div className="flex items-center gap-2 mt-2">
            <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
              {supplier.category}
            </Badge>
            <div className="flex items-center gap-1">
              <Star className="size-3 fill-amber-400 text-amber-400" />
              <span className="text-xs font-semibold">{supplier.rating}/5.0</span>
            </div>
            <span className="text-xs text-muted-foreground">• {supplier.yearsInBusiness}+ years</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-emerald-500/10 px-2 py-1 rounded-full">
            <CheckCircle className="size-3 text-emerald-500" />
            <span className="text-xs font-semibold text-emerald-600">{supplier.reliabilityScore}% Reliable</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Supplier Info and Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Supplier Overview Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Supplier Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground/80 leading-relaxed">
                {supplier.description}
              </p>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Location</p>
                  <div className="flex items-center gap-2">
                    <MapPin className="size-4 text-muted-foreground" />
                    <span className="font-medium">{supplier.location}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Shipping Time</p>
                  <div className="flex items-center gap-2">
                    <Truck className="size-4 text-muted-foreground" />
                    <span className="font-medium">{supplier.shippingTime}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Minimum Order</p>
                  <div className="flex items-center gap-2">
                    <Package className="size-4 text-muted-foreground" />
                    <span className="font-medium">{supplier.minOrder} units</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Products Available</p>
                  <div className="flex items-center gap-2">
                    <Tag className="size-4 text-muted-foreground" />
                    <span className="font-medium">{supplier.productsCount}+ products</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center size-9 rounded-full bg-primary/10">
                    <Mail className="size-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <a href={`mailto:${supplier.contactEmail}`} className="text-sm font-medium text-primary hover:underline">
                      {supplier.contactEmail}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center size-9 rounded-full bg-primary/10">
                    <Phone className="size-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <a href={`tel:${supplier.contactPhone}`} className="text-sm font-medium text-primary hover:underline">
                      {supplier.contactPhone}
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Actions and Stats */}
        <div className="space-y-6">
          {/* Quick Actions Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                className="w-full justify-start gap-2"
                onClick={() => {
                  toast.info("Contact supplier functionality")
                }}
              >
                <Mail className="size-4" />
                Contact Supplier
              </Button>
              <Button
                className="w-full justify-start gap-2"
                variant="outline"
                onClick={() => {
                  toast.info("View products functionality")
                }}
              >
                <Package className="size-4" />
                View Products
              </Button>
              <Button
                className="w-full justify-start gap-2"
                variant="outline"
                onClick={() => {
                  toast.info("Request quote functionality")
                }}
              >
                <DollarSign className="size-4" />
                Request Quote
              </Button>
            </CardContent>
          </Card>

          {/* Supplier Stats Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Supplier Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="size-4 text-emerald-500" />
                    <span className="text-sm text-muted-foreground">Reliability</span>
                  </div>
                  <span className="font-medium">{supplier.reliabilityScore}%</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="size-4 text-amber-400" />
                    <span className="text-sm text-muted-foreground">Rating</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="size-3 fill-amber-400 text-amber-400" />
                    <span className="font-medium">{supplier.rating}/5.0</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="size-4 text-blue-500" />
                    <span className="text-sm text-muted-foreground">Experience</span>
                  </div>
                  <span className="font-medium">{supplier.yearsInBusiness}+ years</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Methods Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Payment Methods</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {supplier.paymentMethods.map((method: string, index: number) => (
                <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                  <span className="text-sm">{method}</span>
                  <CheckCircle className="size-4 text-green-500" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}