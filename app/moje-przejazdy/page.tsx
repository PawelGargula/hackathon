import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, Bus, Car, Leaf, Check, MapPin, X } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { decideRequest } from "@/app/actions";
import { buttonVariants } from "@/components/ui/button";
import { SubmitButton } from "@/components/submit-button";
import { Badge } from "@/components/ui/badge";
import { RideTypeBadge } from "@/components/ride-type-badge";
import { RequestStatusBadge } from "@/components/request-status-badge";
import { RequestThread } from "@/components/request-thread";
import { formatDateTime, formatPrice, formatAddress } from "@/lib/format";
import { cn } from "@/lib/utils";

type RequestWithRide = Awaited<ReturnType<typeof loadPassengerRequests>>[number];

async function loadPassengerRequests(userId: string) {
  return prisma.rideRequest.findMany({
    where: { passengerId: userId },
    orderBy: { createdAt: "desc" },
    include: {
      ride: { include: { driver: { select: { name: true } } } },
      messages: { orderBy: { createdAt: "asc" } },
    },
  });
}

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function MyRidesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/api/auth/signin");
  const userId = session.user.id;

  const sp = await searchParams;
  const rawTab = Array.isArray(sp.tab) ? sp.tab[0] : sp.tab;
  const tab = rawTab === "kierowca" ? "kierowca" : "pasazer";

  return (
    <div className="mx-auto max-w-3xl min-w-0">
      <h1 className="font-heading text-2xl font-bold tracking-tight">
        Moje przejazdy
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Zarządzaj swoimi podróżami jako pasażer i kierowca.
      </p>

      {/* Tabs */}
      <div className="mt-6 flex min-w-0 items-center gap-2 overflow-x-auto border-b border-border pb-px">
        <Link
          href="/moje-przejazdy?tab=pasazer"
          className={cn(
            "border-b-2 px-4 py-2 text-sm font-medium transition-colors",
            tab === "pasazer"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground",
          )}
        >
          Jako pasażer
        </Link>
        <Link
          href="/moje-przejazdy?tab=kierowca"
          className={cn(
            "border-b-2 px-4 py-2 text-sm font-medium transition-colors",
            tab === "kierowca"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground",
          )}
        >
          Jako kierowca
        </Link>
      </div>

      <div className="mt-6">
        {tab === "pasazer" ? (
          <PassengerView userId={userId} />
        ) : (
          <DriverView userId={userId} />
        )}
      </div>
    </div>
  );
}

async function PassengerView({ userId }: { userId: string }) {
  const requests = await loadPassengerRequests(userId);
  // Server render groups rides relative to the current request time.
  // eslint-disable-next-line react-hooks/purity
  const now = Date.now();
  const upcoming = requests.filter((r) => r.ride.departureAt.getTime() >= now);
  const past = requests.filter((r) => r.ride.departureAt.getTime() < now);

  if (requests.length === 0) {
    return (
      <div className="mt-8 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border p-10 text-center">
        <p className="text-sm text-muted-foreground">
          Nie masz jeszcze żadnych przejazdów jako pasażer.
        </p>
        <Link href="/szukaj" className={buttonVariants()}>
          Znajdź przejazd
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
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
  );
}

async function DriverView({ userId }: { userId: string }) {
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

  if (rides.length === 0) {
    return (
      <div className="mt-8 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border p-10 text-center">
        <p className="text-sm text-muted-foreground">
          Nie masz jeszcze ogłoszonych przejazdów.
        </p>
        <Link href="/dodaj" className={buttonVariants()}>
          Dodaj przejazd
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {rides.map((ride) => {
        const taken = ride.requests
          .filter((r) => r.status === "ACCEPTED")
          .reduce((s, r) => s + r.seatsRequested, 0);
        const free = Math.max(0, ride.seats - taken);
        const pending = ride.requests.filter((r) => r.status === "PENDING").length;

        return (
          <div key={ride.id} className="min-w-0 rounded-2xl bg-card ring-1 ring-border">
            <div className="flex flex-col items-start gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0 flex-1">
                <p className="flex flex-wrap items-center gap-x-2 gap-y-1 font-heading text-base font-bold">
                  <span className="break-words">{formatAddress(ride.originLabel)}</span>
                  <ArrowRight className="size-4 shrink-0 text-primary" />
                  <span className="break-words">{formatAddress(ride.destinationLabel)}</span>
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {formatDateTime(ride.departureAt)}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {pending > 0 && <Badge variant="warning">{pending} nowe prośby</Badge>}
                <Badge variant="outline">{free} wolnych miejsc</Badge>
              </div>
            </div>

            <div className="flex flex-col gap-3 p-4">
              {ride.requests.length === 0 && (
                <p className="text-sm text-muted-foreground">Brak próśb o miejsce.</p>
              )}
              {ride.requests.map((req) => (
                <div
                  key={req.id}
                  className="flex flex-col gap-2 rounded-xl border border-border p-3"
                >
                  <div className="flex min-w-0 flex-wrap items-center justify-between gap-2">
                    <span className="flex flex-wrap items-center gap-2 text-sm font-medium">
                      {req.passenger.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={req.passenger.image}
                          alt=""
                          className="size-7 rounded-full object-cover"
                        />
                      ) : (
                        <span className="grid size-7 place-items-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                          {(req.passenger.name ?? "?").charAt(0).toUpperCase()}
                        </span>
                      )}
                      <span className="min-w-0 break-words">
                        {req.passenger.name ?? "Pasażer"}
                      </span>
                      <span className="shrink-0 text-muted-foreground">
                        · {req.seatsRequested} miejsc
                      </span>
                    </span>
                    <RequestStatusBadge status={req.status} />
                  </div>
                  <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                    <span className="inline-flex min-w-0 items-start gap-1">
                      <MapPin className="mt-0.5 size-3.5 shrink-0 text-primary" />
                      <span className="min-w-0 break-words">Odbiór: {formatAddress(req.pickupLabel)}</span>
                    </span>
                    <span className="inline-flex min-w-0 items-start gap-1">
                      <MapPin className="mt-0.5 size-3.5 shrink-0 text-primary" />
                      <span className="min-w-0 break-words">Cel: {formatAddress(req.dropoffLabel)}</span>
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
                    <div className="flex flex-wrap gap-2">
                      <form action={decideRequest}>
                        <input type="hidden" name="requestId" value={req.id} />
                        <input type="hidden" name="decision" value="accept" />
                        <SubmitButton
                          size="sm"
                          disabled={free < req.seatsRequested}
                          icon={<Check className="size-4" />}
                          pendingText="Akceptuję…"
                        >
                          Zaakceptuj
                        </SubmitButton>
                      </form>
                      <form action={decideRequest}>
                        <input type="hidden" name="requestId" value={req.id} />
                        <input type="hidden" name="decision" value="reject" />
                        <SubmitButton
                          size="sm"
                          variant="destructive"
                          icon={<X className="size-4" />}
                          pendingText="Odrzucam…"
                        >
                          Odrzuć
                        </SubmitButton>
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
        {title} <span className="text-sm font-normal text-muted-foreground">({count})</span>
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
      className={cn(
        "flex min-w-0 flex-col gap-3 rounded-2xl bg-card p-4 ring-1 ring-border",
        muted && "opacity-90",
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <RideTypeBadge kind={req.ride.kind} />
        <RequestStatusBadge status={req.status} />
      </div>

      <Link
        href={`/przejazd/${req.ride.id}`}
        className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)_auto_minmax(0,1fr)] items-start gap-2 text-[15px] font-semibold hover:underline"
      >
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
          {req.ride.kind === "BUS" ? <Bus className="size-4" /> : <Car className="size-4" />}
        </span>
        <span className="min-w-0 break-words mt-1">{formatAddress(req.ride.originLabel)}</span>
        <ArrowRight className="size-4 shrink-0 text-primary mt-1.5" />
        <span className="min-w-0 break-words mt-1">{formatAddress(req.ride.destinationLabel)}</span>
      </Link>

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span>{formatDateTime(req.ride.departureAt)}</span>
        {req.ride.kind === "CAR" && req.ride.driver?.name && (
          <span className="min-w-0 break-words">Kierowca: {req.ride.driver.name}</span>
        )}
        {req.ride.kind === "BUS" && (
          <span className="min-w-0 break-words">
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
