import { Car, Leaf } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({
  withText = true,
  className,
}: {
  withText?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("flex items-center gap-2", className)}>
      <span className="relative grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
        <Car className="size-5" />
        <Leaf className="absolute -right-1 -top-1 size-3.5 rounded-full bg-emerald-500 p-0.5 text-white ring-2 ring-card" />
      </span>
      {withText && (
        <span className="flex flex-col leading-none">
          <span className="font-heading text-base font-bold tracking-tight">
            Razem w Drogę
          </span>
          <span className="text-[11px] font-medium text-muted-foreground">
            Wspólne przejazdy po Sądecczyźnie
          </span>
        </span>
      )}
    </span>
  );
}
