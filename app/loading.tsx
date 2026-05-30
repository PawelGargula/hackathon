import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
  return (
    <div className="flex min-h-[50vh] w-full items-center justify-center py-20 text-muted-foreground">
      <Spinner className="size-7" />
      <span className="sr-only">Ładowanie…</span>
    </div>
  );
}
