import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "Privacy Policy – DropEase",
}

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <Link href="/auth/login" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-8">
        <ArrowLeft className="size-3.5" />
        Back to sign in
      </Link>
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <div className="prose prose-sm dark:prose-invert max-w-none space-y-4 text-muted-foreground">
        <p><strong>Last updated:</strong> June 2026</p>
        <h2 className="text-lg font-semibold text-foreground mt-8">1. Information We Collect</h2>
        <p>We collect information you provide directly, including your name, email address, and account credentials. We also collect usage data to improve our Service.</p>
        <h2 className="text-lg font-semibold text-foreground mt-8">2. How We Use Your Information</h2>
        <p>We use your information to provide, maintain, and improve the Service; to send transactional emails; and to comply with legal obligations.</p>
        <h2 className="text-lg font-semibold text-foreground mt-8">3. Data Sharing</h2>
        <p>We do not sell your personal information. We may share data with third-party service providers (e.g., Firebase, Resend) who help us operate the Service.</p>
        <h2 className="text-lg font-semibold text-foreground mt-8">4. Data Security</h2>
        <p>We implement industry-standard security measures including encryption at rest and in transit, but no method of transmission is 100% secure.</p>
        <h2 className="text-lg font-semibold text-foreground mt-8">5. Your Rights</h2>
        <p>You may access, update, or delete your account data at any time. Contact us at privacy@dropease.com for data requests.</p>
        <h2 className="text-lg font-semibold text-foreground mt-8">6. Cookies</h2>
        <p>We use essential cookies for authentication and session management. We do not use third-party tracking cookies.</p>
        <h2 className="text-lg font-semibold text-foreground mt-8">7. Contact</h2>
        <p>For privacy inquiries, contact privacy@dropease.com.</p>
      </div>
    </div>
  )
}