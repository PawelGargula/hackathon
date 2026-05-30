import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-4xl min-w-0">
      {/* Profile header */}
      <div className="flex min-w-0 flex-col gap-4 rounded-3xl bg-card p-5 ring-1 ring-border sm:flex-row sm:items-center">
        <Skeleton className="size-16 shrink-0 rounded-2xl" />
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-56" />
          <div className="flex gap-2 pt-1">
            <Skeleton className="h-7 w-40 rounded-full" />
            <Skeleton className="h-7 w-20 rounded-full" />
          </div>
        </div>
        <Skeleton className="h-7 w-24 rounded-lg" />
      </div>

      {/* CO2 + stat tiles */}
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Skeleton className="h-44 w-full rounded-2xl" />
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full rounded-2xl" />
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="mt-6 space-y-3">
        <Skeleton className="h-6 w-32" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
