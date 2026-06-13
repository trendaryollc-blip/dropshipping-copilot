"use client"

import Link from "next/link"
import { useState } from "react"
import { BookOpen, Clock, ChevronDown, Rocket, TrendingUp, Users, Megaphone, BarChart3, ShoppingCart, Search, FileText } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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

const FEATURED_GUIDES = learnArticles.slice(0, 3)

const LEARN_FAQS = [
  {
    question: "What should I research first?",
    answer: "Start with product demand, supplier reliability, and shipping speed to avoid low-margin or delayed listings.",
  },
  {
    question: "How do I validate a new product?",
    answer: "Use competitor research, ad interest, and supplier quotes before you place your first test order.",
  },
  {
    question: "How do I keep profit margins healthy?",
    answer: "Track landed cost, fees, and shipping so you only scale products with 30%+ gross margin.",
  },
]

export default function LearnPage() {
  const [activeTab, setActiveTab] = useState("Getting Started")

  const tabArticles = learnArticles.filter((a) => a.category === activeTab)

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl border border-border/50 bg-card/60 p-6 backdrop-blur-sm sm:p-8 animate-in">
        <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-violet-500/5 blur-3xl" />
        <div className="absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-primary/5 blur-2xl" />
        <div className="relative z-10 flex flex-col gap-4">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-violet-600 dark:text-violet-400">
              <BookOpen className="size-3" />
              Learning Hub
            </span>
            <h1 className="hero-title">Learning Hub</h1>
            <p className="max-w-lg text-sm leading-relaxed text-muted-foreground/70">
              Everything you need to know to start and grow your dropshipping business.
            </p>
          </div>
        </div>
      </section>

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

      <section className="grid gap-4 lg:grid-cols-3">
        {[
          {
            title: "Launch a Product",
            description: "Open the product editor and start a new listing with import-ready details.",
            href: "/products/new",
            icon: ShoppingCart,
          },
          {
            title: "Run a Search",
            description: "Use search tools to discover winning products and supplier matches.",
            href: "/search",
            icon: Search,
          },
          {
            title: "View Guides",
            description: "Browse curated articles, workflows, and watch next-step tutorials.",
            href: "/learn",
            icon: FileText,
          },
        ].map((item) => {
          const Icon = item.icon
          return (
            <Link key={item.title} href={item.href} className="group rounded-3xl border border-border/70 bg-background p-5 transition hover:border-primary/70 hover:bg-primary/5">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon className="size-4" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{item.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                </div>
              </div>
            </Link>
          )
        })}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4 rounded-3xl border border-border/70 bg-background p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-foreground">Popular guides</p>
              <p className="mt-1 text-sm text-muted-foreground">Browse the most useful articles that help you take immediate action.</p>
            </div>
            <Button asChild>
              <Link href="/learn">See all</Link>
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURED_GUIDES.map((article) => (
              <Card key={article.id} className="border-border overflow-hidden">
                <CardHeader className="space-y-2 p-4">
                  <CardTitle className="text-sm">{article.title}</CardTitle>
                  <p className="text-xs text-muted-foreground">{article.summary}</p>
                </CardHeader>
                <CardContent className="flex flex-col gap-3 border-t border-border/70 p-4 pt-3">
                  <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                    <span>{article.category}</span>
                    <span>{article.readTime}</span>
                  </div>
                  <Button asChild size="sm">
                    <Link href={`/learn#${article.id}`}>Read guide</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-border/70 bg-card p-6">
          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold text-foreground">FAQ & common mistakes</p>
              <p className="mt-1 text-sm text-muted-foreground">Quick answers to the questions most new sellers ask first.</p>
            </div>
            <div className="space-y-4">
              {LEARN_FAQS.map((faq) => (
                <div key={faq.question} className="rounded-3xl border border-border/70 bg-background p-4">
                  <p className="text-sm font-semibold text-foreground">{faq.question}</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

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
