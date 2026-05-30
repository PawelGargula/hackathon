import { Skeleton } from "@/components/ui/skeleton";
import {
  PageHeadingSkeleton,
  RideCardSkeletonList,
} from "@/components/ride-card-skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-3xl min-w-0">
      <PageHeadingSkeleton />

      <div className="mt-6 flex items-center gap-2 border-b border-border pb-px">
        <Skeleton className="h-9 w-28" />
        <Skeleton className="h-9 w-28" />
      </div>

      <div className="mt-6 space-y-3">
        <Skeleton className="h-5 w-40" />
        <RideCardSkeletonList count={3} />
      </div>
    </div>
  );
}
