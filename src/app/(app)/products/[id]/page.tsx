"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Package, Star, TrendingUp, Globe, ShoppingCart, DollarSign, BarChart2, Tag, Truck, AlertCircle, CheckCircle, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAppStore } from "@/store/useAppStore"
import { toast } from "sonner"
import Link from "next/link"

export default function ProductDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [product, setProduct] = useState<any>(null)
  const [notFound, setNotFound] = useState(false)
  const { products } = useAppStore()

  useEffect(() => {
    if (id && products.length > 0) {
      const foundProduct = products.find(p => p.id === id)
      if (foundProduct) {
        setProduct(foundProduct)
      } else {
        setNotFound(true)
      }
      setLoading(false)
    }
  }, [id, products])

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
        <h2 className="text-xl font-semibold text-foreground">Product Not Found</h2>
        <p className="text-sm text-muted-foreground">The product you're looking for doesn't exist or has been removed.</p>
        <Button variant="outline" onClick={() => router.push('/products')}>
          <ArrowLeft className="size-4 mr-2" />
          Back to Products
        </Button>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <AlertCircle className="size-10 text-muted-foreground/40" />
        <h2 className="text-xl font-semibold text-foreground">No Product Data</h2>
        <p className="text-sm text-muted-foreground">Product data could not be loaded.</p>
        <Button variant="outline" onClick={() => router.push('/products')}>
          <ArrowLeft className="size-4 mr-2" />
          Back to Products
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
          onClick={() => router.push('/products')}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4 mr-2" />
          Back to Products
        </Button>
      </div>

      {/* Product Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{product.name}</h1>
          <div className="flex items-center gap-2 mt-2">
            <Badge className={`text-xs ${
              product.status === "active"
                ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                : product.status === "draft"
                ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                : "bg-muted text-muted-foreground border-border"
            }`}>
              {product.status}
            </Badge>
            <span className="text-xs text-muted-foreground/60 capitalize">{product.competition} competition</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-full">
            <Star className="size-3 fill-amber-400 text-amber-400" />
            <span className="font-semibold text-primary">{product.trendScore}</span>
          </div>
          {product.importedAt && (
            <Badge variant="outline" className="text-xs">
              Imported: {product.importedAt}
            </Badge>
          )}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Product Image and Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Product Image Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full max-w-md rounded-xl object-cover border border-border"
                  style={{ aspectRatio: "1/1" }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Product Details Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Product Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="font-medium">{product.niche}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Supplier</p>
                  <p className="font-medium">{product.supplierName || "N/A"}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Price Range</p>
                  <p className="font-medium">${product.priceRange.min} – ${product.priceRange.max}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Trend Score</p>
                  <div className="flex items-center gap-1">
                    <Star className="size-3 fill-amber-400 text-amber-400" />
                    <span className="font-medium">{product.trendScore}/100</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-4">
                <p className="text-sm text-muted-foreground">Competition Level</p>
                <Badge className={`text-xs capitalize ${
                  product.competition === "low" ? "bg-green-500/10 text-green-600 border-green-500/20" :
                  product.competition === "medium" ? "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" :
                  "bg-red-500/10 text-red-600 border-red-500/20"
                }`}>
                  {product.competition}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Product Description Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground/80 leading-relaxed">
                {product.description || "No description available for this product. Consider generating an AI-powered description to attract more customers."}
              </p>
              {!product.description && (
                <div className="mt-4">
                  <Link href="/description" className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline">
                    <ExternalLink className="size-3" />
                    Generate AI Description
                  </Link>
                </div>
              )}
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
                  toast.info("Add to My Products functionality")
                }}
              >
                <Package className="size-4" />
                Add to My Products
              </Button>
              <Button
                className="w-full justify-start gap-2"
                variant="outline"
                onClick={() => {
                  toast.info("Import to Trendaryo functionality")
                }}
              >
                <Globe className="size-4" />
                Import to Trendaryo
              </Button>
              <Button
                className="w-full justify-start gap-2"
                variant="outline"
                onClick={() => {
                  toast.info("Order sample functionality")
                }}
              >
                <ShoppingCart className="size-4" />
                Order Sample
              </Button>
            </CardContent>
          </Card>

          {/* Product Stats Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Product Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="size-4 text-primary" />
                    <span className="text-sm text-muted-foreground">Trend Potential</span>
                  </div>
                  <span className="font-medium">{product.trendScore}%</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="size-4 text-green-500" />
                    <span className="text-sm text-muted-foreground">Profit Margin</span>
                  </div>
                  <span className="font-medium">{product.margin || "N/A"}%</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BarChart2 className="size-4 text-blue-500" />
                    <span className="text-sm text-muted-foreground">Competition</span>
                  </div>
                  <Badge className={`text-xs capitalize ${
                    product.competition === "low" ? "bg-green-500/10 text-green-600" :
                    product.competition === "medium" ? "bg-yellow-500/10 text-yellow-600" :
                    "bg-red-500/10 text-red-600"
                  }`}>
                    {product.competition}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Supplier Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Supplier Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Supplier Name</p>
                <p className="font-medium">{product.supplierName || "Not specified"}</p>
              </div>

              <div className="space-y-1 pt-2">
                <p className="text-sm text-muted-foreground">Shipping Information</p>
                <div className="flex items-center gap-2">
                  <Truck className="size-4 text-muted-foreground" />
                  <span className="text-sm">{product.shipping || "Standard shipping (7-14 days)"}</span>
                </div>
              </div>

              <div className="space-y-1 pt-2">
                <p className="text-sm text-muted-foreground">Supplier Reliability</p>
                <div className="flex items-center gap-1">
                  <CheckCircle className="size-4 text-green-500" />
                  <span className="text-sm text-green-600">Verified supplier</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}