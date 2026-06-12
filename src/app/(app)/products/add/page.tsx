"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAppStore } from "@/store/useAppStore"
import { useAuthStore } from "@/store/useAuthStore"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Plus, ArrowLeft, Check } from "lucide-react"

interface FormData {
  name: string;
  description: string;
  niche: string;
  supplierName: string;
  priceRange: { min: number; max: number };
  competition: string;
  trendScore: number;
}

export default function AddProductPage() {
  const { importProduct } = useAppStore()
  const { isAuthenticated } = useAuthStore()
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    niche: "",
    supplierName: "",
    priceRange: { min: 10, max: 20 },
    competition: "medium",
    trendScore: 50
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePriceRangeChange = (field: "min" | "max", value: number) => {
    setFormData(prev => ({
      ...prev,
      priceRange: {
        ...prev.priceRange,
        [field]: value
      }
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Convert form data to Product type
      const productData: any = {
        ...formData,
        id: Math.random().toString(36).substring(2, 9), // Generate random ID
        image: "https://picsum.photos/seed/" + formData.name.toLowerCase().replace(/\s+/g, "-") + "/400/300",
        status: "draft" as const,
        importedAt: new Date().toISOString().split("T")[0]
      }
      await importProduct(productData)
      toast.success("Product added successfully!")
      router.push("/products")
    } catch (err) {
      toast.error("Failed to add product")
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated) {
    router.push("/auth/login")
    return <div>Redirecting to login...</div>
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Add New Product</h1>
        <Button
          variant="outline"
          onClick={() => router.push("/products")}
        >
          <ArrowLeft className="size-4" />
          Back to Products
        </Button>
      </div>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Product Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-sm font-medium">Product Name</Label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label className="text-sm font-medium">Supplier Name</Label>
                <Input
                  name="supplierName"
                  value={formData.supplierName}
                  onChange={handleChange}
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label className="text-sm font-medium">Niche</Label>
                <Select
                  name="niche"
                  value={formData.niche}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, niche: value || "" }))}
                  required
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select niche" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="clothing">Clothing</SelectItem>
                    <SelectItem value="home">Home & Garden</SelectItem>
                    <SelectItem value="beauty">Beauty</SelectItem>
                    <SelectItem value="sports">Sports & Fitness</SelectItem>
                    <SelectItem value="toys">Toys & Games</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Competition Level</Label>
            <Select
                name="competition"
                value={formData.competition}
                onValueChange={(value) => setFormData(prev => ({ ...prev, competition: value || "medium" }))}
              >
                <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select competition level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Description</Label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="mt-1"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-sm font-medium">Price Range (Min)</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.priceRange.min}
                  onChange={(e) => handlePriceRangeChange("min", parseFloat(e.target.value) || 0)}
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label className="text-sm font-medium">Price Range (Max)</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.priceRange.max}
                  onChange={(e) => handlePriceRangeChange("max", parseFloat(e.target.value) || 0)}
                  className="mt-1"
                  required
                />
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Trend Score (1-100)</Label>
              <Input
                type="number"
                min="1"
                max="100"
                value={formData.trendScore}
                onChange={handleChange}
                className="mt-1"
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/products")}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="mr-2">Adding...</span>
                    <Plus className="size-4 animate-spin" />
                  </>
                ) : (
                  <>
                    <Check className="size-4 mr-2" />
                    Add Product
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}