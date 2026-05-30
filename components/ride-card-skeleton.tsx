import { Skeleton } from "@/components/ui/skeleton";

export function RideCardSkeleton() {
  return (
    <div className="flex min-w-0 flex-col gap-3 rounded-2xl bg-card p-4 ring-1 ring-border">
      <div className="flex items-center justify-between gap-2">
        <Skeleton className="h-5 w-20 rounded-full" />
        <Skeleton className="h-5 w-24 rounded-full" />
      </div>

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
        <Skeleton className="h-6 w-14" />
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-border pt-3">
        <div className="flex items-center gap-2">
          <Skeleton className="size-8 rounded-full" />
          <div className="space-y-1.5">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-2.5 w-12" />
          </div>
        </div>
        <Skeleton className="h-7 w-16 rounded-lg" />
      </div>
    </div>
  );
}

export function RideCardSkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <RideCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function PageHeadingSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-7 w-56" />
      <Skeleton className="h-4 w-80 max-w-full" />
    </div>
  );
}
