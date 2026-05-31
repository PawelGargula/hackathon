// Ride matching / relevance scoring for the passenger search (MVP).
// Compares a passenger query (origin, destination, time) against available
// rides using locality match + great-circle proximity + time closeness.

import type { RideKind } from "@/lib/generated/prisma/client";
import { haversineKm, type LatLng } from "@/lib/co2";

export type SearchQuery = {
  origin: LatLng & { locality?: string | null };
  destination: LatLng & { locality?: string | null };
  departureAt: Date;
  seats: number;
  // Optional time flexibility in hours (Should have: "+/- 1 godzina").
  flexHours?: number | null;
};

export type WaypointForMatch = {
  locLat: number;
  locLng: number;
  locLocality: string | null;
};

export type RideForMatch = {
  id: string;
  kind: RideKind;
  originLat: number;
  originLng: number;
  originLocality: string | null;
  destinationLat: number;
  destinationLng: number;
  destinationLocality: string | null;
  departureAt: Date;
  availableSeats: number;
  waypoints: WaypointForMatch[];
};

export type ScoredRide<T extends RideForMatch = RideForMatch> = {
  ride: T;
  score: number;
  reasons: string[];
  originDistanceKm: number;
  destinationDistanceKm: number;
  minutesDiff: number;
};

// Local-first matching: the pickup point must be within walking / short-drive
// range, and the drop-off point reasonably close too.
const ORIGIN_REF_KM = 3;
const DEST_REF_KM = 5;
// Hard cut-offs: rides outside these radii are not shown at all.
const MAX_ORIGIN_KM = 3;
const MAX_DEST_KM = 5;
const DEFAULT_TIME_WINDOW_MIN = 180;
const WAYPOINT_NEAR_KM = 4;

function proximityScore(distanceKm: number, refKm: number): number {
  return Math.max(0, 1 - distanceKm / refKm);
}

function sameLocality(a?: string | null, b?: string | null): boolean {
  if (!a || !b) return false;
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

function minWaypointDistance(
  ride: RideForMatch,
  point: LatLng,
): number {
  if (ride.waypoints.length === 0) return Number.POSITIVE_INFINITY;
  return Math.min(
    ...ride.waypoints.map((w) =>
      haversineKm({ lat: w.locLat, lng: w.locLng }, point),
    ),
  );
}

export function scoreRide<T extends RideForMatch>(
  ride: T,
  query: SearchQuery,
): ScoredRide<T> {
  const originDistanceKm = haversineKm(
    { lat: ride.originLat, lng: ride.originLng },
    query.origin,
  );
  const destinationDistanceKm = haversineKm(
    { lat: ride.destinationLat, lng: ride.destinationLng },
    query.destination,
  );

  const minutesDiff = Math.abs(
    (ride.departureAt.getTime() - query.departureAt.getTime()) / 60000,
  );
  const windowMin = query.flexHours
    ? query.flexHours * 60
    : DEFAULT_TIME_WINDOW_MIN;
  const timeScore = Math.max(0, 1 - minutesDiff / windowMin);

  const waypointToOrigin = minWaypointDistance(ride, query.origin);
  const waypointToDestination = minWaypointDistance(ride, query.destination);
  const waypointNear =
    waypointToOrigin <= WAYPOINT_NEAR_KM ||
    waypointToDestination <= WAYPOINT_NEAR_KM;

  let score =
    proximityScore(originDistanceKm, ORIGIN_REF_KM) * 0.4 +
    proximityScore(destinationDistanceKm, DEST_REF_KM) * 0.3 +
    timeScore * 0.2;

  if (waypointNear) score += 0.1;
  if (ride.kind === "BUS") score += 0.05;

  const reasons: string[] = [];
  const originLocalityMatch = sameLocality(
    ride.originLocality,
    query.origin.locality,
  );
  const destLocalityMatch = sameLocality(
    ride.destinationLocality,
    query.destination.locality,
  );

  if (originDistanceKm < 1 && destinationDistanceKm < 1) {
    reasons.push("dokladna trasa");
  } else {
    if (originDistanceKm < 1) reasons.push("tuz obok");
    else if (originDistanceKm < 3) reasons.push("blisko punktu startu");
    else if (originLocalityMatch) reasons.push("ta sama miejscowosc startu");
    if (destinationDistanceKm < 3) reasons.push("blisko celu");
    else if (destLocalityMatch) reasons.push("ta sama miejscowosc celu");
  }
  if (waypointNear) reasons.push("punkt po drodze");
  if (minutesDiff <= 30) reasons.push("podobna godzina");
  if (ride.kind === "BUS") reasons.push("autobus");

  return {
    ride,
    score: Math.round(score * 1000) / 10,
    reasons,
    originDistanceKm,
    destinationDistanceKm,
    minutesDiff,
  };
}

export function matchRides<T extends RideForMatch>(
  rides: T[],
  query: SearchQuery,
): ScoredRide<T>[] {
  const windowMin = query.flexHours
    ? query.flexHours * 60
    : DEFAULT_TIME_WINDOW_MIN;

  return rides
    .filter((ride) => {
      // CAR rides must still have a free seat.
      if (ride.kind === "CAR" && ride.availableSeats < query.seats) {
        return false;
      }
      // Respect explicit time flexibility filter when provided.
      if (query.flexHours) {
        const minutesDiff = Math.abs(
          (ride.departureAt.getTime() - query.departureAt.getTime()) / 60000,
        );
        if (minutesDiff > windowMin) return false;
      }
      return true;
    })
    .map((ride) => scoreRide(ride, query))
    // Local-first: keep only rides whose pickup AND drop-off are nearby.
    .filter(
      (s) =>
        s.originDistanceKm <= MAX_ORIGIN_KM &&
        s.destinationDistanceKm <= MAX_DEST_KM,
    )
    .sort((a, b) => b.score - a.score);
}
