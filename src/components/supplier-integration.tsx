"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Star, MessageSquare, Send, TrendingUp, AlertCircle, CheckCircle } from "lucide-react"
import { toast } from "sonner"
import { ratingService, communicationService } from "@/lib/supplier-service"
import type { SupplierReview, SupplierMessage } from "@/types"

export function SupplierIntegration({ supplierId }: { supplierId: string }) {
  const [activeTab, setActiveTab] = useState<"ratings" | "messages" | "connection">("connection")
  const [reviews, setReviews] = useState<SupplierReview[]>([])
  const [messages, setMessages] = useState<SupplierMessage[]>([])
  const [loading, setLoading] = useState(false)

  const handleConnectAPI = async () => {
    setLoading(true)
    try {
      // Simulate connection
      await new Promise((resolve) => setTimeout(resolve, 1500))
      toast.success("API Connection Established!")
      setActiveTab("ratings")
    } catch (error) {
      toast.error("Connection failed")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitReview = async (rating: number, review: string) => {
    setLoading(true)
    try {
      const newReview = await ratingService.submitReview(supplierId, rating, review)
      setReviews([newReview, ...reviews])
      toast.success("Review submitted successfully!")
    } catch (error) {
      toast.error("Failed to submit review")
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = async (content: string) => {
    setLoading(true)
    try {
      const newMessage = await communicationService.sendMessage(supplierId, content)
      setMessages([newMessage, ...messages])
      toast.success("Message sent!")
    } catch (error) {
      toast.error("Failed to send message")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* API Connection */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">API Connection</h3>
            <p className="text-sm text-muted-foreground">Connect directly with supplier systems</p>
          </div>
          <Dialog>
            <DialogTrigger
              render={
                <Button variant="outline">Configure</Button>
              }
            />
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Connect Supplier API</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input placeholder="API Key" type="password" />
                <Input placeholder="API Secret" type="password" />
                <Button onClick={handleConnectAPI} disabled={loading} className="w-full">
                  {loading ? "Connecting..." : "Connect"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div className="mt-4 flex items-center gap-2 text-sm">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <span>Connected and syncing</span>
        </div>
      </Card>

      {/* Ratings Tab */}
      <Card className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="font-semibold flex items-center gap-2">
            <Star className="h-5 w-5" />
            Supplier Ratings
          </h3>
          <Dialog>
            <DialogTrigger
              render={
                <Button size="sm">Write Review</Button>
              }
            />
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Write Review</DialogTitle>
              </DialogHeader>
              <ReviewForm onSubmit={handleSubmitReview} />
            </DialogContent>
          </Dialog>
        </div>
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <p className="text-sm text-muted-foreground">No reviews yet. Be the first to review!</p>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="border-l-4 border-yellow-400 pl-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{review.author}</span>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="mt-2 text-sm">{review.review}</p>
                <p className="mt-2 text-xs text-muted-foreground">{review.helpful} people found this helpful</p>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Messages Tab */}
      <Card className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="font-semibold flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Direct Messaging
          </h3>
          <Dialog>
            <DialogTrigger
              render={
                <Button size="sm">Send Message</Button>
              }
            />
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Send Message</DialogTitle>
              </DialogHeader>
              <MessageForm onSubmit={handleSendMessage} />
            </DialogContent>
          </Dialog>
        </div>
        <div className="space-y-4 max-h-64 overflow-y-auto">
          {messages.length === 0 ? (
            <p className="text-sm text-muted-foreground">No messages yet. Start a conversation!</p>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className={`p-3 rounded-lg ${msg.sender === "Current User" ? "bg-primary-light" : "bg-muted"}`}>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{msg.sender}</span>
                  <span className="text-xs text-muted-foreground">{msg.timestamp}</span>
                </div>
                {msg.subject && <p className="text-xs text-muted-foreground mt-1">{msg.subject}</p>}
                <p className="text-sm mt-2">{msg.content}</p>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  )
}

function ReviewForm({ onSubmit }: { onSubmit: (rating: number, review: string) => void }) {
  const [rating, setRating] = useState(5)
  const [review, setReview] = useState("")

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Rating</label>
        <div className="flex gap-2 mt-2">
          {[1, 2, 3, 4, 5].map((r) => (
            <button key={r} onClick={() => setRating(r)}>
              <Star className={`h-6 w-6 ${r <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
            </button>
          ))}
        </div>
      </div>
      <Textarea placeholder="Share your experience..." value={review} onChange={(e) => setReview(e.target.value)} />
      <Button
        onClick={() => {
          onSubmit(rating, review)
          setReview("")
          setRating(5)
        }}
        className="w-full"
      >
        Submit Review
      </Button>
    </div>
  )
}

function MessageForm({ onSubmit }: { onSubmit: (content: string) => void }) {
  const [content, setContent] = useState("")

  return (
    <div className="space-y-4">
      <Textarea placeholder="Type your message..." value={content} onChange={(e) => setContent(e.target.value)} />
      <Button
        onClick={() => {
          if (content.trim()) {
            onSubmit(content)
            setContent("")
          }
        }}
        className="w-full"
      >
        <Send className="h-4 w-4 mr-2" />
        Send Message
      </Button>
    </div>
  )
}
