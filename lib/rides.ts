// Server-side data access for rides, search and user statistics.
import "server-only";

import { prisma } from "@/lib/prisma";
import { matchRides, type ScoredRide, type SearchQuery } from "@/lib/matching";

const rideInclude = {
  driver: { select: { id: true, name: true, image: true } },
  waypoints: { orderBy: { order: "asc" } as const },
  requests: {
    where: { status: "ACCEPTED" as const },
    select: { seatsRequested: true },
  },
};

function availableSeats(ride: {
  seats: number;
  requests: { seatsRequested: number }[];
}): number {
  const taken = ride.requests.reduce((sum, r) => sum + r.seatsRequested, 0);
  return Math.max(0, ride.seats - taken);
}

export async function getRideById(id: string) {
  const ride = await prisma.ride.findUnique({
    where: { id },
    include: {
      driver: { select: { id: true, name: true, image: true } },
      waypoints: { orderBy: { order: "asc" } },
      requests: {
        select: { id: true, status: true, seatsRequested: true },
      },
    },
  });
  if (!ride) return null;
  const taken = ride.requests
    .filter((r) => r.status === "ACCEPTED")
    .reduce((sum, r) => sum + r.seatsRequested, 0);
  return { ...ride, availableSeats: Math.max(0, ride.seats - taken) };
}

export type SearchResult = ScoredRide<{
  id: string;
  kind: "CAR" | "BUS";
  originLat: number;
  originLng: number;
  originLocality: string | null;
  originLabel: string;
  destinationLat: number;
  destinationLng: number;
  destinationLocality: string | null;
  destinationLabel: string;
  departureAt: Date;
  availableSeats: number;
  seats: number;
  price: number | null;
  ticketPrice: number | null;
  operator: string | null;
  lineNumber: string | null;
  driver: { id: string; name: string | null; image: string | null } | null;
  waypoints: { locLat: number; locLng: number; locLocality: string | null }[];
}>;

export async function searchRides(query: SearchQuery): Promise<SearchResult[]> {
  // Only consider rides that have not clearly departed yet.
  const horizon = new Date(Date.now() - 2 * 60 * 60 * 1000);
  const rides = await prisma.ride.findMany({
    where: { departureAt: { gte: horizon } },
    include: rideInclude,
    orderBy: { departureAt: "asc" },
  });

  const enriched = rides.map((ride) => ({
    ...ride,
    availableSeats: availableSeats(ride),
  }));

  return matchRides(enriched, query);
}

export type StatsPeriod = { from: Date; to: Date };

export async function getUserStats(userId: string, period: StatsPeriod) {
  // Accepted requests where the user is the passenger (rides they joined).
  const asPassenger = await prisma.rideRequest.findMany({
    where: {
      passengerId: userId,
      status: "ACCEPTED",
      updatedAt: { gte: period.from, lte: period.to },
    },
    include: {
      ride: {
        select: {
          kind: true,
          originLocality: true,
          destinationLocality: true,
        },
      },
    },
  });

  // Accepted requests on rides the user drives (counts as "as driver").
  const asDriver = await prisma.rideRequest.findMany({
    where: {
      status: "ACCEPTED",
      updatedAt: { gte: period.from, lte: period.to },
      ride: { driverId: userId },
    },
    select: { id: true, distanceKm: true, co2SavedKg: true },
  });

  let co2 = 0;
  let km = 0;
  let car = 0;
  let bus = 0;
  const zonePairs = new Map<string, number>();

  for (const r of asPassenger) {
    co2 += r.co2SavedKg ?? 0;
    km += r.distanceKm ?? 0;
    if (r.ride.kind === "BUS") bus += 1;
    else car += 1;
    const from = r.originZone ?? r.ride.originLocality ?? "?";
    const to = r.destinationZone ?? r.ride.destinationLocality ?? "?";
    const key = `${from} \u2192 ${to}`;
    zonePairs.set(key, (zonePairs.get(key) ?? 0) + 1);
  }

  const topZones = [...zonePairs.entries()]
    .map(([pair, count]) => ({ pair, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    co2SavedKg: Math.round(co2 * 100) / 100,
    sharedKm: Math.round(km * 10) / 10,
    ridesAsPassenger: asPassenger.length,
    ridesAsDriver: asDriver.length,
    ridesCar: car,
    ridesBus: bus,
    totalRides: asPassenger.length,
    topZones,
  };
}
