import { Suspense } from "react";
import { redirect } from "next/navigation";
import { SearchX } from "lucide-react";
import { auth } from "@/lib/auth";
import { searchRides, type SearchResult } from "@/lib/rides";
import { SearchForm } from "@/components/search-form";
import { SearchFilters } from "@/components/search-filters";
import { RideCard } from "@/components/ride-card";
import type { GeoPoint } from "@/components/location-autocomplete";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function one(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function toPoint(
  label?: string,
  locality?: string,
  lat?: string,
  lng?: string,
): GeoPoint | null {
  const latN = lat ? Number(lat) : NaN;
  const lngN = lng ? Number(lng) : NaN;
  if (!label || !Number.isFinite(latN) || !Number.isFinite(lngN)) return null;
  return { label, locality: locality ?? null, lat: latN, lng: lngN, placeId: null };
}

function applyFilters(
  results: SearchResult[],
  filters: {
    dFrom: number;
    dTo: number;
    pMax: number | null;
    verified: boolean;
  },
): SearchResult[] {
  return results.filter(({ ride }) => {
    const hour = ride.departureAt.getHours();
    if (hour < filters.dFrom || hour > filters.dTo) return false;

    if (filters.pMax != null) {
      const cost = ride.kind === "BUS" ? ride.ticketPrice : ride.price;
      if (cost != null && cost > filters.pMax) return false;
    }

    if (filters.verified && ride.kind === "CAR" && !ride.driver?.verified) {
      return false;
    }

    return true;
  });
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const session = await auth();
  if (!session?.user) redirect("/api/auth/signin");

  const sp = await searchParams;
  const origin = toPoint(
    one(sp.originLabel),
    one(sp.originLocality),
    one(sp.originLat),
    one(sp.originLng),
  );
  const destination = toPoint(
    one(sp.destinationLabel),
    one(sp.destinationLocality),
    one(sp.destinationLat),
    one(sp.destinationLng),
  );
  const when = one(sp.when);
  const seats = Number(one(sp.seats) ?? "1") || 1;
  const flexRaw = one(sp.flex);
  const flexHours = flexRaw && Number(flexRaw) > 0 ? Number(flexRaw) : null;

  const filters = {
    dFrom: Number(one(sp.dFrom) ?? "0"),
    dTo: Number(one(sp.dTo) ?? "23"),
    pMax: one(sp.pMax) ? Number(one(sp.pMax)) : null,
    verified: one(sp.verified) === "1",
  };

  const hasQuery = origin && destination && when;
  const rawResults = hasQuery
    ? await searchRides({
        origin: { lat: origin.lat, lng: origin.lng, locality: origin.locality },
        destination: {
          lat: destination.lat,
          lng: destination.lng,
          locality: destination.locality,
        },
        departureAt: new Date(when),
        seats,
        flexHours,
      })
    : null;

  const results = rawResults ? applyFilters(rawResults, filters) : null;

  return (
    <div className="mx-auto max-w-6xl min-w-0">
      <h1 className="font-heading text-2xl font-bold tracking-tight">
        Szukaj przejazdu
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Wpisz skąd, dokąd i kiedy chcesz jechać. Pokażemy auta sąsiadów i kursy
        MPK w jednej liście.
      </p>

      <div className="mt-6">
        <SearchForm
          defaults={{
            origin,
            destination,
            when,
            seats: String(seats),
            flex: flexRaw,
          }}
        />
      </div>

      <div className="mt-6 grid min-w-0 gap-6 lg:grid-cols-[18rem_1fr]">
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <Suspense
            fallback={
              <div className="h-72 animate-pulse rounded-2xl bg-card ring-1 ring-border" />
            }
          >
            <SearchFilters />
          </Suspense>
        </aside>

        <div className="min-w-0">
          {results ? (
            <>
              <h2 className="mb-3 text-sm font-medium text-muted-foreground">
                {results.length > 0
                  ? `Znaleziono ${results.length} pasujących opcji`
                  : "Brak wyników"}
              </h2>
              {results.length === 0 ? (
                <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">
                  <SearchX className="size-6" />
                  <p className="text-sm">
                    Nie znaleźliśmy przejazdów dla tej trasy, czasu i filtrów.
                    Spróbuj zwiększyć elastyczność godziny lub poluzować filtry.
                  </p>
                </div>
              ) : (
                <div className="flex min-w-0 flex-col gap-3">
                  {results.map((r) => (
                    <RideCard key={r.ride.id} ride={r.ride} reasons={r.reasons} />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">
              <SearchX className="size-6" />
              <p className="text-sm">
                Wpisz trasę i godzinę powyżej, aby zobaczyć dostępne przejazdy.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
