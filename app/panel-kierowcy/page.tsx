import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, Check, MapPin, X } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { decideRequest } from "@/app/actions";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RequestStatusBadge } from "@/components/request-status-badge";
import { RequestThread } from "@/components/request-thread";
import { formatDateTime } from "@/lib/format";

export default async function DriverPanelPage() {
  const session = await auth();
  if (!session?.user) redirect("/api/auth/signin");
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
    <div className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="text-2xl font-bold tracking-tight">Panel kierowcy</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Twoje przejazdy autem i prosby pasazerow o miejsce.
      </p>

      {rides.length === 0 ? (
        <div className="mt-8 flex flex-col items-center gap-3 rounded-xl border border-dashed p-10 text-center">
          <p className="text-sm text-muted-foreground">
            Nie masz jeszcze ogloszonych przejazdow.
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
            return (
              <Card key={ride.id}>
                <CardHeader>
                  <CardTitle className="flex flex-wrap items-center gap-2 text-base">
                    <span>{ride.originLabel}</span>
                    <ArrowRight className="size-4 text-muted-foreground" />
                    <span>{ride.destinationLabel}</span>
                  </CardTitle>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    <span>{formatDateTime(ride.departureAt)}</span>
                    <Badge variant="outline">{free} wolnych miejsc</Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  {ride.requests.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      Brak prosb o miejsce.
                    </p>
                  )}
                  {ride.requests.map((req) => (
                    <div
                      key={req.id}
                      className="flex flex-col gap-2 rounded-lg border p-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium">
                          {req.passenger.name ?? "Pasazer"}
                          <span className="text-muted-foreground">
                            {" "}
                            &middot; {req.seatsRequested} miejsc
                          </span>
                        </span>
                        <RequestStatusBadge status={req.status} />
                      </div>
                      <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="size-3.5 text-emerald-600" />
                          Odbior: {req.pickupLabel}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="size-3.5 text-emerald-600" />
                          Cel: {req.dropoffLabel}
                        </span>
                      </div>

                      <div className="rounded-lg bg-muted/40 p-2.5">
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
                            <input
                              type="hidden"
                              name="requestId"
                              value={req.id}
                            />
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
                            <input
                              type="hidden"
                              name="requestId"
                              value={req.id}
                            />
                            <input type="hidden" name="decision" value="reject" />
                            <Button type="submit" size="sm" variant="destructive">
                              <X /> Odrzuc
                            </Button>
                          </form>
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
