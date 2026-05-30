import { redirect } from "next/navigation";
import Link from "next/link";
import { Car, Bus, Leaf, Route, UserCheck, Users } from "lucide-react";
import { auth } from "@/lib/auth";
import { getUserStats, type StatsPeriod } from "@/lib/rides";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/format";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function one(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function resolvePeriod(sp: Record<string, string | string[] | undefined>): {
  period: StatsPeriod;
  active: string;
  label: string;
} {
  const preset = one(sp.period) ?? "30d";
  const now = new Date();
  const to = new Date(now);
  to.setHours(23, 59, 59, 999);

  if (preset === "month") {
    const from = new Date(now.getFullYear(), now.getMonth(), 1);
    return { period: { from, to }, active: "month", label: "Ten miesiac" };
  }
  if (preset === "custom") {
    const fromRaw = one(sp.from);
    const toRaw = one(sp.to);
    const from = fromRaw ? new Date(fromRaw) : new Date(now.getFullYear(), 0, 1);
    const customTo = toRaw ? new Date(`${toRaw}T23:59:59`) : to;
    return {
      period: { from, to: customTo },
      active: "custom",
      label: `${formatDate(from)} - ${formatDate(customTo)}`,
    };
  }
  // default: last 30 days
  const from = new Date(now);
  from.setDate(from.getDate() - 30);
  return { period: { from, to }, active: "30d", label: "Ostatnie 30 dni" };
}

const presets = [
  { id: "30d", label: "Ostatnie 30 dni" },
  { id: "month", label: "Ten miesiac" },
];

export default async function AccountPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const session = await auth();
  if (!session?.user) redirect("/api/auth/signin");

  const sp = await searchParams;
  const { period, active, label } = resolvePeriod(sp);
  const stats = await getUserStats(session.user.id, period);

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="flex items-center gap-3">
        {session.user.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={session.user.image}
            alt=""
            className="size-10 rounded-full"
          />
        )}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {session.user.name ?? "Konto"}
          </h1>
          <p className="text-sm text-muted-foreground">{session.user.email}</p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        {presets.map((p) => (
          <Link
            key={p.id}
            href={`/konto?period=${p.id}`}
            className={`rounded-full px-3 py-1 text-sm ring-1 ring-foreground/10 ${
              active === p.id
                ? "bg-primary text-primary-foreground"
                : "bg-card hover:bg-muted"
            }`}
          >
            {p.label}
          </Link>
        ))}
        <span className="text-sm text-muted-foreground">Okres: {label}</span>
      </div>

      <form
        method="get"
        action="/konto"
        className="mt-3 flex flex-wrap items-end gap-2 text-sm"
      >
        <input type="hidden" name="period" value="custom" />
        <label className="grid gap-1">
          <span className="text-xs text-muted-foreground">Od</span>
          <input
            type="date"
            name="from"
            className="h-8 rounded-lg border border-input bg-background px-2"
          />
        </label>
        <label className="grid gap-1">
          <span className="text-xs text-muted-foreground">Do</span>
          <input
            type="date"
            name="to"
            className="h-8 rounded-lg border border-input bg-background px-2"
          />
        </label>
        <button
          type="submit"
          className="h-8 rounded-lg bg-secondary px-3 text-secondary-foreground hover:bg-secondary/80"
        >
          Wlasny zakres
        </button>
      </form>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Card className="sm:col-span-2 bg-emerald-600/10">
          <CardContent className="flex items-center gap-4">
            <div className="rounded-full bg-emerald-600/20 p-3">
              <Leaf className="size-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-400">
                {stats.co2SavedKg} kg
              </p>
              <p className="text-sm text-muted-foreground">
                zaoszczedzone CO2 w wybranym okresie (szacunek demonstracyjny)
              </p>
            </div>
          </CardContent>
        </Card>

        <StatTile
          icon={Route}
          value={String(stats.totalRides)}
          label="Liczba przejazdow"
          extra={`${stats.ridesCar} auto / ${stats.ridesBus} autobus`}
        />
        <StatTile
          icon={Users}
          value={`${stats.sharedKm} km`}
          label="Wspoldzielone kilometry"
        />
        <StatTile
          icon={UserCheck}
          value={String(stats.ridesAsPassenger)}
          label="Przejazdy jako pasazer"
        />
        <StatTile
          icon={Car}
          value={String(stats.ridesAsDriver)}
          label="Przejazdy jako kierowca"
        />
      </div>

      <div className="mt-6">
        <h2 className="mb-2 flex items-center gap-2 text-sm font-medium">
          <Bus className="size-4 text-emerald-600" /> Najczestsze relacje skad-dokad
        </h2>
        {stats.topZones.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Brak danych w wybranym okresie.
          </p>
        ) : (
          <ul className="flex flex-col gap-1.5">
            {stats.topZones.map((z) => (
              <li
                key={z.pair}
                className="flex items-center justify-between rounded-lg bg-card px-3 py-2 text-sm ring-1 ring-foreground/10"
              >
                <span>{z.pair}</span>
                <span className="text-muted-foreground">
                  {z.count} {z.count === 1 ? "przejazd" : "przejazdy"}
                </span>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-3 text-xs text-muted-foreground">
          Wskazniki emisji (auto solo ~0,12 kg CO2/km, autobus ~0,03 kg/pasazera)
          to oszacowanie demonstracyjne, a nie pomiar produkcyjny.
        </p>
      </div>
    </div>
  );
}

function StatTile({
  icon: Icon,
  value,
  label,
  extra,
}: {
  icon: typeof Route;
  value: string;
  label: string;
  extra?: string;
}) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-1">
        <Icon className="size-5 text-muted-foreground" />
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
        {extra && <p className="text-xs text-muted-foreground">{extra}</p>}
      </CardContent>
    </Card>
  );
}
