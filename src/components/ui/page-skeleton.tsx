"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface PageSkeletonProps {
  className?: string
}

export function PageSkeleton({ className }: PageSkeletonProps) {
  return (
    <div className={cn("space-y-6 p-4 lg:p-6", className)}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-10 w-full max-w-[420px] rounded-3xl" />
        <Skeleton className="h-10 w-full max-w-[240px] rounded-3xl" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {[...Array(3)].map((_, idx) => (
          <Skeleton key={idx} className="h-40 rounded-[2rem]" />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_420px]">
        <Skeleton className="h-72 rounded-[2rem]" />
        <Skeleton className="h-96 rounded-[2rem]" />
      </div>
    </div>
  )
}
