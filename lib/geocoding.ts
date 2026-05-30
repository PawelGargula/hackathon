// LocationIQ autocomplete client, biased to the Nowy Sacz subregion.
// Runs server-side only (the API key must never reach the browser).

export type GeoPoint = {
  label: string;
  locality: string | null;
  lat: number;
  lng: number;
  placeId: string | null;
};

// Bounding box roughly covering the Nowy Sacz subregion (Malopolska, PL).
// LocationIQ viewbox order is: min_lng, min_lat, max_lng, max_lat.
const VIEWBOX = "20.0,49.2,21.4,49.95";

type LocationIqResult = {
  place_id?: string;
  lat: string;
  lon: string;
  display_name: string;
  display_place?: string;
  display_address?: string;
  address?: {
    name?: string;
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
    county?: string;
  };
};

function pickLocality(r: LocationIqResult): string | null {
  const a = r.address;
  return (
    a?.city ?? a?.town ?? a?.village ?? a?.municipality ?? a?.county ?? null
  );
}

function toLabel(r: LocationIqResult): string {
  if (r.display_place && r.display_address) {
    return `${r.display_place}, ${r.display_address}`;
  }
  return r.display_name;
}

export async function autocompletePlaces(query: string): Promise<GeoPoint[]> {
  const q = query.trim();
  if (q.length < 3) return [];

  const key = process.env.LOCATIONIQ_KEY;
  if (!key) {
    console.warn("LOCATIONIQ_KEY is not set; geocoding disabled.");
    return [];
  }

  const url = new URL("https://api.locationiq.com/v1/autocomplete");
  url.searchParams.set("key", key);
  url.searchParams.set("q", q);
  url.searchParams.set("countrycodes", "pl");
  url.searchParams.set("viewbox", VIEWBOX);
  url.searchParams.set("bounded", "1");
  url.searchParams.set("limit", "6");
  url.searchParams.set("dedupe", "1");
  url.searchParams.set("tag", "place,highway,amenity,building");

  try {
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      // Results are stable enough to cache briefly.
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      // 404 simply means "no matches" for LocationIQ autocomplete.
      if (res.status === 404) return [];
      console.error("LocationIQ error", res.status, await res.text());
      return [];
    }
    const data = (await res.json()) as LocationIqResult[];
    return data.map((r) => ({
      label: toLabel(r),
      locality: pickLocality(r),
      lat: Number.parseFloat(r.lat),
      lng: Number.parseFloat(r.lon),
      placeId: r.place_id ?? null,
    }));
  } catch (err) {
    console.error("Geocoding request failed", err);
    return [];
  }
}
