"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/useAuthStore"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Check, ArrowRight } from "lucide-react"

interface Step {
  id: string
  title: string
  description: string
  completed: boolean
}

export default function OnboardingWizard() {
  const [currentStep, setCurrentStep] = useState(0)
  const { user, completeOnboarding, isInitialised } = useAuthStore()
  const router = useRouter()

  const steps: Step[] = [
    {
      id: "setup-profile",
      title: "Complete Your Profile",
      description: "Add your business details to get started with DropEase.",
      completed: false
    },
    {
      id: "connect-suppliers",
      title: "Connect Your Suppliers",
      description: "Link your supplier accounts to automate product imports.",
      completed: false
    },
    {
      id: "set-up-automations",
      title: "Set Up Automations",
      description: "Configure automated workflows to save time and increase sales.",
      completed: false
    }
  ]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      completeOnboarding(user?.id || "")
      toast.success("Onboarding completed successfully!")
      router.push("/dashboard")
    }
  }

  const handleComplete = () => {
    completeOnboarding(user?.id || "")
    toast.success("Onboarding completed successfully!")
    router.push("/dashboard")
  }

  if (!user || isInitialised) {
    return null
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card className="shadow-lg">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-xl font-bold">Onboarding Wizard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Progress bar */}
            <Progress
              value={(currentStep / steps.length) * 100}
              className="h-2"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${index <= currentStep ? 'bg-primary' : 'bg-muted'}`} />
                  <span>{step.title}</span>
                </div>
              ))}
            </div>

            {/* Current step content */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">{steps[currentStep].title}</h2>
              <p className="text-muted-foreground">{steps[currentStep].description}</p>

              {/* Step content */}
              {currentStep === 0 && (
                <div className="space-y-3">
                  <p>Please fill out your business information to complete your profile.</p>
                  <Button variant="outline" className="w-full">
                    Connect Your Business
                  </Button>
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-3">
                  <p>Connect your supplier accounts to automatically import products.</p>
                  <Button variant="outline" className="w-full">
                    Connect Suppliers
                  </Button>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-3">
                  <p>Set up automated workflows to save time and increase sales.</p>
                  <Button variant="outline" className="w-full">
                    Configure Automations
                  </Button>
                </div>
              )}
            </div>

            {/* Navigation buttons */}
            <div className="flex justify-between">
              {currentStep > 0 && (
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="text-sm"
                >
                  Back
                </Button>
              )}

              {currentStep < steps.length - 1 ? (
                <Button
                  onClick={handleNext}
                  className="text-sm"
                >
                  <ArrowRight className="mr-2 size-4" />
                  Next
                </Button>
              ) : (
                <Button
                  onClick={handleComplete}
                  className="text-sm"
                >
                  <Check className="mr-2 size-4" />
                  Complete Onboarding
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}