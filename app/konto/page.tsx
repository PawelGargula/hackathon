import { redirect } from "next/navigation";
import Link from "next/link";
import {
  BadgeCheck,
  Bus,
  Car,
  Route,
  Star,
  UserCheck,
  Users,
} from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getLifetimeImpact, getUserStats, type StatsPeriod } from "@/lib/rides";
import { Co2Tree } from "@/components/co2-tree";
import { BadgeGrid } from "@/components/badge-grid";
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
    return { period: { from, to }, active: "month", label: "Ten miesiąc" };
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
  const from = new Date(now);
  from.setDate(from.getDate() - 30);
  return { period: { from, to }, active: "30d", label: "Ostatnie 30 dni" };
}

const presets = [
  { id: "30d", label: "Ostatnie 30 dni" },
  { id: "month", label: "Ten miesiąc" },
];

export default async function AccountPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/api/auth/signin");

  const sp = await searchParams;
  const { period, active, label } = resolvePeriod(sp);

  const [profile, stats, impact] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { verified: true, rating: true, ratingCount: true },
    }),
    getUserStats(session.user.id, period),
    getLifetimeImpact(session.user.id),
  ]);

  return (
    <div className="mx-auto max-w-4xl min-w-0">
      {/* Profile header */}
      <div className="flex min-w-0 flex-col gap-4 rounded-3xl bg-card p-5 ring-1 ring-border sm:flex-row sm:items-center">
        {session.user.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={session.user.image}
            alt=""
            className="size-16 shrink-0 rounded-2xl object-cover"
          />
        ) : (
          <span className="grid size-16 shrink-0 place-items-center rounded-2xl bg-primary/10 text-xl font-bold text-primary">
            {(session.user.name ?? "?").charAt(0).toUpperCase()}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <h1 className="flex min-w-0 items-center gap-2 font-heading text-2xl font-bold tracking-tight">
            <span className="min-w-0 truncate">{session.user.name ?? "Konto"}</span>
            {profile?.verified && (
              <BadgeCheck className="size-5 shrink-0 text-primary" aria-label="zweryfikowany" />
            )}
          </h1>
          <p className="break-all text-sm text-muted-foreground">{session.user.email}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
            <span className="inline-flex min-w-0 items-center gap-1 rounded-full bg-emerald-600/10 px-2.5 py-1 font-medium text-emerald-700 dark:text-emerald-400">
              {impact.tree.emoji} Poziom {impact.tree.level} · {impact.tree.name}
            </span>
            {profile?.rating != null && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-400/10 px-2.5 py-1 font-medium text-amber-700 dark:text-amber-400">
                <Star className="size-3.5 fill-amber-400 text-amber-400" />
                {profile.rating.toFixed(1)} ({profile.ratingCount})
              </span>
            )}
          </div>
        </div>
      </div>

      {/* CO2 tree */}
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Co2Tree tree={impact.tree} co2Kg={impact.totals.co2Kg} />
        <div className="grid grid-cols-2 gap-3">
          <StatTile icon={Route} value={String(impact.totals.rides)} label="Wspólne przejazdy (łącznie)" />
          <StatTile icon={Users} value={`${impact.totals.km} km`} label="Współdzielone km (łącznie)" />
          <StatTile icon={UserCheck} value={String(stats.ridesAsPassenger)} label="Jako pasażer (okres)" />
          <StatTile icon={Car} value={String(stats.ridesAsDriver)} label="Jako kierowca (okres)" />
        </div>
      </div>

      {/* Achievements */}
      <section className="mt-6">
        <h2 className="mb-3 font-heading text-lg font-bold">Odznaki</h2>
        <BadgeGrid achievements={impact.achievements} columns={4} />
      </section>

      {/* Period stats */}
      <section className="mt-8">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <h2 className="font-heading text-lg font-bold">Statystyki okresowe</h2>
          {presets.map((p) => (
            <Link
              key={p.id}
              href={`/konto?period=${p.id}`}
              className={`rounded-full px-3 py-1 text-sm ring-1 ring-border ${
                active === p.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-card hover:bg-accent"
              }`}
            >
              {p.label}
            </Link>
          ))}
          <span className="min-w-0 break-words text-sm text-muted-foreground">Okres: {label}</span>
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
              className="h-9 rounded-lg border border-input bg-background px-2"
            />
          </label>
          <label className="grid gap-1">
            <span className="text-xs text-muted-foreground">Do</span>
            <input
              type="date"
              name="to"
              className="h-9 rounded-lg border border-input bg-background px-2"
            />
          </label>
          <button
            type="submit"
            className="h-9 rounded-lg bg-secondary px-3 text-secondary-foreground hover:bg-secondary/80"
          >
            Własny zakres
          </button>
        </form>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-emerald-600/10 p-4">
            <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-400">
              {stats.co2SavedKg} kg
            </p>
            <p className="text-sm text-muted-foreground">
              zaoszczędzone CO2 w wybranym okresie
            </p>
          </div>
          <StatTile
            icon={Route}
            value={String(stats.totalRides)}
            label="Liczba przejazdów"
            extra={`${stats.ridesCar} auto / ${stats.ridesBus} autobus`}
          />
        </div>

        <div className="mt-6">
          <h3 className="mb-2 flex items-center gap-2 text-sm font-medium">
            <Bus className="size-4 text-primary" /> Najczęstsze relacje skąd-dokąd
          </h3>
          {stats.topZones.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Brak danych w wybranym okresie.
            </p>
          ) : (
            <ul className="flex flex-col gap-1.5">
              {stats.topZones.map((z) => (
                <li
                  key={z.pair}
                  className="flex min-w-0 items-center justify-between gap-3 rounded-lg bg-card px-3 py-2 text-sm ring-1 ring-border"
                >
                  <span className="min-w-0 truncate">{z.pair}</span>
                  <span className="shrink-0 text-muted-foreground">
                    {z.count} {z.count === 1 ? "przejazd" : "przejazdy"}
                  </span>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-3 text-xs text-muted-foreground">
            Wskaźniki emisji (auto solo ~0,12 kg CO2/km, autobus ~0,03 kg/pasażera)
            to oszacowanie demonstracyjne, a nie pomiar produkcyjny.
          </p>
        </div>
      </section>
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
    <div className="flex min-w-0 flex-col gap-1 rounded-2xl bg-card p-4 ring-1 ring-border">
      <Icon className="size-5 text-primary" />
      <p className="min-w-0 break-words font-heading text-2xl font-bold">{value}</p>
      <p className="min-w-0 break-words text-sm text-muted-foreground">{label}</p>
      {extra && <p className="min-w-0 break-words text-xs text-muted-foreground">{extra}</p>}
    </div>
  );
}
