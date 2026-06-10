import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "Terms of Service – DropEase",
}

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <Link href="/auth/login" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-8">
        <ArrowLeft className="size-3.5" />
        Back to sign in
      </Link>
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      <div className="prose prose-sm dark:prose-invert max-w-none space-y-4 text-muted-foreground">
        <p><strong>Last updated:</strong> June 2026</p>
        <h2 className="text-lg font-semibold text-foreground mt-8">1. Acceptance of Terms</h2>
        <p>By accessing or using DropEase (&ldquo;the Service&rdquo;), you agree to be bound by these Terms of Service. If you do not agree, do not use the Service.</p>
        <h2 className="text-lg font-semibold text-foreground mt-8">2. Description of Service</h2>
        <p>DropEase provides AI-powered tools for dropshipping product research, supplier discovery, description generation, order management, and analytics.</p>
        <h2 className="text-lg font-semibold text-foreground mt-8">3. User Accounts</h2>
        <p>You are responsible for maintaining the confidentiality of your account credentials. You must notify us immediately of any unauthorized use.</p>
        <h2 className="text-lg font-semibold text-foreground mt-8">4. Acceptable Use</h2>
        <p>You agree not to use the Service for any unlawful purpose or in violation of any applicable laws or regulations.</p>
        <h2 className="text-lg font-semibold text-foreground mt-8">5. Limitation of Liability</h2>
        <p>DropEase is provided &ldquo;as is&rdquo; without warranties of any kind. We are not liable for any damages arising from your use of the Service.</p>
        <h2 className="text-lg font-semibold text-foreground mt-8">6. Changes</h2>
        <p>We reserve the right to modify these terms at any time. Changes will be effective upon posting.</p>
        <h2 className="text-lg font-semibold text-foreground mt-8">7. Contact</h2>
        <p>For questions about these terms, contact support@dropease.com.</p>
      </div>
    </div>
  )
}