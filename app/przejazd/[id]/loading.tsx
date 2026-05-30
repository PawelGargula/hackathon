import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-5xl min-w-0">
      <Skeleton className="h-4 w-40" />

      <div className="mt-4 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-5">
          <Skeleton className="h-64 w-full rounded-2xl sm:h-80" />

          <div className="space-y-3 rounded-2xl bg-card p-5 ring-1 ring-border">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-24 rounded-full" />
              <Skeleton className="h-5 w-28 rounded-full" />
            </div>
            <Skeleton className="h-7 w-3/4" />
            <div className="flex gap-4">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>

          <div className="space-y-3 rounded-2xl bg-card p-5 ring-1 ring-border">
            <Skeleton className="h-5 w-28" />
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-2/3" />
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <div className="space-y-3 rounded-2xl bg-card p-5 ring-1 ring-border">
            <Skeleton className="h-5 w-24" />
            <div className="flex items-center gap-3">
              <Skeleton className="size-12 rounded-full" />
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          </div>
          <div className="rounded-2xl bg-card p-5 ring-1 ring-border">
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
