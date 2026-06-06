import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-muted/50",
        className
      )}
      {...props}
    />
  )
}

function PageSkeleton() {
  return (
    <div className="space-y-6">
      {/* Hero skeleton */}
      <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-card/60 p-6 backdrop-blur-sm sm:p-8">
        <div className="space-y-3">
          <Skeleton className="h-5 w-32 rounded-full" />
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>
      </div>
      {/* Cards skeleton */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="relative overflow-hidden rounded-3xl border border-border/50 bg-card/60 p-6 backdrop-blur-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-8 w-28" />
                <Skeleton className="h-3 w-36" />
              </div>
              <Skeleton className="h-12 w-12 rounded-2xl" />
            </div>
            <Skeleton className="mt-4 h-5 w-24 rounded-full" />
          </div>
        ))}
      </div>
      {/* Table skeleton */}
      <div className="overflow-hidden rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm">
        <div className="space-y-0">
          <div className="flex items-center gap-4 border-b border-border/20 px-4 py-3">
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-16" />
          </div>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 border-b border-border/10 px-4 py-3">
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export { Skeleton, PageSkeleton }