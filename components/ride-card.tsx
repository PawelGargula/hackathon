import Link from "next/link";
import { ArrowRight, BadgeCheck, Clock, Star, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { RideTypeBadge } from "@/components/ride-type-badge";
import { formatDateTime, formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

export type RideCardData = {
  id: string;
  kind: "CAR" | "BUS";
  originLabel: string;
  destinationLabel: string;
  departureAt: Date;
  availableSeats: number;
  price: number | null;
  ticketPrice: number | null;
  operator: string | null;
  lineNumber: string | null;
  driver: {
    name: string | null;
    image?: string | null;
    verified?: boolean;
    rating?: number | null;
  } | null;
};

export function RideCard({
  ride,
  reasons,
  href,
}: {
  ride: RideCardData;
  reasons?: string[];
  href?: string;
}) {
  const target = href ?? `/przejazd/${ride.id}`;
  const cost =
    ride.kind === "BUS" ? formatPrice(ride.ticketPrice) : formatPrice(ride.price);

  return (
    <div className="group flex flex-col gap-3 rounded-2xl bg-card p-4 ring-1 ring-border transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between gap-2">
        <div className="shrink-0">
          <RideTypeBadge kind={ride.kind} />
        </div>
        {reasons && reasons.length > 0 && (
          <div className="flex flex-wrap justify-end gap-1 min-w-0">
            {reasons.slice(0, 2).map((r) => (
              <Badge key={r} variant="outline" className="truncate max-w-full">
                {r}
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="text-[15px] font-semibold leading-tight break-words">
            <span>{ride.originLabel}</span>
            <ArrowRight className="inline-block mx-1.5 -mt-0.5 size-4 shrink-0 text-primary" />
            <span>{ride.destinationLabel}</span>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1 min-w-0 truncate">
              <Clock className="size-3.5 shrink-0" />
              <span className="truncate">{formatDateTime(ride.departureAt)}</span>
            </span>
            {ride.kind === "CAR" ? (
              <span className="inline-flex items-center gap-1 min-w-0 truncate">
                <Users className="size-3.5 shrink-0" />
                <span className="truncate">{ride.availableSeats} wolnych miejsc</span>
              </span>
            ) : (
              <span className="truncate min-w-0">
                {ride.operator}
                {ride.lineNumber ? ` · linia ${ride.lineNumber}` : ""}
              </span>
            )}
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="font-heading text-lg font-bold text-primary">{cost}</p>
          {ride.kind === "CAR" && ride.price ? (
            <p className="text-[11px] text-muted-foreground">za miejsce</p>
          ) : null}
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-border pt-3">
        {ride.kind === "CAR" && ride.driver ? (
          <DriverChip driver={ride.driver} className="min-w-0" />
        ) : (
          <span className="text-xs text-muted-foreground truncate min-w-0">Kurs publiczny MPK</span>
        )}
        <Link
          href={target}
          className={cn(buttonVariants({ size: "sm" }), "shrink-0")}
        >
          {ride.kind === "BUS" ? "Zobacz kurs" : "Zobacz"}
        </Link>
      </div>
    </div>
  );
}

export function DriverChip({
  driver,
  className,
}: {
  driver: {
    name: string | null;
    image?: string | null;
    verified?: boolean;
    rating?: number | null;
  };
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-2 min-w-0", className)}>
      {driver.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={driver.image}
          alt=""
          className="size-8 shrink-0 rounded-full object-cover"
        />
      ) : (
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-bold text-primary">
          {(driver.name ?? "?").charAt(0).toUpperCase()}
        </span>
      )}
      <div className="leading-tight min-w-0">
        <p className="flex items-center gap-1 text-sm font-medium">
          <span className="truncate">{driver.name ?? "Kierowca"}</span>
          {driver.verified && (
            <BadgeCheck className="size-3.5 shrink-0 text-primary" aria-label="zweryfikowany" />
          )}
        </p>
        {driver.rating != null && (
          <p className="flex items-center gap-0.5 text-[11px] text-muted-foreground">
            <Star className="size-3 shrink-0 fill-amber-400 text-amber-400" />
            <span className="truncate">{driver.rating.toFixed(1)}</span>
          </p>
        )}
      </div>
    </div>
  );
}
