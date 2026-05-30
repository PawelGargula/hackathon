// Server-side data access for rides, search and user statistics.
import "server-only";

import { prisma } from "@/lib/prisma";
import { matchRides, type ScoredRide, type SearchQuery } from "@/lib/matching";
import { haversineKm } from "@/lib/co2";
import {
  getAchievements,
  getTreeLevel,
  type Achievement,
  type TreeLevel,
} from "@/lib/gamification";

const rideInclude = {
  driver: {
    select: {
      id: true,
      name: true,
      image: true,
      verified: true,
      rating: true,
    },
  },
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
      driver: {
        select: {
          id: true,
          name: true,
          image: true,
          verified: true,
          rating: true,
          ratingCount: true,
        },
      },
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
  driver: {
    id: string;
    name: string | null;
    image: string | null;
    verified: boolean;
    rating: number | null;
  } | null;
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

// Lightweight counters for the navigation badges (pending driver requests
// and active conversations the user takes part in).
export async function getNavCounts(userId: string) {
  const [pending, messages] = await Promise.all([
    prisma.rideRequest.count({
      where: { status: "PENDING", ride: { driverId: userId } },
    }),
    prisma.rideRequest.count({
      where: {
        messages: { some: {} },
        OR: [{ passengerId: userId }, { ride: { driverId: userId } }],
      },
    }),
  ]);
  return { pending, messages };
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

export type PopularRoute = {
  from: string;
  to: string;
  count: number;
  distanceKm: number;
  origin: { lat: number; lng: number };
  destination: { lat: number; lng: number };
};

// Aggregates published rides by locality pair to surface frequent relations.
export async function getPopularRoutes(limit = 6): Promise<PopularRoute[]> {
  const rides = await prisma.ride.findMany({
    select: {
      originLocality: true,
      originLabel: true,
      originLat: true,
      originLng: true,
      destinationLocality: true,
      destinationLabel: true,
      destinationLat: true,
      destinationLng: true,
    },
  });

  const map = new Map<string, PopularRoute>();
  for (const r of rides) {
    const from = r.originLocality ?? r.originLabel;
    const to = r.destinationLocality ?? r.destinationLabel;
    if (from === to) continue;
    const key = `${from}__${to}`;
    const existing = map.get(key);
    if (existing) {
      existing.count += 1;
    } else {
      map.set(key, {
        from,
        to,
        count: 1,
        distanceKm: Math.round(
          haversineKm(
            { lat: r.originLat, lng: r.originLng },
            { lat: r.destinationLat, lng: r.destinationLng },
          ),
        ),
        origin: { lat: r.originLat, lng: r.originLng },
        destination: { lat: r.destinationLat, lng: r.destinationLng },
      });
    }
  }

  return [...map.values()]
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export type RecentRide = {
  rideId: string;
  kind: "CAR" | "BUS";
  originLabel: string;
  destinationLabel: string;
  departureAt: Date;
  price: number | null;
  role: "passenger" | "driver";
  counterpart: string | null;
  co2SavedKg: number | null;
};

export type DashboardData = {
  stats: {
    co2SavedKg: number;
    kmThisMonth: number;
    kmThisYear: number;
    ridesAvoidedSolo: number;
  };
  tree: TreeLevel;
  achievements: Achievement[];
  recentRides: RecentRide[];
  popularRoutes: PopularRoute[];
};

export async function getDashboardData(userId: string): Promise<DashboardData> {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const yearStart = new Date(now.getFullYear(), 0, 1);

  const [asPassenger, drivenRides, popularRoutes] = await Promise.all([
    prisma.rideRequest.findMany({
      where: { passengerId: userId, status: "ACCEPTED" },
      orderBy: { updatedAt: "desc" },
      include: {
        ride: {
          select: {
            id: true,
            kind: true,
            originLabel: true,
            destinationLabel: true,
            departureAt: true,
            price: true,
            ticketPrice: true,
            driver: { select: { name: true } },
          },
        },
      },
    }),
    prisma.ride.findMany({
      where: { driverId: userId },
      orderBy: { departureAt: "desc" },
      include: {
        requests: {
          where: { status: "ACCEPTED" },
          select: {
            co2SavedKg: true,
            distanceKm: true,
            updatedAt: true,
            passenger: { select: { name: true } },
          },
        },
      },
    }),
    getPopularRoutes(),
  ]);

  let co2 = 0;
  let kmThisMonth = 0;
  let kmThisYear = 0;
  let rides = 0;

  const tally = (km: number | null, kg: number | null, when: Date) => {
    co2 += kg ?? 0;
    rides += 1;
    if (when >= monthStart) kmThisMonth += km ?? 0;
    if (when >= yearStart) kmThisYear += km ?? 0;
  };

  for (const r of asPassenger) tally(r.distanceKm, r.co2SavedKg, r.updatedAt);
  for (const ride of drivenRides) {
    for (const req of ride.requests) {
      tally(req.distanceKm, req.co2SavedKg, req.updatedAt);
    }
  }

  const totalKm =
    asPassenger.reduce((s, r) => s + (r.distanceKm ?? 0), 0) +
    drivenRides.reduce(
      (s, ride) => s + ride.requests.reduce((x, r) => x + (r.distanceKm ?? 0), 0),
      0,
    );

  const recentFromRequests: RecentRide[] = asPassenger.slice(0, 6).map((r) => ({
    rideId: r.ride.id,
    kind: r.ride.kind,
    originLabel: r.ride.originLabel,
    destinationLabel: r.ride.destinationLabel,
    departureAt: r.ride.departureAt,
    price: r.ride.kind === "BUS" ? r.ride.ticketPrice : r.ride.price,
    role: "passenger" as const,
    counterpart: r.ride.driver?.name ?? null,
    co2SavedKg: r.co2SavedKg,
  }));

  const recentFromDriven: RecentRide[] = drivenRides
    .filter((ride) => ride.requests.length > 0)
    .slice(0, 6)
    .map((ride) => ({
      rideId: ride.id,
      kind: ride.kind,
      originLabel: ride.originLabel,
      destinationLabel: ride.destinationLabel,
      departureAt: ride.departureAt,
      price: ride.price,
      role: "driver" as const,
      counterpart: ride.requests[0]?.passenger.name ?? null,
      co2SavedKg: ride.requests.reduce((s, r) => s + (r.co2SavedKg ?? 0), 0),
    }));

  const recentRides = [...recentFromRequests, ...recentFromDriven]
    .sort((a, b) => b.departureAt.getTime() - a.departureAt.getTime())
    .slice(0, 4);

  return {
    stats: {
      co2SavedKg: Math.round(co2 * 10) / 10,
      kmThisMonth: Math.round(kmThisMonth),
      kmThisYear: Math.round(kmThisYear),
      ridesAvoidedSolo: rides,
    },
    tree: getTreeLevel(Math.round(co2 * 10) / 10),
    achievements: getAchievements({
      co2Kg: Math.round(co2 * 10) / 10,
      km: Math.round(totalKm),
      rides,
    }),
    recentRides,
    popularRoutes,
  };
}

// Lifetime impact totals + derived tree/achievements for the profile page.
export async function getLifetimeImpact(userId: string) {
  const [asPassenger, drivenRides] = await Promise.all([
    prisma.rideRequest.findMany({
      where: { passengerId: userId, status: "ACCEPTED" },
      select: { co2SavedKg: true, distanceKm: true },
    }),
    prisma.ride.findMany({
      where: { driverId: userId },
      select: {
        requests: {
          where: { status: "ACCEPTED" },
          select: { co2SavedKg: true, distanceKm: true },
        },
      },
    }),
  ]);

  let co2 = 0;
  let km = 0;
  let rides = 0;
  for (const r of asPassenger) {
    co2 += r.co2SavedKg ?? 0;
    km += r.distanceKm ?? 0;
    rides += 1;
  }
  for (const ride of drivenRides) {
    for (const r of ride.requests) {
      co2 += r.co2SavedKg ?? 0;
      km += r.distanceKm ?? 0;
      rides += 1;
    }
  }

  const totals = {
    co2Kg: Math.round(co2 * 10) / 10,
    km: Math.round(km),
    rides,
  };

  return {
    totals,
    tree: getTreeLevel(totals.co2Kg),
    achievements: getAchievements(totals),
  };
}
