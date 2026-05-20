import { PageSkeleton } from "@/components/ui/page-skeleton"

export default function LoadingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageSkeleton />
    </div>
  )
}
