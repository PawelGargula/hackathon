import { redirect } from "next/navigation";
import { SearchX } from "lucide-react";
import { auth } from "@/lib/auth";
import { searchRides } from "@/lib/rides";
import { SearchForm } from "@/components/search-form";
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

  const hasQuery = origin && destination && when;
  const results = hasQuery
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

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-2xl font-bold tracking-tight">Znajdz przejazd</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Wpisz skad, dokad i kiedy chcesz jechac. Pokazemy auta sasiadow i kursy
        MPK w jednej liscie.
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

      {results && (
        <div className="mt-8">
          <h2 className="mb-3 text-sm font-medium text-muted-foreground">
            {results.length > 0
              ? `Znaleziono ${results.length} pasujacych opcji`
              : "Brak wynikow"}
          </h2>
          {results.length === 0 ? (
            <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed p-10 text-center text-muted-foreground">
              <SearchX className="size-6" />
              <p className="text-sm">
                Nie znalezlismy przejazdow dla tej trasy i czasu. Sprobuj zwiekszyc
                elastycznosc godziny.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {results.map((r) => (
                <RideCard key={r.ride.id} ride={r.ride} reasons={r.reasons} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
