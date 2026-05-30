import { Skeleton } from "@/components/ui/skeleton";
import { PageHeadingSkeleton } from "@/components/ride-card-skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-3xl min-w-0">
      <PageHeadingSkeleton />

      <div className="mt-6 flex flex-col gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="min-w-0 rounded-2xl bg-card p-4 ring-1 ring-border"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Skeleton className="size-9 rounded-full" />
                <div className="space-y-1.5">
                  <Skeleton className="h-3.5 w-32" />
                  <Skeleton className="h-3 w-40" />
                </div>
              </div>
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <div className="mt-3 space-y-2 rounded-xl bg-muted/40 p-3">
              <Skeleton className="h-8 w-2/3 rounded-lg" />
              <Skeleton className="ml-auto h-8 w-1/2 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
