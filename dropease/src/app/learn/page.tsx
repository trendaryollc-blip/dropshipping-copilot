"use client"

import { useState } from "react"
import { BookOpen, Clock, ChevronDown, Rocket, TrendingUp, Users, Megaphone, BarChart3 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { learnArticles } from "@/lib/mock-data"

const CATEGORIES = [
  { key: "Getting Started", icon: Rocket, color: "text-blue-500" },
  { key: "Product Research", icon: TrendingUp, color: "text-emerald-500" },
  { key: "Supplier Tips", icon: Users, color: "text-purple-500" },
  { key: "Marketing", icon: Megaphone, color: "text-amber-500" },
  { key: "Scaling", icon: BarChart3, color: "text-rose-500" },
]

const FEATURED_TIPS = [
  { emoji: "🎯", title: "Start Narrow", tip: "Focus on ONE niche. It's easier to market to a specific audience than to everyone." },
  { emoji: "💰", title: "Test With Small Budget", tip: "Never spend more than $20 on ads before you have proof a product can sell." },
  { emoji: "⚡", title: "Speed Wins", tip: "Find suppliers with fast shipping. Customers hate waiting – 7-14 days max is ideal." },
  { emoji: "📸", title: "Great Photos = More Sales", tip: "Use lifestyle photos, not just plain product images. Show the product in use." },
]

export default function LearnPage() {
  const [activeTab, setActiveTab] = useState("Getting Started")

  const tabArticles = learnArticles.filter((a) => a.category === activeTab)

  return (
    <div className="space-y-5">
      <div>
        <h1 className="page-header">Learning Hub</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Everything you need to know to start and grow your dropshipping business.
        </p>
      </div>

      {/* Featured Tips */}
      <div>
        <h2 className="mb-3 text-sm font-semibold text-foreground flex items-center gap-2">
          <BookOpen className="size-4 text-primary" /> Quick Tips for Beginners
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURED_TIPS.map((tip) => (
            <Card key={tip.title} className="border-border">
              <CardContent className="p-3.5">
                <p className="text-xl mb-2">{tip.emoji}</p>
                <p className="text-xs font-semibold text-foreground">{tip.title}</p>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{tip.tip}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Learning Articles */}
      <div>
        <h2 className="mb-3 text-sm font-semibold text-foreground flex items-center gap-2">
          <BookOpen className="size-4 text-primary" /> Guides &amp; Articles
        </h2>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4 h-auto flex-wrap gap-1 bg-muted/50 p-1">
            {CATEGORIES.map(({ key, icon: Icon, color }) => (
              <TabsTrigger key={key} value={key} className="gap-1.5 text-xs data-[state=active]:bg-card data-[state=active]:shadow-sm">
                <Icon className={`size-3.5 ${color}`} />
                {key}
              </TabsTrigger>
            ))}
          </TabsList>

          {CATEGORIES.map(({ key }) => (
            <TabsContent key={key} value={key}>
              {learnArticles.filter((a) => a.category === key).length > 0 ? (
                <Accordion type="single" collapsible className="space-y-2">
                  {learnArticles
                    .filter((a) => a.category === key)
                    .map((article) => (
                      <AccordionItem
                        key={article.id}
                        value={article.id}
                        className="rounded-xl border border-border bg-card px-4 py-0 overflow-hidden"
                      >
                        <AccordionTrigger className="py-3.5 hover:no-underline">
                          <div className="flex flex-1 items-start gap-3 text-left">
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-semibold text-foreground leading-snug">{article.title}</p>
                              <p className="mt-0.5 text-xs text-muted-foreground">{article.summary}</p>
                            </div>
                            <div className="flex shrink-0 items-center gap-2">
                              <Badge className="flex items-center gap-1 text-[10px] bg-muted text-muted-foreground border-border">
                                <Clock className="size-2.5" /> {article.readTime}
                              </Badge>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="pb-4 pt-0">
                            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                              {article.content}
                            </p>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                </Accordion>
              ) : (
                <div className="flex flex-col items-center gap-3 py-16 text-center rounded-xl border border-dashed border-border">
                  <BookOpen className="size-10 text-muted-foreground/30" />
                  <p className="text-sm text-muted-foreground">More guides coming soon!</p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}
