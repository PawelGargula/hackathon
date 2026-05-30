import Image from "next/image";
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
      <Image
        src="/logo-mini-primary.png"
        alt="Razem w Drogę Logo"
        width={36}
        height={36}
        className="object-contain"
      />
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
