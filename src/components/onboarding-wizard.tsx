"use client"

import { useState } from "react"
import { Search, Users, BookOpen, Zap, ChevronRight, CheckCircle } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useAuthStore } from "@/store/useAuthStore"
import Link from "next/link"

const STEPS = [
  {
    icon: Zap,
    emoji: "👋",
    title: "Welcome to DropEase!",
    description: "You're about to start your dropshipping journey. DropEase helps you find products, discover suppliers, and manage your store — all in one place.",
    cta: null,
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Search,
    emoji: "🔍",
    title: "Find Your First Product",
    description: "Start with the Product Research page to discover trending items with low competition. Aim for a trend score above 75 and low competition level.",
    cta: { label: "Browse Products →", href: "/products" },
    color: "bg-success-light text-success",
  },
  {
    icon: Users,
    emoji: "🤝",
    title: "Connect with Suppliers",
    description: "Use the Suppliers page to find reliable suppliers for your products. Look for verified suppliers with high ratings and fast shipping.",
    cta: { label: "Find Suppliers →", href: "/suppliers" },
    color: "bg-primary-light text-primary",
  },
  {
    icon: BookOpen,
    emoji: "📚",
    title: "Learn as You Go",
    description: "The Learning Hub has step-by-step guides for beginners. Start with 'What is Dropshipping?' and work your way up to scaling strategies.",
    cta: { label: "Open Learning Hub →", href: "/learn" },
    color: "bg-warning-light text-warning",
  },
]

export function OnboardingWizard() {
  const { user, completeOnboarding } = useAuthStore()
  const [step, setStep] = useState(0)
  const [open, setOpen] = useState(true)

  // Only show for authenticated, non-onboarded users
  const shouldShow = user !== null && !user.isOnboarded

  if (!shouldShow) return null

  const current = STEPS[step]
  const Icon = current.icon
  const isLast = step === STEPS.length - 1

  function handleNext() {
    if (isLast) {
      completeOnboarding()
      setOpen(false)
    } else {
      setStep((s) => s + 1)
    }
  }

  function handleSkip() {
    completeOnboarding()
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) handleSkip() }} modal={false}>
      <DialogContent showCloseButton={false} showOverlay={false} className="sm:max-w-md">
        <DialogHeader>
          <div className={`mx-auto flex size-14 items-center justify-center rounded-2xl text-2xl mb-2 ${current.color}`}>
            {current.emoji}
          </div>
          <DialogTitle className="text-center text-base">{current.title}</DialogTitle>
        </DialogHeader>

        <p className="text-center text-sm text-muted-foreground leading-relaxed px-2">
          {current.description}
        </p>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-1.5">
          {STEPS.map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all ${i === step ? "w-6 bg-primary" : i < step ? "w-3 bg-primary/40" : "w-3 bg-muted"}`} />
          ))}
        </div>

        <Progress value={((step + 1) / STEPS.length) * 100} className="h-1" />

        <DialogFooter className="-mx-4 -mb-4 rounded-b-xl border-t bg-muted/50 p-4">
          <div className="flex w-full items-center justify-between">
            <Button variant="ghost" size="sm" className="text-xs" onClick={handleSkip}>
              Skip tour
            </Button>
            <div className="flex gap-2">
              {current.cta && (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  render={
                    <Link href={current.cta.href} onClick={() => setStep((s) => s + 1)}>
                      {current.cta.label}
                    </Link>
                  }
                />
              )}
              <Button size="sm" onClick={handleNext}>
                {isLast ? (
                  <><CheckCircle className="size-3.5" /> Get Started!</>
                ) : (
                  <>Next <ChevronRight className="size-3.5" /></>
                )}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}