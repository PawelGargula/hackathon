import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, Check, MapPin, X } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { decideRequest } from "@/app/actions";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RequestStatusBadge } from "@/components/request-status-badge";
import { RequestThread } from "@/components/request-thread";
import { formatDateTime } from "@/lib/format";

export default async function DriverPanelPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/api/auth/signin");
  const userId = session.user.id;

  const rides = await prisma.ride.findMany({
    where: { driverId: userId, kind: "CAR" },
    orderBy: { departureAt: "asc" },
    include: {
      requests: {
        orderBy: { createdAt: "desc" },
        include: {
          passenger: { select: { name: true, image: true } },
          messages: { orderBy: { createdAt: "asc" } },
        },
      },
    },
  });

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-heading text-2xl font-bold tracking-tight">
        Panel kierowcy
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Twoje przejazdy autem i prośby pasażerów o miejsce.
      </p>

      {rides.length === 0 ? (
        <div className="mt-8 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border p-10 text-center">
          <p className="text-sm text-muted-foreground">
            Nie masz jeszcze ogłoszonych przejazdów.
          </p>
          <Link href="/dodaj" className={buttonVariants()}>
            Dodaj przejazd
          </Link>
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-5">
          {rides.map((ride) => {
            const taken = ride.requests
              .filter((r) => r.status === "ACCEPTED")
              .reduce((s, r) => s + r.seatsRequested, 0);
            const free = Math.max(0, ride.seats - taken);
            const pending = ride.requests.filter(
              (r) => r.status === "PENDING",
            ).length;
            return (
              <div
                key={ride.id}
                className="rounded-2xl bg-card ring-1 ring-border"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border p-4">
                  <div>
                    <p className="flex flex-wrap items-center gap-2 font-heading text-base font-bold">
                      <span>{ride.originLabel}</span>
                      <ArrowRight className="size-4 text-primary" />
                      <span>{ride.destinationLabel}</span>
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {formatDateTime(ride.departureAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {pending > 0 && (
                      <Badge variant="warning">{pending} nowe prośby</Badge>
                    )}
                    <Badge variant="outline">{free} wolnych miejsc</Badge>
                  </div>
                </div>

                <div className="flex flex-col gap-3 p-4">
                  {ride.requests.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      Brak próśb o miejsce.
                    </p>
                  )}
                  {ride.requests.map((req) => (
                    <div
                      key={req.id}
                      className="flex flex-col gap-2 rounded-xl border border-border p-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="flex items-center gap-2 text-sm font-medium">
                          {req.passenger.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={req.passenger.image}
                              alt=""
                              className="size-7 rounded-full object-cover"
                            />
                          ) : (
                            <span className="grid size-7 place-items-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                              {(req.passenger.name ?? "?")
                                .charAt(0)
                                .toUpperCase()}
                            </span>
                          )}
                          {req.passenger.name ?? "Pasażer"}
                          <span className="text-muted-foreground">
                            · {req.seatsRequested} miejsc
                          </span>
                        </span>
                        <RequestStatusBadge status={req.status} />
                      </div>
                      <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="size-3.5 text-primary" />
                          Odbiór: {req.pickupLabel}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="size-3.5 text-primary" />
                          Cel: {req.dropoffLabel}
                        </span>
                      </div>

                      <div className="rounded-xl bg-muted/40 p-2.5">
                        <RequestThread
                          requestId={req.id}
                          currentUserId={userId}
                          messages={req.messages}
                          disabled={req.status === "REJECTED"}
                        />
                      </div>

                      {req.status === "PENDING" && (
                        <div className="flex gap-2">
                          <form action={decideRequest}>
                            <input type="hidden" name="requestId" value={req.id} />
                            <input type="hidden" name="decision" value="accept" />
                            <Button
                              type="submit"
                              size="sm"
                              disabled={free < req.seatsRequested}
                            >
                              <Check /> Zaakceptuj
                            </Button>
                          </form>
                          <form action={decideRequest}>
                            <input type="hidden" name="requestId" value={req.id} />
                            <input type="hidden" name="decision" value="reject" />
                            <Button type="submit" size="sm" variant="destructive">
                              <X /> Odrzuć
                            </Button>
                          </form>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
