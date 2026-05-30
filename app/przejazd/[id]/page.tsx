import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Clock,
  MapPin,
  Star,
  Users,
  Wallet,
} from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getRideById } from "@/lib/rides";
import { joinBus } from "@/app/actions";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { RideTypeBadge } from "@/components/ride-type-badge";
import { RequestSeatForm } from "@/components/request-seat-form";
import { RouteMap, type MapPoint } from "@/components/route-map";
import { formatDateTime, formatPrice, formatTime } from "@/lib/format";

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
  if (!session?.user?.id) redirect("/api/auth/signin");

  const { id } = await params;
  const ride = await getRideById(id);
  if (!ride) notFound();

  const userId = session.user.id;
  const isDriver = ride.driverId === userId;
  const existingRequest = await prisma.rideRequest.findFirst({
    where: { rideId: ride.id, passengerId: userId },
    orderBy: { createdAt: "desc" },
  });

  const stops = [
    { label: ride.originLabel, lat: ride.originLat, lng: ride.originLng },
    ...ride.waypoints.map((w) => ({
      label: w.locLabel,
      lat: w.locLat,
      lng: w.locLng,
    })),
    {
      label: ride.destinationLabel,
      lat: ride.destinationLat,
      lng: ride.destinationLng,
    },
  ];

  const mapPoints: MapPoint[] = stops.map((s, i) => ({
    lat: s.lat,
    lng: s.lng,
    label: s.label,
    role: i === 0 ? "start" : i === stops.length - 1 ? "end" : "stop",
  }));

  return (
    <div className="mx-auto max-w-5xl min-w-0">
      <Link
        href="/szukaj"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Wróć do wyszukiwania
      </Link>

      <div className="mt-4 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-5">
          <RouteMap points={mapPoints} className="h-64 sm:h-80" />

          <div className="min-w-0 rounded-2xl bg-card p-5 ring-1 ring-border">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <RideTypeBadge kind={ride.kind} />
              {ride.kind === "CAR" && (
                <Badge variant="outline">
                  <Users /> {ride.availableSeats} wolnych miejsc
                </Badge>
              )}
            </div>

            <h1 className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 font-heading text-2xl font-bold tracking-tight">
              <span className="min-w-0 break-words">{ride.originLabel}</span>
              <ArrowRight className="size-5 shrink-0 text-primary" />
              <span className="min-w-0 break-words">{ride.destinationLabel}</span>
            </h1>

            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <span className="inline-flex min-w-0 items-center gap-1.5">
                <Clock className="size-4 shrink-0" />
                {formatDateTime(ride.departureAt)}
              </span>
              <span className="inline-flex min-w-0 items-center gap-1.5 font-semibold text-primary">
                <Wallet className="size-4 shrink-0" />
                {ride.kind === "BUS"
                  ? formatPrice(ride.ticketPrice)
                  : formatPrice(ride.price)}
              </span>
              {ride.kind === "BUS" && (
                <span className="min-w-0 break-words">
                  {ride.operator}
                  {ride.lineNumber ? ` · linia ${ride.lineNumber}` : ""}
                </span>
              )}
            </div>

            {ride.description && (
              <p className="mt-4 rounded-lg bg-muted/50 p-3 text-sm break-words">
                {ride.description}
              </p>
            )}
          </div>

          {/* Stops timeline */}
          <div className="min-w-0 rounded-2xl bg-card p-5 ring-1 ring-border">
            <h2 className="font-heading text-base font-bold">Przystanki</h2>
            <ol className="mt-3 flex flex-col">
              {stops.map((stop, i) => (
                <li key={`${stop.label}-${i}`} className="flex min-w-0 gap-3">
                  <div className="flex flex-col items-center">
                    <MapPin
                      className={`size-4 ${
                        i === 0 || i === stops.length - 1
                          ? "text-primary"
                          : "text-emerald-400"
                      }`}
                    />
                    {i < stops.length - 1 && (
                      <span className="my-0.5 w-px flex-1 bg-border" />
                    )}
                  </div>
                  <span className="min-w-0 break-words pb-4 text-sm">{stop.label}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Sidebar: driver + booking */}
        <div className="space-y-5">
          {ride.kind === "CAR" && ride.driver && (
            <div className="min-w-0 rounded-2xl bg-card p-5 ring-1 ring-border">
              <h2 className="mb-3 font-heading text-base font-bold">Kierowca</h2>
              <div className="flex min-w-0 items-center gap-3">
                {ride.driver.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={ride.driver.image}
                    alt=""
                    className="size-12 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <span className="grid size-12 shrink-0 place-items-center rounded-full bg-primary/10 text-base font-bold text-primary">
                    {(ride.driver.name ?? "?").charAt(0).toUpperCase()}
                  </span>
                )}
                <div className="min-w-0">
                  <p className="flex min-w-0 items-center gap-1 font-medium">
                    <span className="min-w-0 truncate">{ride.driver.name ?? "Kierowca"}</span>
                    {ride.driver.verified && (
                      <BadgeCheck className="size-4 shrink-0 text-primary" />
                    )}
                  </p>
                  {ride.driver.rating != null && (
                    <p className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Star className="size-3.5 fill-amber-400 text-amber-400" />
                      {ride.driver.rating.toFixed(1)} · {ride.driver.ratingCount}{" "}
                      ocen
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="min-w-0 rounded-2xl bg-card p-5 ring-1 ring-border">
            {isDriver ? (
              <p className="text-sm text-muted-foreground">
                To Twój przejazd. Prośby pasażerów obsługujesz w{" "}
                <Link href="/moje-przejazdy?tab=kierowca" className="text-primary underline">
                  zakładce &quot;Jako kierowca&quot;
                </Link>
                .
              </p>
            ) : existingRequest ? (
              <div className="flex min-w-0 flex-col gap-3 text-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <span>Status Twojej prośby:</span>
                  <Badge variant={statusVariant[existingRequest.status]}>
                    {statusLabel[existingRequest.status]}
                  </Badge>
                </div>
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
                <Button size="lg" type="submit" className="w-full">
                  Dołącz do kursu
                </Button>
                <p className="mt-2 text-xs text-muted-foreground">
                  Dołączenie jest od razu potwierdzone i liczy się do Twoich
                  statystyk{ride.departureAt ? ` (odjazd ${formatTime(ride.departureAt)})` : ""}.
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
      </div>
    </div>
  );
}
