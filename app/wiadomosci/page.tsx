import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, MessageSquare } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { buttonVariants } from "@/components/ui/button";
import { RideTypeBadge } from "@/components/ride-type-badge";
import { RequestStatusBadge } from "@/components/request-status-badge";
import { RequestThread } from "@/components/request-thread";

export default async function MessagesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/api/auth/signin");
  const userId = session.user.id;

  const threads = await prisma.rideRequest.findMany({
    where: {
      messages: { some: {} },
      OR: [{ passengerId: userId }, { ride: { driverId: userId } }],
    },
    orderBy: { updatedAt: "desc" },
    include: {
      ride: {
        select: {
          id: true,
          kind: true,
          originLabel: true,
          destinationLabel: true,
          driverId: true,
          driver: { select: { name: true, image: true } },
        },
      },
      passenger: { select: { name: true, image: true } },
      messages: { orderBy: { createdAt: "asc" } },
    },
  });

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-heading text-2xl font-bold tracking-tight">
        Wiadomości
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Rozmowy z kierowcami i pasażerami dotyczące wspólnych przejazdów.
      </p>

      {threads.length === 0 ? (
        <div className="mt-8 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border p-10 text-center">
          <MessageSquare className="size-7 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Nie masz jeszcze żadnych rozmów. Napisz do kierowcy przy rezerwacji
            miejsca.
          </p>
          <Link href="/szukaj" className={buttonVariants({ size: "sm" })}>
            Znajdź przejazd
          </Link>
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-4">
          {threads.map((t) => {
            const isDriver = t.ride.driverId === userId;
            const counterpart = isDriver ? t.passenger : t.ride.driver;
            return (
              <div
                key={t.id}
                className="rounded-2xl bg-card p-4 ring-1 ring-border"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {counterpart?.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={counterpart.image}
                        alt=""
                        className="size-9 rounded-full object-cover"
                      />
                    ) : (
                      <span className="grid size-9 place-items-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                        {(counterpart?.name ?? "?").charAt(0).toUpperCase()}
                      </span>
                    )}
                    <div className="leading-tight">
                      <p className="text-sm font-semibold">
                        {counterpart?.name ?? "Użytkownik"}
                        <span className="ml-1 text-xs font-normal text-muted-foreground">
                          {isDriver ? "(pasażer)" : "(kierowca)"}
                        </span>
                      </p>
                      <Link
                        href={`/przejazd/${t.ride.id}`}
                        className="flex items-center gap-1 text-xs text-muted-foreground hover:underline"
                      >
                        {t.ride.originLabel}
                        <ArrowRight className="size-3 text-primary" />
                        {t.ride.destinationLabel}
                      </Link>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <RideTypeBadge kind={t.ride.kind} />
                    <RequestStatusBadge status={t.status} />
                  </div>
                </div>

                <div className="mt-3 rounded-xl bg-muted/40 p-3">
                  <RequestThread
                    requestId={t.id}
                    currentUserId={userId}
                    messages={t.messages}
                    disabled={t.status === "REJECTED"}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
