import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, Bus, Car, Leaf } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { buttonVariants } from "@/components/ui/button";
import { RideTypeBadge } from "@/components/ride-type-badge";
import { RequestStatusBadge } from "@/components/request-status-badge";
import { RequestThread } from "@/components/request-thread";
import { formatDateTime, formatPrice } from "@/lib/format";

type RequestWithRide = Awaited<ReturnType<typeof loadRequests>>[number];

async function loadRequests(userId: string) {
  return prisma.rideRequest.findMany({
    where: { passengerId: userId },
    orderBy: { createdAt: "desc" },
    include: {
      ride: { include: { driver: { select: { name: true } } } },
      messages: { orderBy: { createdAt: "asc" } },
    },
  });
}

export default async function MyRidesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/api/auth/signin");
  const userId = session.user.id;

  const requests = await loadRequests(userId);
  const now = Date.now();
  const upcoming = requests.filter((r) => r.ride.departureAt.getTime() >= now);
  const past = requests.filter((r) => r.ride.departureAt.getTime() < now);

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-heading text-2xl font-bold tracking-tight">
        Moje przejazdy
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Twoje prośby o miejsce w autach oraz dołączenia do kursów MPK.
      </p>

      {requests.length === 0 ? (
        <div className="mt-8 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border p-10 text-center">
          <p className="text-sm text-muted-foreground">
            Nie masz jeszcze żadnych przejazdów.
          </p>
          <Link href="/szukaj" className={buttonVariants()}>
            Znajdź przejazd
          </Link>
        </div>
      ) : (
        <div className="mt-6 space-y-8">
          <Section title="Nadchodzące" count={upcoming.length}>
            {upcoming.map((req) => (
              <RequestCard key={req.id} req={req} userId={userId} />
            ))}
          </Section>
          {past.length > 0 && (
            <Section title="Zakończone" count={past.length}>
              {past.map((req) => (
                <RequestCard key={req.id} req={req} userId={userId} muted />
              ))}
            </Section>
          )}
        </div>
      )}
    </div>
  );
}

function Section({
  title,
  count,
  children,
}: {
  title: string;
  count: number;
  children: React.ReactNode;
}) {
  if (count === 0) {
    return (
      <section>
        <h2 className="mb-3 font-heading text-lg font-bold">{title}</h2>
        <p className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          Brak przejazdów w tej sekcji.
        </p>
      </section>
    );
  }
  return (
    <section>
      <h2 className="mb-3 font-heading text-lg font-bold">
        {title}{" "}
        <span className="text-sm font-normal text-muted-foreground">
          ({count})
        </span>
      </h2>
      <div className="flex flex-col gap-4">{children}</div>
    </section>
  );
}

function RequestCard({
  req,
  userId,
  muted,
}: {
  req: RequestWithRide;
  userId: string;
  muted?: boolean;
}) {
  return (
    <div
      className={`flex flex-col gap-3 rounded-2xl bg-card p-4 ring-1 ring-border ${
        muted ? "opacity-90" : ""
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <RideTypeBadge kind={req.ride.kind} />
        <RequestStatusBadge status={req.status} />
      </div>

      <Link
        href={`/przejazd/${req.ride.id}`}
        className="flex items-center gap-2 text-[15px] font-semibold hover:underline"
      >
        <span className="grid size-8 place-items-center rounded-full bg-primary/10 text-primary">
          {req.ride.kind === "BUS" ? (
            <Bus className="size-4" />
          ) : (
            <Car className="size-4" />
          )}
        </span>
        <span className="truncate">{req.ride.originLabel}</span>
        <ArrowRight className="size-4 shrink-0 text-primary" />
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
            {req.ride.lineNumber ? ` · linia ${req.ride.lineNumber}` : ""}
          </span>
        )}
        <span className="font-semibold text-primary">
          {req.ride.kind === "BUS"
            ? formatPrice(req.ride.ticketPrice)
            : formatPrice(req.ride.price)}
        </span>
        {req.status === "ACCEPTED" && req.co2SavedKg != null && (
          <span className="inline-flex items-center gap-1 text-emerald-600">
            <Leaf className="size-3.5" />-{req.co2SavedKg} kg CO2
          </span>
        )}
      </div>

      {req.ride.kind === "CAR" && (
        <div className="rounded-xl bg-muted/40 p-3">
          <RequestThread
            requestId={req.id}
            currentUserId={userId}
            messages={req.messages}
            disabled={req.status === "REJECTED"}
          />
        </div>
      )}
    </div>
  );
}
