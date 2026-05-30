import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, Leaf } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RideTypeBadge } from "@/components/ride-type-badge";
import { RequestStatusBadge } from "@/components/request-status-badge";
import { RequestThread } from "@/components/request-thread";
import { formatDateTime, formatPrice } from "@/lib/format";

export default async function MyRidesPage() {
  const session = await auth();
  if (!session?.user) redirect("/api/auth/signin");
  const userId = session.user.id;

  const requests = await prisma.rideRequest.findMany({
    where: { passengerId: userId },
    orderBy: { createdAt: "desc" },
    include: {
      ride: { include: { driver: { select: { name: true } } } },
      messages: { orderBy: { createdAt: "asc" } },
    },
  });

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="text-2xl font-bold tracking-tight">Moje przejazdy</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Twoje prosby o miejsce w autach oraz dolaczenia do kursow MPK.
      </p>

      {requests.length === 0 ? (
        <div className="mt-8 flex flex-col items-center gap-3 rounded-xl border border-dashed p-10 text-center">
          <p className="text-sm text-muted-foreground">
            Nie masz jeszcze zadnych przejazdow.
          </p>
          <Link href="/szukaj" className={buttonVariants()}>
            Znajdz przejazd
          </Link>
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-4">
          {requests.map((req) => (
            <Card key={req.id}>
              <CardContent className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-2">
                  <RideTypeBadge kind={req.ride.kind} />
                  <RequestStatusBadge status={req.status} />
                </div>

                <Link
                  href={`/przejazd/${req.ride.id}`}
                  className="flex items-center gap-2 text-sm font-medium hover:underline"
                >
                  <span className="truncate">{req.ride.originLabel}</span>
                  <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
                  <span className="truncate">{req.ride.destinationLabel}</span>
                </Link>

                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span>{formatDateTime(req.ride.departureAt)}</span>
                  {req.ride.kind === "CAR" && req.ride.driver?.name && (
                    <span>Kierowca: {req.ride.driver.name}</span>
                  )}
                  {req.ride.kind === "BUS" && (
                    <span>
                      {req.ride.operator}
                      {req.ride.lineNumber
                        ? ` - linia ${req.ride.lineNumber}`
                        : ""}
                    </span>
                  )}
                  <span>
                    {req.ride.kind === "BUS"
                      ? formatPrice(req.ride.ticketPrice)
                      : formatPrice(req.ride.price)}
                  </span>
                  {req.status === "ACCEPTED" && req.co2SavedKg != null && (
                    <span className="inline-flex items-center gap-1 text-emerald-600">
                      <Leaf className="size-3.5" />
                      -{req.co2SavedKg} kg CO2
                    </span>
                  )}
                </div>

                {req.ride.kind === "CAR" && (
                  <div className="rounded-lg bg-muted/40 p-3">
                    <RequestThread
                      requestId={req.id}
                      currentUserId={userId}
                      messages={req.messages}
                      disabled={req.status === "REJECTED"}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
