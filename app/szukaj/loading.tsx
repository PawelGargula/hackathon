import { Skeleton } from "@/components/ui/skeleton";
import {
  PageHeadingSkeleton,
  RideCardSkeletonList,
} from "@/components/ride-card-skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl min-w-0">
      <PageHeadingSkeleton />

      <div className="mt-6">
        <Skeleton className="h-16 w-full rounded-2xl xl:h-14 xl:rounded-full" />
      </div>

      <div className="mt-6 grid min-w-0 gap-6 lg:grid-cols-[18rem_1fr]">
        <aside className="hidden lg:block">
          <Skeleton className="h-72 w-full rounded-2xl" />
        </aside>
        <div className="min-w-0">
          <Skeleton className="mb-3 h-4 w-40" />
          <RideCardSkeletonList count={4} />
        </div>
      </div>
    </div>
  );
}
