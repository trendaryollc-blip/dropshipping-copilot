import { AIWorkflowSection } from "./AIWorkflowSection"
import { FAQSection } from "./FAQSection"
import { FeatureShowcase } from "./FeatureShowcase"
import { LandingCTA } from "./LandingCTA"
import { LandingFooter } from "./LandingFooter"
import { LandingHero } from "./LandingHero"
import { LandingNav } from "./LandingNav"
import { PricingSection } from "./PricingSection"
import { ProductDiscoveryPreview } from "./ProductDiscoveryPreview"
import { TestimonialsSection } from "./TestimonialsSection"
import { TrustMetricsSection } from "./TrustMetricsSection"
import { WorkflowComparison } from "./WorkflowComparison"

export function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f8f7ff] text-slate-950 dark:bg-[#050511] dark:text-slate-100">
      <div className="landing-background" aria-hidden="true" />
      <LandingNav />
      <main>
        <LandingHero />
        <ProductDiscoveryPreview />
        <TrustMetricsSection />
        <FeatureShowcase />
        <WorkflowComparison />
        <TestimonialsSection />
        <PricingSection />
        <FAQSection />
        <LandingCTA />
      </main>
      <LandingFooter />
    </div>
  )
}
