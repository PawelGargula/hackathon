import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Clock, MapPin, Users, Wallet } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getRideById } from "@/lib/rides";
import { joinBus } from "@/app/actions";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RideTypeBadge } from "@/components/ride-type-badge";
import { RequestSeatForm } from "@/components/request-seat-form";
import { formatDateTime, formatPrice } from "@/lib/format";

const statusLabel: Record<string, string> = {
  PENDING: "oczekuje",
  ACCEPTED: "zaakceptowane",
  REJECTED: "odrzucone",
};

const statusVariant: Record<string, "warning" | "success" | "destructive"> = {
  PENDING: "warning",
  ACCEPTED: "success",
  REJECTED: "destructive",
};

export default async function RideDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/api/auth/signin");

  const { id } = await params;
  const ride = await getRideById(id);
  if (!ride) notFound();

  const userId = session.user.id;
  const isDriver = ride.driverId === userId;
  const existingRequest = await prisma.rideRequest.findFirst({
    where: { rideId: ride.id, passengerId: userId },
    orderBy: { createdAt: "desc" },
  });

  const route = [
    ride.originLabel,
    ...ride.waypoints.map((w) => w.locLabel),
    ride.destinationLabel,
  ];

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <Link
        href="/szukaj"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        &larr; Wroc do wyszukiwania
      </Link>

      <div className="mt-4 flex items-center justify-between gap-2">
        <RideTypeBadge kind={ride.kind} />
        {ride.kind === "CAR" && (
          <Badge variant="outline">
            <Users /> {ride.availableSeats} wolnych miejsc
          </Badge>
        )}
      </div>

      <h1 className="mt-3 flex flex-wrap items-center gap-2 text-2xl font-bold tracking-tight">
        <span>{ride.originLabel}</span>
        <ArrowRight className="size-5 text-muted-foreground" />
        <span>{ride.destinationLabel}</span>
      </h1>

      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <Clock className="size-4" />
          {formatDateTime(ride.departureAt)}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Wallet className="size-4" />
          {ride.kind === "BUS"
            ? formatPrice(ride.ticketPrice)
            : formatPrice(ride.price)}
        </span>
        {ride.kind === "CAR" && ride.driver?.name && (
          <span>Kierowca: {ride.driver.name}</span>
        )}
        {ride.kind === "BUS" && (
          <span>
            {ride.operator}
            {ride.lineNumber ? ` - linia ${ride.lineNumber}` : ""}
          </span>
        )}
      </div>

      {ride.description && (
        <p className="mt-4 rounded-lg bg-muted/50 p-3 text-sm">
          {ride.description}
        </p>
      )}

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Trasa</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="flex flex-col gap-3">
            {route.map((stop, i) => (
              <li key={`${stop}-${i}`} className="flex items-start gap-2 text-sm">
                <MapPin className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                <span>{stop}</span>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      <div className="mt-6">
        {isDriver ? (
          <p className="rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">
            To Twoj przejazd. Prosby pasazerow obslugujesz w{" "}
            <Link href="/panel-kierowcy" className="underline">
              panelu kierowcy
            </Link>
            .
          </p>
        ) : existingRequest ? (
          <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-3 text-sm">
            <span>Status Twojej prosby:</span>
            <Badge variant={statusVariant[existingRequest.status]}>
              {statusLabel[existingRequest.status]}
            </Badge>
            <Link
              href="/moje-przejazdy"
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              Moje przejazdy
            </Link>
          </div>
        ) : ride.kind === "BUS" ? (
          <form action={joinBus}>
            <input type="hidden" name="rideId" value={ride.id} />
            <Button size="lg" type="submit">
              Dołącz do kursu
            </Button>
            <p className="mt-2 text-xs text-muted-foreground">
              Dolaczenie jest od razu potwierdzone i liczy sie do Twoich statystyk.
            </p>
          </form>
        ) : (
          <RequestSeatForm
            rideId={ride.id}
            maxSeats={ride.availableSeats}
            defaultPickup={{
              label: ride.originLabel,
              locality: ride.originLocality,
              lat: ride.originLat,
              lng: ride.originLng,
              placeId: ride.originPlaceId,
            }}
            defaultDropoff={{
              label: ride.destinationLabel,
              locality: ride.destinationLocality,
              lat: ride.destinationLat,
              lng: ride.destinationLng,
              placeId: ride.destinationPlaceId,
            }}
          />
        )}
      </div>
    </div>
  );
}
