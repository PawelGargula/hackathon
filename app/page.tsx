import Link from "next/link";
import {
  ArrowRight,
  Bus,
  Car,
  CalendarCheck,
  Leaf,
  MapPin,
  Route,
  Search,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";
import { auth } from "@/lib/auth";
import { getDashboardData, type RecentRide } from "@/lib/rides";
import { SignInButton } from "@/components/sign-in-button";
import { SearchForm } from "@/components/search-form";
import { Co2Tree } from "@/components/co2-tree";
import { BadgeGrid } from "@/components/badge-grid";
import { RouteMap, type MapSegment } from "@/components/route-map";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDateTime, formatPrice } from "@/lib/format";
import { HeroIllustration } from "@/components/illustrations/hero-illustration";

export default async function HomePage() {
  const session = await auth();
  if (session?.user?.id) {
    return <Dashboard userId={session.user.id} userName={session.user.name} />;
  }
  return <Landing />;
}

async function Dashboard({
  userId,
  userName,
}: {
  userId: string;
  userName: string | null | undefined;
}) {
  const data = await getDashboardData(userId);
  const firstName = (userName ?? "").split(" ")[0] || "Podróżniku";

  const segments: MapSegment[] = data.popularRoutes.map((r) => ({
    points: [
      { lat: r.origin.lat, lng: r.origin.lng, label: r.from, role: "start" },
      { lat: r.destination.lat, lng: r.destination.lng, label: r.to, role: "end" },
    ],
  }));

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Hero + quick search */}
      <section className="relative overflow-hidden rounded-[2rem] bg-emerald-50 px-6 py-8 dark:bg-emerald-950/30 sm:px-10 sm:py-12">
        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <h1 className="font-heading text-3xl font-bold text-emerald-950 dark:text-emerald-50 sm:text-4xl">
              Cześć, {firstName}! 👋
              <span className="block mt-2 text-xl font-medium text-emerald-800 dark:text-emerald-200">
                Dokąd jedziemy dzisiaj?
              </span>
            </h1>
            <p className="mt-4 text-emerald-700 dark:text-emerald-300/80">
              Wybieraj wspólne przejazdy i oszczędzaj!
              <br />
              Taniej, wygodniej i ekologicznie 🌱
            </p>
          </div>
          <div className="hidden lg:block lg:w-1/2">
            <HeroIllustration className="h-48 w-full" />
          </div>
        </div>
        <div className="relative z-20 mt-8">
          <SearchForm />
        </div>
      </section>

      {/* Stats */}
      <section>
        <h2 className="mb-3 font-heading text-lg font-bold">Twoje statystyki</h2>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard
            icon={Leaf}
            value={`${data.stats.co2SavedKg} kg`}
            label="Zaoszczędzone CO2"
            accent
          />
          <StatCard
            icon={TrendingUp}
            value={`${data.stats.kmThisMonth} km`}
            label="W tym miesiącu"
          />
          <StatCard
            icon={Route}
            value={`${data.stats.kmThisYear} km`}
            label="W tym roku"
          />
          <StatCard
            icon={Users}
            value={String(data.stats.ridesAvoidedSolo)}
            label="Wspólne przejazdy"
          />
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        {/* Recent rides */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-heading text-lg font-bold">Ostatnie przejazdy</h2>
            <Link
              href="/moje-przejazdy"
              className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
            >
              Zobacz wszystkie <ArrowRight className="size-4" />
            </Link>
          </div>
          {data.recentRides.length === 0 ? (
            <EmptyState
              icon={CalendarCheck}
              title="Brak przejazdów"
              cta={{ href: "/szukaj", label: "Znajdź przejazd" }}
            >
              Nie masz jeszcze przejazdów. Zacznij od wyszukania trasy.
            </EmptyState>
          ) : (
            <div className="flex flex-col gap-3">
              {data.recentRides.map((r, i) => (
                <RecentRideRow key={`${r.rideId}-${i}`} ride={r} />
              ))}
            </div>
          )}
        </section>

        {/* Tree */}
        <section className="space-y-4">
          <h2 className="font-heading text-lg font-bold">Twoje drzewko CO2</h2>
          <Co2Tree tree={data.tree} co2Kg={data.stats.co2SavedKg} compact />
          <Link
            href="/konto"
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            Zobacz szczegóły profilu
          </Link>
        </section>
      </div>

      {/* Popular routes */}
      <section>
        <h2 className="mb-3 font-heading text-lg font-bold">
          Popularne trasy w Sądecczyźnie
        </h2>
        {data.popularRoutes.length === 0 ? (
          <EmptyState icon={MapPin} title="Brak danych o trasach">
            Gdy pojawi się więcej przejazdów, zobaczysz tu najczęstsze relacje.
          </EmptyState>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            <RouteMap segments={segments} className="h-72" />
            <ul className="flex flex-col gap-3">
              {data.popularRoutes.map((r) => (
                <li
                  key={`${r.from}-${r.to}`}
                  className="flex items-center justify-between gap-2 rounded-2xl bg-card px-5 py-4 text-sm shadow-sm ring-1 ring-border/50 transition-all hover:shadow-md"
                >
                  <span className="flex items-center gap-2 font-medium">
                    {r.from}
                    <ArrowRight className="size-3.5 text-primary" />
                    {r.to}
                  </span>
                  <span className="text-muted-foreground">{r.distanceKm} km</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* Achievements */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-heading text-lg font-bold">Odznaki</h2>
          <Link
            href="/konto"
            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
          >
            Zobacz wszystkie <ArrowRight className="size-4" />
          </Link>
        </div>
        <BadgeGrid achievements={data.achievements} columns={4} />
      </section>
    </div>
  );
}

function RecentRideRow({ ride }: { ride: RecentRide }) {
  return (
    <Link
      href={`/przejazd/${ride.rideId}`}
      className="flex items-center justify-between gap-3 rounded-2xl bg-card p-4 shadow-sm ring-1 ring-border/50 transition-all hover:shadow-md hover:ring-border"
    >
      <div className="flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-full bg-primary/10 text-primary">
          {ride.kind === "BUS" ? (
            <Bus className="size-5" />
          ) : (
            <Car className="size-5" />
          )}
        </span>
        <div>
          <p className="flex items-center gap-1.5 text-sm font-semibold">
            {ride.originLabel}
            <ArrowRight className="size-3.5 text-primary" />
            {ride.destinationLabel}
          </p>
          <p className="text-xs text-muted-foreground">
            {formatDateTime(ride.departureAt)}
            {ride.counterpart
              ? ` · ${ride.role === "driver" ? "pasażer" : "kierowca"}: ${ride.counterpart}`
              : ""}
          </p>
        </div>
      </div>
      <span className="font-heading text-sm font-bold text-primary">
        {formatPrice(ride.price)}
      </span>
    </Link>
  );
}

function StatCard({
  icon: Icon,
  value,
  label,
  accent,
}: {
  icon: LucideIcon;
  value: string;
  label: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`flex flex-col gap-2 rounded-2xl p-5 shadow-sm ring-1 transition-all hover:shadow-md ${
        accent
          ? "bg-emerald-50/50 ring-emerald-100 dark:bg-emerald-950/20 dark:ring-emerald-900/30"
          : "bg-card ring-border/50"
      }`}
    >
      <div className="flex items-center gap-2">
        <Icon
          className={`size-5 ${accent ? "text-emerald-600" : "text-emerald-600/70"}`}
        />
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
      </div>
      <p className="font-heading text-3xl font-bold">{value}</p>
    </div>
  );
}

function EmptyState({
  icon: Icon,
  title,
  children,
  cta,
}: {
  icon: LucideIcon;
  title: string;
  children: React.ReactNode;
  cta?: { href: string; label: string };
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border p-8 text-center">
      <Icon className="size-7 text-muted-foreground" />
      <div>
        <p className="font-medium">{title}</p>
        <p className="mt-1 text-sm text-muted-foreground">{children}</p>
      </div>
      {cta && (
        <Link href={cta.href} className={buttonVariants({ size: "sm" })}>
          {cta.label}
        </Link>
      )}
    </div>
  );
}

const features = [
  {
    icon: Search,
    title: "Wyszukiwanie po trasie",
    detail:
      "Wpisz skąd, dokąd i kiedy chcesz jechać. Pokazujemy najtrafniejsze opcje, a nie przypadkową tablicę ogłoszeń.",
  },
  {
    icon: Bus,
    title: "Auto i autobus razem",
    detail:
      "Wolne miejsca w autach sąsiadów oraz pasujące kursy MPK Nowy Sącz w jednej wspólnej liście.",
  },
  {
    icon: Leaf,
    title: "Realny efekt CO2",
    detail:
      "Każdy wspólny przejazd liczymy do statystyk zaoszczędzonego CO2 i analityki potrzeb przejazdowych.",
  },
];

function Landing() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <section className="space-y-5">
        <span className="inline-flex items-center gap-2 rounded-full bg-emerald-600/10 px-3 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">
          <MapPin className="size-3.5" /> Subregion nowosądecki - pilotaż z MPK
          Nowy Sącz
        </span>
        <h1 className="max-w-3xl font-heading text-4xl font-bold tracking-tight sm:text-5xl">
          Razem w Drogę
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          Lokalna aplikacja do codziennych dojazdów. Pokazujemy wolne miejsce w
          aucie sąsiada na trasie, którą ktoś i tak pokonuje, oraz pasujące kursy
          komunikacji miejskiej - w jednym miejscu. To nie kolejny BlaBlaCar:
          uzupełniamy transport publiczny i działamy przeciw wykluczeniu
          transportowemu.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <SignInButton redirectTo="/">
            Zaloguj się przez Google
          </SignInButton>
        </div>
      </section>

      <section className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((item) => (
          <Card key={item.title}>
            <CardHeader>
              <item.icon className="size-5 text-primary" />
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>{item.detail}</CardDescription>
            </CardHeader>
            <CardContent />
          </Card>
        ))}
      </section>

      <section className="mt-12 grid gap-4 sm:grid-cols-3">
        <LandingStat icon={Users} value="9 gmin" label="obszar działania MPK Nowy Sącz" />
        <LandingStat icon={Bus} value="auto + MPK" label="multimodalne wyniki wyszukiwania" />
        <LandingStat icon={Leaf} value="~0,12 kg/km" label="szacowana oszczędność CO2 auta solo" />
      </section>
    </div>
  );
}

function LandingStat({
  icon: Icon,
  value,
  label,
}: {
  icon: LucideIcon;
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-xl bg-card p-4 ring-1 ring-border">
      <Icon className="size-5 text-primary" />
      <p className="mt-2 text-xl font-semibold">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
