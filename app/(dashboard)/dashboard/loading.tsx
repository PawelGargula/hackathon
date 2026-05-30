import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-5xl min-w-0 px-6 py-16">
      <Skeleton className="h-9 w-48" />
      <Skeleton className="mt-3 h-4 w-96 max-w-full" />

      <div className="mt-8 max-w-md space-y-3 rounded-xl border border-border p-6">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-52" />
        <Skeleton className="h-4 w-44" />
      </div>
    </div>
  );
}
