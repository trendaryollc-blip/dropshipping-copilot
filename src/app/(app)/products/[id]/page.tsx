"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { useAppStore } from "@/store/useAppStore"
import { useAuthStore } from "@/store/useAuthStore"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, AlertCircle, Package, ShoppingCart, DollarSign, Edit, Check, X } from "lucide-react"
import { toast } from "sonner"
import { ProductStatus } from "@/types"

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)

  const { products, updateProductStatus, deleteProduct } = useAppStore()
  const { isAuthenticated } = useAuthStore()
  const router = useRouter()
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [tempProduct, setTempProduct] = useState<any>(null)

  useEffect(() => {
    async function init() {
      if (!isAuthenticated) {
        router.push("/auth/login")
        return
      }

      const foundProduct = products.find((p: any) => p.id === id)
      if (foundProduct) {
        setProduct(foundProduct)
        setTempProduct({ ...foundProduct })
      } else {
        setError("Product not found")
      }
      setLoading(false)
    }
    init()
  }, [id, isAuthenticated, products])

  const handleStatusChange = async (newStatus: ProductStatus) => {
    try {
      await updateProductStatus(id, newStatus)
      toast.success(`Product status updated to ${newStatus}`)
      setProduct({ ...product, status: newStatus })
    } catch (err) {
      toast.error("Failed to update product status")
    }
  }

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return
    }

    try {
      await deleteProduct(id)
      toast.success("Product deleted successfully")
      router.push("/products")
    } catch (err) {
      toast.error("Failed to delete product")
    }
  }

  const handleEdit = () => {
    setEditMode(true)
    setTempProduct({ ...product })
  }

  const handleSave = () => {
    // In a real app, you would update the product in Firestore
    toast.success("Product updated successfully")
    setEditMode(false)
    setProduct({ ...tempProduct })
  }

  const handleCancel = () => {
    setEditMode(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setTempProduct((prev: any) => ({
      ...prev,
      [name]: value
    }))
  }

  if (loading) {
    return <div className="p-6">Loading product details...</div>
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>
  }

  if (!product) {
    return <div className="p-6">Product not found</div>
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Product Details</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push("/products")}
          >
            Back to Products
          </Button>
          {editMode ? (
            <>
              <Button
                variant="outline"
                onClick={handleCancel}
              >
                <X className="size-4" />
              </Button>
              <Button
                onClick={handleSave}
              >
                <Check className="size-4" />
                Save
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              onClick={handleEdit}
            >
              <Edit className="size-4" />
              Edit
            </Button>
          )}
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <CardTitle className="text-2xl">{product.name}</CardTitle>
              <div className="flex gap-2 mt-2">
                <Badge variant="secondary">{product.status}</Badge>
                <Badge variant="secondary">{product.niche}</Badge>
                <Badge variant="secondary">{product.supplierName}</Badge>
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              <Button
                variant="outline"
                onClick={() => handleStatusChange(product.status === "active" ? "draft" : "active")}
              >
                {product.status === "active" ? "Deactivate" : "Activate"}
              </Button>
              <Button
                variant="destructive"
                className="ml-2"
                onClick={handleDelete}
              >
                Delete
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="size-4 text-primary" />
                  <span className="text-xl font-bold">${product.price?.toFixed(2) || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Package className="size-4 text-primary" />
                  <span className="text-lg">N/A in stock</span>
                </div>
              </div>
            </div>

            <div>
              <div className="mb-4">
                <Label className="text-sm font-medium">Description</Label>
                {editMode ? (
                  <Input
                    name="description"
                    value={tempProduct.description || ""}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                ) : (
                  <p className="text-muted-foreground">{product.description || "No description available"}</p>
                )}
              </div>

              <div className="mb-4">
                <Label className="text-sm font-medium">Price Range</Label>
                <div className="flex items-center gap-2">
                  <span>${product.priceRange?.min?.toFixed(2)}</span>
                  <span>to</span>
                  <span>${product.priceRange?.max?.toFixed(2)}</span>
                </div>
              </div>

              <div className="mb-4">
                <Label className="text-sm font-medium">Supplier</Label>
                {editMode ? (
                  <Input
                    name="supplierName"
                    value={tempProduct.supplierName || ""}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                ) : (
                  <p className="text-muted-foreground">{product.supplierName}</p>
                )}
              </div>

              <div className="mb-4">
                <Label className="text-sm font-medium">Competition Level</Label>
                <div className="flex gap-2">
                  {["low", "medium", "high"].map((level) => (
                    <Badge
                      key={level}
                      variant={product.competition === level ? "default" : "secondary"}
                      className="cursor-pointer"
                    >
                      {level}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="details" className="mt-6">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="supplier">Supplier</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Niche</Label>
                  <p className="text-muted-foreground">{product.niche}</p>
                </div>

                <div>
                  <Label className="text-sm font-medium">Trend Score</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold">{product.trendScore}</span>
                    <Badge variant="secondary">
                      {product.trendScore > 70 ? "High" : product.trendScore > 50 ? "Medium" : "Low"}
                    </Badge>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Created At</Label>
                  <p className="text-muted-foreground">
                    {new Date(product.createdAt).toLocaleString()}
                  </p>
                </div>

                <div>
                  <Label className="text-sm font-medium">Last Updated</Label>
                  <p className="text-muted-foreground">
                    {new Date(product.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Product Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Views</span>
                    <span className="text-sm">{product.views || 0}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${(product.views || 0) / 1000 * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Sales</span>
                    <span className="text-sm">N/A</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full">
                    <div className="h-full bg-primary rounded-full" style={{ width: '50%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Conversion Rate</span>
                    <span className="text-sm">N/A</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full">
                    <div className="h-full bg-primary rounded-full" style={{ width: '30%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Average Order Value</span>
                    <span className="text-sm">N/A</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full">
                    <div className="h-full bg-primary rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="supplier">
          <Card>
            <CardHeader>
              <CardTitle>Supplier Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Supplier Name</Label>
                  <p className="text-muted-foreground">{product.supplierName}</p>
                </div>

                <div>
                  <Label className="text-sm font-medium">Trust Score</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold">8.5/10</span>
                    <Badge variant="secondary">High</Badge>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Response Time</Label>
                  <p className="text-muted-foreground">24-48 hours</p>
                </div>

                <div>
                  <Label className="text-sm font-medium">Country</Label>
                  <p className="text-muted-foreground">United States</p>
                </div>

                <div>
                  <Label className="text-sm font-medium">Categories</Label>
                  <div className="flex flex-wrap gap-2">
                    {["Electronics", "Accessories", "Home & Garden"].map((category) => (
                      <Badge key={category} variant="secondary">
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}