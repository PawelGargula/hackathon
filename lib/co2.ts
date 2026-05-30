// CO2 estimation constants and helpers (MVP, demonstration estimate only).
// Kept in one place so the figures are easy to explain and tweak.

import type { RideKind } from "@/lib/generated/prisma/client";

// Emissions of a solo combustion-engine car ride.
export const CAR_SOLO_KG_PER_KM = 0.12;
// Approximate per-passenger emissions of municipal bus transport.
export const BUS_PER_PAX_KG_PER_KM = 0.03;

export type LatLng = { lat: number; lng: number };

const EARTH_RADIUS_KM = 6371;

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

// Great-circle distance in kilometers (no road routing in MVP).
export function haversineKm(a: LatLng, b: LatLng): number {
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(h)));
}

// Estimated CO2 saved by taking this shared ride instead of driving solo.
export function co2SavedKg(kind: RideKind, distanceKm: number): number {
  const perKm =
    kind === "BUS"
      ? CAR_SOLO_KG_PER_KM - BUS_PER_PAX_KG_PER_KM
      : CAR_SOLO_KG_PER_KM;
  return distanceKm * perKm;
}

export function roundKg(value: number): number {
  return Math.round(value * 100) / 100;
}
