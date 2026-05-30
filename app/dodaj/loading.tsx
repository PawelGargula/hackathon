import { Skeleton } from "@/components/ui/skeleton";
import { PageHeadingSkeleton } from "@/components/ride-card-skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-2xl">
      <PageHeadingSkeleton />

      <div className="mt-6 grid gap-5 rounded-2xl bg-card p-5 ring-1 ring-border">
        <FieldSkeleton />
        <FieldSkeleton />
        <Skeleton className="h-9 w-36 rounded-lg" />

        <div className="grid gap-4 sm:grid-cols-3">
          <FieldSkeleton />
          <FieldSkeleton />
          <FieldSkeleton />
        </div>

        <div className="grid gap-1.5">
          <Skeleton className="h-3.5 w-28" />
          <Skeleton className="h-20 w-full rounded-lg" />
        </div>

        <Skeleton className="h-9 w-full rounded-lg sm:w-44" />
      </div>
    </div>
  );
}

function FieldSkeleton() {
  return (
    <div className="grid gap-1.5">
      <Skeleton className="h-3.5 w-24" />
      <Skeleton className="h-9 w-full rounded-lg" />
    </div>
  );
}
