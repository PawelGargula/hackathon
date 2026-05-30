import { PrismaPg } from "@prisma/adapter-pg";
import { config } from "dotenv";
import { PrismaClient } from "../lib/generated/prisma/client";
import { co2SavedKg, haversineKm, roundKg } from "../lib/co2";

// Load Next.js-style env files (credentials live in .env.local).
config({ path: ".env.local" });
config({ path: ".env" });

const adapter = new PrismaPg({
  connectionString: process.env.DIRECT_URL ?? process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

// --- Demo locations in the Nowy Sacz subregion (lat/lng) ---
const L = {
  nsRynek: { label: "Nowy Sacz, Rynek", locality: "Nowy Sacz", lat: 49.6219, lng: 20.6973 },
  nsDworzec: { label: "Nowy Sacz, Dworzec PKP/MDA", locality: "Nowy Sacz", lat: 49.6068, lng: 20.6927 },
  nsMillenium: { label: "Nowy Sacz, os. Millenium", locality: "Nowy Sacz", lat: 49.6321, lng: 20.7106 },
  nsSzpital: { label: "Nowy Sacz, Szpital im. J. Sniadeckiego", locality: "Nowy Sacz", lat: 49.6155, lng: 20.7185 },
  nsGorzkow: { label: "Nowy Sacz, Gorzkow", locality: "Nowy Sacz", lat: 49.6438, lng: 20.6862 },
  starySacz: { label: "Stary Sacz, Rynek", locality: "Stary Sacz", lat: 49.5614, lng: 20.6356 },
  grybow: { label: "Grybow, Rynek", locality: "Grybow", lat: 49.6206, lng: 20.9486 },
  krynica: { label: "Krynica-Zdroj, Deptak", locality: "Krynica-Zdroj", lat: 49.4216, lng: 20.961 },
  limanowa: { label: "Limanowa, Rynek", locality: "Limanowa", lat: 49.705, lng: 20.4256 },
  muszyna: { label: "Muszyna, Rynek", locality: "Muszyna", lat: 49.355, lng: 20.8889 },
  piwniczna: { label: "Piwniczna-Zdroj", locality: "Piwniczna-Zdroj", lat: 49.4361, lng: 20.7167 },
  lacko: { label: "Lacko, Centrum", locality: "Lacko", lat: 49.5556, lng: 20.435 },
  nawojowa: { label: "Nawojowa, Centrum", locality: "Nawojowa", lat: 49.5839, lng: 20.7472 },
  kamionka: { label: "Kamionka Wielka", locality: "Kamionka Wielka", lat: 49.5897, lng: 20.8003 },
};

type Loc = (typeof L)[keyof typeof L];

function originData(loc: Loc) {
  return {
    originLabel: loc.label,
    originLocality: loc.locality,
    originLat: loc.lat,
    originLng: loc.lng,
  };
}
function destinationData(loc: Loc) {
  return {
    destinationLabel: loc.label,
    destinationLocality: loc.locality,
    destinationLat: loc.lat,
    destinationLng: loc.lng,
  };
}

// Returns a Date offset by a number of days/hours from now.
function at(daysFromNow: number, hour: number, minute = 0): Date {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  d.setHours(hour, minute, 0, 0);
  return d;
}

async function main() {
  console.log("Seeding demo data for Razem w Droge...");

  // Reset demo content (keeps real Google-authenticated users).
  await prisma.ride.deleteMany({});
  await prisma.user.deleteMany({ where: { email: { endsWith: "@demo.razemwdroge.pl" } } });

  // --- Demo users (drivers + passengers) ---
  const drivers = await Promise.all(
    [
      { name: "Anna Kowalska", email: "anna@demo.razemwdroge.pl" },
      { name: "Piotr Nowak", email: "piotr@demo.razemwdroge.pl" },
      { name: "Marek Wisniewski", email: "marek@demo.razemwdroge.pl" },
      { name: "Katarzyna Zajac", email: "kasia@demo.razemwdroge.pl" },
    ].map((u) => prisma.user.create({ data: u })),
  );

  const passengers = await Promise.all(
    [
      { name: "Tomasz Demo", email: "tomasz@demo.razemwdroge.pl" },
      { name: "Ewa Demo", email: "ewa@demo.razemwdroge.pl" },
    ].map((u) => prisma.user.create({ data: u })),
  );

  const [anna, piotr, marek, kasia] = drivers;
  const [tomasz, ewa] = passengers;

  // --- CAR rides ---
  const carRides: {
    driverId: string;
    origin: Loc;
    destination: Loc;
    departureAt: Date;
    seats: number;
    price: number | null;
    description?: string;
    waypoints?: Loc[];
  }[] = [
    {
      driverId: anna.id,
      origin: L.starySacz,
      destination: L.nsRynek,
      departureAt: at(0, 7, 30),
      seats: 3,
      price: 8,
      description: "Codzienny dojazd do pracy, moge podjechac pod przychodnie.",
      waypoints: [L.nawojowa],
    },
    {
      driverId: piotr.id,
      origin: L.grybow,
      destination: L.nsDworzec,
      departureAt: at(0, 8, 0),
      seats: 2,
      price: 10,
      waypoints: [L.kamionka],
    },
    {
      driverId: marek.id,
      origin: L.limanowa,
      destination: L.nsRynek,
      departureAt: at(1, 9, 0),
      seats: 4,
      price: 12,
    },
    {
      driverId: kasia.id,
      origin: L.nsRynek,
      destination: L.krynica,
      departureAt: at(1, 16, 0),
      seats: 3,
      price: 15,
      description: "Wracam do domu, zabiore na trase przez Muszyne.",
      waypoints: [L.muszyna],
    },
    {
      driverId: anna.id,
      origin: L.nsRynek,
      destination: L.starySacz,
      departureAt: at(0, 17, 0),
      seats: 2,
      price: 0,
      description: "Bezplatnie, mam wolne miejsce.",
    },
    {
      driverId: piotr.id,
      origin: L.lacko,
      destination: L.nsDworzec,
      departureAt: at(2, 7, 0),
      seats: 3,
      price: 9,
    },
    {
      driverId: marek.id,
      origin: L.piwniczna,
      destination: L.nsRynek,
      departureAt: at(0, 7, 45),
      seats: 1,
      price: 11,
      waypoints: [L.starySacz],
    },
    {
      driverId: kasia.id,
      origin: L.nsRynek,
      destination: L.grybow,
      departureAt: at(1, 15, 30),
      seats: 2,
      price: 10,
    },
    {
      driverId: anna.id,
      origin: L.nawojowa,
      destination: L.nsSzpital,
      departureAt: at(0, 8, 15),
      seats: 3,
      price: 6,
    },
    {
      driverId: piotr.id,
      origin: L.muszyna,
      destination: L.krynica,
      departureAt: at(2, 10, 0),
      seats: 3,
      price: 5,
    },
  ];

  const createdCarRides = [];
  for (const r of carRides) {
    const ride = await prisma.ride.create({
      data: {
        kind: "CAR",
        driverId: r.driverId,
        ...originData(r.origin),
        ...destinationData(r.destination),
        departureAt: r.departureAt,
        seats: r.seats,
        price: r.price,
        description: r.description,
        waypoints: {
          create: (r.waypoints ?? []).map((w, i) => ({
            order: i,
            locLabel: w.label,
            locLocality: w.locality,
            locLat: w.lat,
            locLng: w.lng,
          })),
        },
      },
    });
    createdCarRides.push(ride);
  }

  // --- BUS rides (MPK Nowy Sacz, curated) ---
  const busLines: {
    line: string;
    origin: Loc;
    destination: Loc;
    departureAt: Date;
    ticketPrice: number;
    stops: Loc[];
  }[] = [
    {
      line: "8",
      origin: L.nsDworzec,
      destination: L.nsMillenium,
      departureAt: at(0, 7, 40),
      ticketPrice: 4,
      stops: [L.nsRynek, L.nsSzpital],
    },
    {
      line: "12",
      origin: L.nsDworzec,
      destination: L.nsGorzkow,
      departureAt: at(0, 8, 10),
      ticketPrice: 4,
      stops: [L.nsRynek],
    },
    {
      line: "20",
      origin: L.nsRynek,
      destination: L.nsSzpital,
      departureAt: at(0, 8, 20),
      ticketPrice: 4,
      stops: [L.nsMillenium],
    },
  ];

  const createdBusRides = [];
  for (const b of busLines) {
    const ride = await prisma.ride.create({
      data: {
        kind: "BUS",
        operator: "MPK Nowy Sacz",
        lineNumber: b.line,
        ticketPrice: b.ticketPrice,
        ...originData(b.origin),
        ...destinationData(b.destination),
        departureAt: b.departureAt,
        seats: 30,
        description: "Kurs komunikacji miejskiej MPK Nowy Sacz.",
        waypoints: {
          create: b.stops.map((w, i) => ({
            order: i,
            locLabel: w.label,
            locLocality: w.locality,
            locLat: w.lat,
            locLng: w.lng,
          })),
        },
      },
    });
    createdBusRides.push(ride);
  }

  // --- Requests (CAR) in various statuses, with message threads ---
  // Pending request with a short conversation.
  const annaCommute = createdCarRides[0];
  await prisma.rideRequest.create({
    data: {
      rideId: annaCommute.id,
      passengerId: tomasz.id,
      status: "PENDING",
      pickupLabel: L.nawojowa.label,
      pickupLat: L.nawojowa.lat,
      pickupLng: L.nawojowa.lng,
      dropoffLabel: L.nsRynek.label,
      dropoffLat: L.nsRynek.lat,
      dropoffLng: L.nsRynek.lng,
      seatsRequested: 1,
      messages: {
        create: [
          { senderId: tomasz.id, body: "Dzien dobry, czy moge dosiasc w Nawojowej?" },
          { senderId: anna.id, body: "Jasne, bede kolo 7:40 przy kosciele." },
        ],
      },
    },
  });

  // Accepted CAR request (counts to stats).
  const marekRide = createdCarRides[2];
  {
    const distance = haversineKm(
      { lat: L.limanowa.lat, lng: L.limanowa.lng },
      { lat: L.nsRynek.lat, lng: L.nsRynek.lng },
    );
    await prisma.rideRequest.create({
      data: {
        rideId: marekRide.id,
        passengerId: ewa.id,
        status: "ACCEPTED",
        pickupLabel: L.limanowa.label,
        pickupLat: L.limanowa.lat,
        pickupLng: L.limanowa.lng,
        dropoffLabel: L.nsRynek.label,
        dropoffLat: L.nsRynek.lat,
        dropoffLng: L.nsRynek.lng,
        seatsRequested: 1,
        distanceKm: Math.round(distance * 10) / 10,
        co2SavedKg: roundKg(co2SavedKg("CAR", distance)),
        originZone: L.limanowa.locality,
        destinationZone: L.nsRynek.locality,
        messages: {
          create: [
            { senderId: ewa.id, body: "Czy moge wziac maly bagaz?" },
            { senderId: marek.id, body: "Tak, bez problemu. Do zobaczenia!" },
          ],
        },
      },
    });
  }

  // Rejected CAR request.
  await prisma.rideRequest.create({
    data: {
      rideId: createdCarRides[6].id,
      passengerId: tomasz.id,
      status: "REJECTED",
      pickupLabel: L.starySacz.label,
      pickupLat: L.starySacz.lat,
      pickupLng: L.starySacz.lng,
      dropoffLabel: L.nsRynek.label,
      dropoffLat: L.nsRynek.lat,
      dropoffLng: L.nsRynek.lng,
      seatsRequested: 1,
      messages: {
        create: [{ senderId: tomasz.id, body: "Czy jest jeszcze miejsce?" }],
      },
    },
  });

  // --- Bus joins (auto-accepted), counted to stats ---
  for (const passenger of [tomasz, ewa]) {
    const bus = createdBusRides[0];
    const distance = haversineKm(
      { lat: bus.originLat, lng: bus.originLng },
      { lat: bus.destinationLat, lng: bus.destinationLng },
    );
    await prisma.rideRequest.create({
      data: {
        rideId: bus.id,
        passengerId: passenger.id,
        status: "ACCEPTED",
        pickupLabel: bus.originLabel,
        pickupLat: bus.originLat,
        pickupLng: bus.originLng,
        dropoffLabel: bus.destinationLabel,
        dropoffLat: bus.destinationLat,
        dropoffLng: bus.destinationLng,
        seatsRequested: 1,
        distanceKm: Math.max(1, Math.round(distance * 10) / 10),
        co2SavedKg: roundKg(co2SavedKg("BUS", Math.max(1, distance))),
        originZone: bus.originLocality,
        destinationZone: bus.destinationLocality,
      },
    });
  }

  console.log(
    `Done. Users: ${drivers.length + passengers.length}, CAR rides: ${createdCarRides.length}, BUS rides: ${createdBusRides.length}.`,
  );
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
