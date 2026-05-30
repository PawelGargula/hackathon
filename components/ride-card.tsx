import Link from "next/link";
import { ArrowRight, Clock, Users, Wallet } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RideTypeBadge } from "@/components/ride-type-badge";
import { formatDateTime, formatPrice } from "@/lib/format";

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
  driver: { name: string | null } | null;
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
    <Card>
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <RideTypeBadge kind={ride.kind} />
          {reasons && reasons.length > 0 && (
            <div className="flex flex-wrap justify-end gap-1">
              {reasons.slice(0, 3).map((r) => (
                <Badge key={r} variant="outline">
                  {r}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 text-sm font-medium">
          <span className="truncate">{ride.originLabel}</span>
          <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
          <span className="truncate">{ride.destinationLabel}</span>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3.5" />
            {formatDateTime(ride.departureAt)}
          </span>
          {ride.kind === "CAR" ? (
            <span className="inline-flex items-center gap-1">
              <Users className="size-3.5" />
              {ride.availableSeats} wolnych miejsc
            </span>
          ) : (
            <span>
              {ride.operator}
              {ride.lineNumber ? ` - linia ${ride.lineNumber}` : ""}
            </span>
          )}
          <span className="inline-flex items-center gap-1">
            <Wallet className="size-3.5" />
            {cost}
          </span>
          {ride.kind === "CAR" && ride.driver?.name && (
            <span>Kierowca: {ride.driver.name}</span>
          )}
        </div>

        <div className="flex justify-end">
          <Link href={target} className={buttonVariants({ size: "sm" })}>
            {ride.kind === "BUS" ? "Zobacz kurs" : "Szczegoly"}
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
