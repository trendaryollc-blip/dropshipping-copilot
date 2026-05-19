"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileText, CheckCircle, Clock, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import { communicationService } from "@/lib/supplier-service"

interface Quote {
  quoteId: string
  supplierId: string
  items: { productId: string; quantity: number }[]
  status: "pending" | "received" | "accepted" | "expired"
  requestedAt: string
  expiresAt: string
  proposedPrice?: number
}

export function SupplierQuoteManager() {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(false)

  const handleRequestQuote = async (
    supplierId: string,
    items: { productId: string; quantity: number }[],
    message?: string
  ) => {
    setLoading(true)
    try {
      const result = await communicationService.requestQuote(supplierId, items, message)
      const newQuote: Quote = {
        quoteId: result.quoteId,
        supplierId,
        items,
        status: "pending",
        requestedAt: new Date().toISOString(),
        expiresAt: result.expiresAt,
      }
      setQuotes([newQuote, ...quotes])
      toast.success(`Quote ${result.quoteId} requested!`)
    } catch (error) {
      toast.error("Failed to request quote")
    } finally {
      setLoading(false)
    }
  }

  const handleAcceptQuote = (quoteId: string) => {
    setQuotes(
      quotes.map((q) => (q.quoteId === quoteId ? { ...q, status: "accepted" as const } : q))
    )
    toast.success("Quote accepted! Converting to order...")
  }

  const getStatusColor = (status: Quote["status"]) => {
    switch (status) {
      case "pending":
        return "yellow"
      case "received":
        return "blue"
      case "accepted":
        return "green"
      case "expired":
        return "red"
    }
  }

  return (
    <div className="space-y-6">
      {/* Request Quote */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-semibold flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Request Quote from Supplier
            </h3>
            <p className="text-sm text-muted-foreground">Get pricing for bulk orders</p>
          </div>
          <Dialog>
            <DialogTrigger
              render={
                <Button>Request Quote</Button>
              }
            />
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Request Supplier Quote</DialogTitle>
              </DialogHeader>
              <QuoteRequestForm onSubmit={handleRequestQuote} />
            </DialogContent>
          </Dialog>
        </div>
      </Card>

      {/* Quote History */}
      <Card className="p-6">
        <h3 className="font-semibold mb-6">Quote History</h3>
        <div className="space-y-4">
          {quotes.length === 0 ? (
            <p className="text-sm text-muted-foreground">No quotes requested yet</p>
          ) : (
            quotes.map((quote) => (
              <div
                key={quote.quoteId}
                className="border rounded-lg p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {quote.status === "pending" && <Clock className="h-5 w-5 text-yellow-500" />}
                    {quote.status === "received" && <CheckCircle className="h-5 w-5 text-blue-500" />}
                    {quote.status === "accepted" && <CheckCircle className="h-5 w-5 text-green-500" />}
                    {quote.status === "expired" && <AlertCircle className="h-5 w-5 text-red-500" />}
                    <div>
                      <p className="font-medium">{quote.quoteId}</p>
                      <p className="text-xs text-muted-foreground">
                        Supplier ID: {quote.supplierId}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline">{quote.status}</Badge>
                </div>

                <div className="text-sm text-muted-foreground space-y-1">
                  <p>Requested: {new Date(quote.requestedAt).toLocaleDateString()}</p>
                  <p>Expires: {new Date(quote.expiresAt).toLocaleDateString()}</p>
                  {quote.proposedPrice && (
                    <p className="font-semibold text-foreground">
                      Proposed Price: ${quote.proposedPrice.toFixed(2)}
                    </p>
                  )}
                </div>

                <div className="text-sm">
                  <p className="font-medium mb-2">Items:</p>
                  <ul className="text-muted-foreground space-y-1">
                    {quote.items.map((item) => (
                      <li key={item.productId}>
                        • Product {item.productId}: {item.quantity} units
                      </li>
                    ))}
                  </ul>
                </div>

                {quote.status === "received" && (
                  <Button
                    size="sm"
                    onClick={() => handleAcceptQuote(quote.quoteId)}
                    className="w-full"
                  >
                    Accept Quote
                  </Button>
                )}
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  )
}

interface QuoteRequestFormProps {
  onSubmit: (
    supplierId: string,
    items: { productId: string; quantity: number }[],
    message?: string
  ) => void
}

function QuoteRequestForm({ onSubmit }: QuoteRequestFormProps) {
  const [supplierId, setSupplierId] = useState("")
  const [items, setItems] = useState<{ productId: string; quantity: number }[]>([
    { productId: "", quantity: 1 },
  ])
  const [message, setMessage] = useState("")

  const handleAddItem = () => {
    setItems([...items, { productId: "", quantity: 1 }])
  }

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const handleItemChange = (
    index: number,
    field: "productId" | "quantity",
    value: string | number
  ) => {
    setItems(
      items.map((item, i) =>
        i === index
          ? {
              ...item,
              [field]: field === "quantity" ? parseInt(value.toString()) : value,
            }
          : item
      )
    )
  }

  const handleSubmit = () => {
    if (!supplierId || items.some((item) => !item.productId || item.quantity < 1)) {
      toast.error("Please fill in all required fields")
      return
    }
    onSubmit(supplierId, items, message || undefined)
  }

  return (
    <div className="space-y-4">
      <Input
        placeholder="Supplier ID"
        value={supplierId}
        onChange={(e) => setSupplierId(e.target.value)}
      />

      <div>
        <label className="text-sm font-medium">Items</label>
        <div className="space-y-2 mt-2">
          {items.map((item, index) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder="Product ID"
                value={item.productId}
                onChange={(e) => handleItemChange(index, "productId", e.target.value)}
                className="flex-1"
              />
              <Input
                type="number"
                placeholder="Qty"
                value={item.quantity}
                onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                className="w-20"
                min="1"
              />
              {items.length > 1 && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleRemoveItem(index)}
                >
                  ✕
                </Button>
              )}
            </div>
          ))}
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={handleAddItem}
          className="mt-2 w-full"
        >
          + Add Item
        </Button>
      </div>

      <Textarea
        placeholder="Additional message (optional)"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <Button onClick={handleSubmit} className="w-full">
        Request Quote
      </Button>
    </div>
  )
}
