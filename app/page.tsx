import Link from "next/link";
import { Bus, Car, Leaf, MapPin, Search, Users } from "lucide-react";
import { auth } from "@/lib/auth";
import { SignInButton } from "@/components/sign-in-button";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const features = [
  {
    icon: Search,
    title: "Wyszukiwanie po trasie",
    detail:
      "Wpisz skad, dokad i kiedy chcesz jechac. Pokazujemy najtrafniejsze opcje, a nie przypadkowa tablice ogloszen.",
  },
  {
    icon: Bus,
    title: "Auto i autobus razem",
    detail:
      "Wolne miejsca w autach sasiadow oraz pasujace kursy MPK Nowy Sacz w jednej wspolnej liscie.",
  },
  {
    icon: Leaf,
    title: "Realny efekt CO2",
    detail:
      "Kazdy wspolny przejazd liczymy do statystyk zaoszczedzonego CO2 i analityki potrzeb przejazdowych.",
  },
];

export default async function HomePage() {
  const session = await auth();

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <section className="space-y-5">
        <span className="inline-flex items-center gap-2 rounded-full bg-emerald-600/10 px-3 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">
          <MapPin className="size-3.5" /> Subregion nowosadecki - pilotaz z MPK Nowy Sacz
        </span>
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
          Razem w Drogę
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          Lokalna aplikacja do codziennych dojazdow. Pokazujemy wolne miejsce w
          aucie sasiada na trasie, ktora ktos i tak pokonuje, oraz pasujace kursy
          komunikacji miejskiej - w jednym miejscu. To nie kolejny BlaBlaCar:
          uzupelniamy transport publiczny i dzialamy przeciw wykluczeniu
          transportowemu.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          {session?.user ? (
            <>
              <Link
                href="/szukaj"
                className={buttonVariants({ size: "lg" })}
              >
                <Search /> Znajdz przejazd
              </Link>
              <Link
                href="/dodaj"
                className={buttonVariants({ variant: "outline", size: "lg" })}
              >
                <Car /> Dodaj przejazd
              </Link>
            </>
          ) : (
            <SignInButton redirectTo="/szukaj">
              Zaloguj sie przez Google
            </SignInButton>
          )}
        </div>
      </section>

      <section className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((item) => (
          <Card key={item.title}>
            <CardHeader>
              <item.icon className="size-5 text-emerald-600" />
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>{item.detail}</CardDescription>
            </CardHeader>
            <CardContent />
          </Card>
        ))}
      </section>

      <section className="mt-12 grid gap-4 sm:grid-cols-3">
        <Stat icon={Users} value="9 gmin" label="obszar dzialania MPK Nowy Sacz" />
        <Stat icon={Bus} value="auto + MPK" label="multimodalne wyniki wyszukiwania" />
        <Stat icon={Leaf} value="~0,12 kg/km" label="szacowana oszczednosc CO2 auta solo" />
      </section>
    </div>
  );
}

function Stat({
  icon: Icon,
  value,
  label,
}: {
  icon: typeof Users;
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-xl bg-card p-4 ring-1 ring-foreground/10">
      <Icon className="size-5 text-emerald-600" />
      <p className="mt-2 text-xl font-semibold">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
