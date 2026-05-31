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

// --- Demo locations in Małopolska (lat/lng) ---
const L = {
  nsRynek: { label: "Nowy Sącz, Rynek", locality: "Nowy Sącz", lat: 49.6219, lng: 20.6973 },
  nsDworzec: { label: "Nowy Sącz, Dworzec PKP/MDA", locality: "Nowy Sącz", lat: 49.6068, lng: 20.6927 },
  nsMillenium: { label: "Nowy Sącz, os. Millenium", locality: "Nowy Sącz", lat: 49.6321, lng: 20.7106 },
  nsSzpital: { label: "Nowy Sącz, Szpital im. J. Śniadeckiego", locality: "Nowy Sącz", lat: 49.6155, lng: 20.7185 },
  nsGorzkow: { label: "Nowy Sącz, Gorzków", locality: "Nowy Sącz", lat: 49.6438, lng: 20.6862 },
  starySacz: { label: "Stary Sącz, Rynek", locality: "Stary Sącz", lat: 49.5614, lng: 20.6356 },
  grybow: { label: "Grybów, Rynek", locality: "Grybów", lat: 49.6206, lng: 20.9486 },
  krynica: { label: "Krynica-Zdrój, Deptak", locality: "Krynica-Zdrój", lat: 49.4216, lng: 20.961 },
  limanowa: { label: "Limanowa, Rynek", locality: "Limanowa", lat: 49.705, lng: 20.4256 },
  muszyna: { label: "Muszyna, Rynek", locality: "Muszyna", lat: 49.355, lng: 20.8889 },
  piwniczna: { label: "Piwniczna-Zdrój", locality: "Piwniczna-Zdrój", lat: 49.4361, lng: 20.7167 },
  lacko: { label: "Łącko, Centrum", locality: "Łącko", lat: 49.5556, lng: 20.435 },
  nawojowa: { label: "Nawojowa, Centrum", locality: "Nawojowa", lat: 49.5839, lng: 20.7472 },
  kamionka: { label: "Kamionka Wielka", locality: "Kamionka Wielka", lat: 49.5897, lng: 20.8003 },
  krakowRynek: { label: "Kraków, Rynek Główny", locality: "Kraków", lat: 50.0619, lng: 19.9368 },
  krakowDworzec: { label: "Kraków, Dworzec Główny", locality: "Kraków", lat: 50.0673, lng: 19.9476 },
  krakowCzyzyny: { label: "Kraków, Czyżyny", locality: "Kraków", lat: 50.0746, lng: 20.0065 },
  tarnow: { label: "Tarnów, Rynek", locality: "Tarnów", lat: 50.0121, lng: 20.9858 },
  bochnia: { label: "Bochnia, Rynek", locality: "Bochnia", lat: 49.9691, lng: 20.4303 },
  wieliczka: { label: "Wieliczka, Rynek", locality: "Wieliczka", lat: 49.9874, lng: 20.0647 },
  brzesko: { label: "Brzesko, Rynek", locality: "Brzesko", lat: 49.9699, lng: 20.6061 },
  niepolomice: { label: "Niepołomice, Rynek", locality: "Niepołomice", lat: 50.0407, lng: 20.2228 },
  skawina: { label: "Skawina, Rynek", locality: "Skawina", lat: 49.9759, lng: 19.8287 },
  myslenice: { label: "Myślenice, Rynek", locality: "Myślenice", lat: 49.8338, lng: 19.9383 },
  wadowice: { label: "Wadowice, Rynek", locality: "Wadowice", lat: 49.8835, lng: 19.4936 },
  andrychow: { label: "Andrychów, Rynek", locality: "Andrychów", lat: 49.854, lng: 19.3383 },
  oswiecim: { label: "Oświęcim, Rynek", locality: "Oświęcim", lat: 50.0344, lng: 19.2104 },
  chrzanow: { label: "Chrzanów, Rynek", locality: "Chrzanów", lat: 50.1355, lng: 19.402 },
  olkusz: { label: "Olkusz, Rynek", locality: "Olkusz", lat: 50.2813, lng: 19.565 },
  miechow: { label: "Miechów, Rynek", locality: "Miechów", lat: 50.3565, lng: 20.0279 },
  proszowice: { label: "Proszowice, Rynek", locality: "Proszowice", lat: 50.1926, lng: 20.2891 },
  dabrowaTarnowska: { label: "Dąbrowa Tarnowska, Rynek", locality: "Dąbrowa Tarnowska", lat: 50.1746, lng: 20.9866 },
  tuchow: { label: "Tuchów, Rynek", locality: "Tuchów", lat: 49.8948, lng: 21.0541 },
  gorlice: { label: "Gorlice, Rynek", locality: "Gorlice", lat: 49.6556, lng: 21.159 },
  biecz: { label: "Biecz, Rynek", locality: "Biecz", lat: 49.7359, lng: 21.2639 },
  rabka: { label: "Rabka-Zdrój, Centrum", locality: "Rabka-Zdrój", lat: 49.6089, lng: 19.9665 },
  nowyTarg: { label: "Nowy Targ, Rynek", locality: "Nowy Targ", lat: 49.4772, lng: 20.0324 },
  zakopane: { label: "Zakopane, Krupówki", locality: "Zakopane", lat: 49.2992, lng: 19.9496 },
  suchaBeskidzka: { label: "Sucha Beskidzka, Rynek", locality: "Sucha Beskidzka", lat: 49.7419, lng: 19.5943 },
};

type Loc = (typeof L)[keyof typeof L];
type CarRideSeed = {
  driverId: string;
  origin: Loc;
  destination: Loc;
  departureAt: Date;
  seats: number;
  price: number | null;
  description?: string;
  waypoints?: Loc[];
};

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
  console.log("Seeding demo data for Razem w Drogę...");

  // Reset demo content (keeps real Google-authenticated users).
  await prisma.ride.deleteMany({});
  await prisma.user.deleteMany({ where: { email: { endsWith: "@demo.razemwdroge.pl" } } });

  // --- Demo users (drivers + passengers) ---
  const drivers = await Promise.all(
    [
      { name: "Anna Kowalska", email: "anna@demo.razemwdroge.pl", verified: true, rating: 4.9, ratingCount: 38 },
      { name: "Piotr Nowak", email: "piotr@demo.razemwdroge.pl", verified: true, rating: 4.7, ratingCount: 21 },
      { name: "Marek Wiśniewski", email: "marek@demo.razemwdroge.pl", verified: false, rating: 4.5, ratingCount: 9 },
      { name: "Katarzyna Zając", email: "kasia@demo.razemwdroge.pl", verified: true, rating: 5.0, ratingCount: 14 },
      { name: "Agnieszka Wróbel", email: "agnieszka@demo.razemwdroge.pl", verified: true, rating: 4.8, ratingCount: 17 },
      { name: "Michał Zieliński", email: "michal@demo.razemwdroge.pl", verified: true, rating: 4.6, ratingCount: 12 },
      { name: "Joanna Kaczmarek", email: "joanna@demo.razemwdroge.pl", verified: false, rating: 4.4, ratingCount: 7 },
      { name: "Paweł Lewandowski", email: "pawel@demo.razemwdroge.pl", verified: true, rating: 4.9, ratingCount: 31 },
      { name: "Magdalena Mazur", email: "magdalena@demo.razemwdroge.pl", verified: true, rating: 4.7, ratingCount: 18 },
      { name: "Krzysztof Baran", email: "krzysztof@demo.razemwdroge.pl", verified: false, rating: 4.2, ratingCount: 5 },
      { name: "Natalia Wojcik", email: "natalia@demo.razemwdroge.pl", verified: true, rating: 4.8, ratingCount: 24 },
      { name: "Grzegorz Lis", email: "grzegorz@demo.razemwdroge.pl", verified: true, rating: 4.5, ratingCount: 10 },
      { name: "Monika Sowa", email: "monika@demo.razemwdroge.pl", verified: true, rating: 4.9, ratingCount: 19 },
      { name: "Robert Dudek", email: "robert@demo.razemwdroge.pl", verified: false, rating: 4.3, ratingCount: 6 },
      { name: "Sylwia Cieśla", email: "sylwia@demo.razemwdroge.pl", verified: true, rating: 4.6, ratingCount: 13 },
      { name: "Łukasz Pawlik", email: "lukasz@demo.razemwdroge.pl", verified: true, rating: 4.7, ratingCount: 16 },
      { name: "Beata Grabowska", email: "beata@demo.razemwdroge.pl", verified: false, rating: 4.1, ratingCount: 4 },
      { name: "Dariusz Małek", email: "dariusz@demo.razemwdroge.pl", verified: true, rating: 4.8, ratingCount: 22 },
      { name: "Iwona Adamczyk", email: "iwona@demo.razemwdroge.pl", verified: true, rating: 4.5, ratingCount: 15 },
      { name: "Sebastian Krupa", email: "sebastian@demo.razemwdroge.pl", verified: false, rating: 4.0, ratingCount: 3 },
      { name: "Karolina Bednarz", email: "karolina@demo.razemwdroge.pl", verified: true, rating: 4.9, ratingCount: 27 },
      { name: "Mateusz Wilk", email: "mateusz@demo.razemwdroge.pl", verified: true, rating: 4.6, ratingCount: 11 },
      { name: "Patrycja Król", email: "patrycja@demo.razemwdroge.pl", verified: true, rating: 4.7, ratingCount: 20 },
      { name: "Rafał Górski", email: "rafal@demo.razemwdroge.pl", verified: false, rating: 4.2, ratingCount: 8 },
      { name: "Dorota Kurek", email: "dorota@demo.razemwdroge.pl", verified: true, rating: 4.8, ratingCount: 25 },
      { name: "Tadeusz Sikora", email: "tadeusz@demo.razemwdroge.pl", verified: true, rating: 4.4, ratingCount: 9 },
      { name: "Marta Nowicka", email: "marta@demo.razemwdroge.pl", verified: false, rating: 4.3, ratingCount: 6 },
      { name: "Filip Urbański", email: "filip@demo.razemwdroge.pl", verified: true, rating: 4.6, ratingCount: 14 },
    ].map((u) => prisma.user.create({ data: u })),
  );

  const passengers = await Promise.all(
    [
      { name: "Tomasz Demo", email: "tomasz@demo.razemwdroge.pl", verified: false, rating: 4.8, ratingCount: 6 },
      { name: "Ewa Demo", email: "ewa@demo.razemwdroge.pl", verified: true, rating: 4.6, ratingCount: 11 },
      { name: "Julia Sobczak", email: "julia@demo.razemwdroge.pl", verified: true, rating: 4.7, ratingCount: 8 },
      { name: "Adam Czerwiński", email: "adam@demo.razemwdroge.pl", verified: false, rating: 4.2, ratingCount: 3 },
      { name: "Oliwia Stec", email: "oliwia@demo.razemwdroge.pl", verified: true, rating: 4.9, ratingCount: 12 },
      { name: "Marcin Białek", email: "marcin@demo.razemwdroge.pl", verified: true, rating: 4.5, ratingCount: 7 },
      { name: "Weronika Wrona", email: "weronika@demo.razemwdroge.pl", verified: false, rating: 4.1, ratingCount: 2 },
      { name: "Damian Madej", email: "damian@demo.razemwdroge.pl", verified: true, rating: 4.6, ratingCount: 9 },
      { name: "Aleksandra Kopeć", email: "aleksandra@demo.razemwdroge.pl", verified: true, rating: 4.8, ratingCount: 13 },
      { name: "Norbert Borkowski", email: "norbert@demo.razemwdroge.pl", verified: false, rating: 4.0, ratingCount: 1 },
      { name: "Zuzanna Cichy", email: "zuzanna@demo.razemwdroge.pl", verified: true, rating: 4.7, ratingCount: 10 },
      { name: "Szymon Kania", email: "szymon@demo.razemwdroge.pl", verified: true, rating: 4.4, ratingCount: 5 },
    ].map((u) => prisma.user.create({ data: u })),
  );

  const [anna, piotr, marek, kasia] = drivers;
  const [tomasz, ewa] = passengers;
  const totalDemoUsers = drivers.length + passengers.length;

  if (totalDemoUsers < 40) {
    throw new Error(`Seeder requires at least 40 demo users, got ${totalDemoUsers}.`);
  }

  const malopolskaRoutePatterns: { origin: Loc; destination: Loc; waypoints?: Loc[] }[] = [
    { origin: L.krakowDworzec, destination: L.tarnow, waypoints: [L.bochnia, L.brzesko] },
    { origin: L.tarnow, destination: L.krakowDworzec, waypoints: [L.brzesko, L.bochnia] },
    { origin: L.krakowRynek, destination: L.wieliczka },
    { origin: L.wieliczka, destination: L.krakowCzyzyny, waypoints: [L.krakowDworzec] },
    { origin: L.krakowDworzec, destination: L.nowyTarg, waypoints: [L.myslenice, L.rabka] },
    { origin: L.nowyTarg, destination: L.zakopane },
    { origin: L.zakopane, destination: L.krakowDworzec, waypoints: [L.nowyTarg, L.rabka] },
    { origin: L.krakowRynek, destination: L.oswiecim, waypoints: [L.chrzanow] },
    { origin: L.oswiecim, destination: L.krakowDworzec, waypoints: [L.chrzanow] },
    { origin: L.krakowDworzec, destination: L.olkusz },
    { origin: L.olkusz, destination: L.miechow },
    { origin: L.miechow, destination: L.krakowRynek, waypoints: [L.proszowice] },
    { origin: L.proszowice, destination: L.krakowCzyzyny },
    { origin: L.bochnia, destination: L.niepolomice },
    { origin: L.niepolomice, destination: L.krakowDworzec },
    { origin: L.skawina, destination: L.krakowRynek },
    { origin: L.myslenice, destination: L.krakowDworzec },
    { origin: L.wadowice, destination: L.krakowDworzec, waypoints: [L.skawina] },
    { origin: L.andrychow, destination: L.wadowice },
    { origin: L.suchaBeskidzka, destination: L.wadowice },
    { origin: L.rabka, destination: L.myslenice },
    { origin: L.nowyTarg, destination: L.krakowDworzec, waypoints: [L.rabka, L.myslenice] },
    { origin: L.tarnow, destination: L.gorlice, waypoints: [L.tuchow] },
    { origin: L.gorlice, destination: L.tarnow, waypoints: [L.tuchow] },
    { origin: L.gorlice, destination: L.biecz },
    { origin: L.biecz, destination: L.grybow },
    { origin: L.grybow, destination: L.nsDworzec, waypoints: [L.kamionka] },
    { origin: L.nsRynek, destination: L.tarnow, waypoints: [L.grybow, L.tuchow] },
    { origin: L.tarnow, destination: L.dabrowaTarnowska },
    { origin: L.dabrowaTarnowska, destination: L.brzesko },
    { origin: L.brzesko, destination: L.nsRynek, waypoints: [L.lacko] },
    { origin: L.limanowa, destination: L.krakowDworzec, waypoints: [L.myslenice] },
    { origin: L.limanowa, destination: L.nsRynek },
    { origin: L.piwniczna, destination: L.krynica },
    { origin: L.krynica, destination: L.muszyna },
    { origin: L.muszyna, destination: L.nsRynek, waypoints: [L.piwniczna, L.starySacz] },
    { origin: L.starySacz, destination: L.lacko },
    { origin: L.lacko, destination: L.limanowa },
    { origin: L.nawojowa, destination: L.grybow },
    { origin: L.kamionka, destination: L.gorlice, waypoints: [L.grybow] },
  ];

  const extraCarRides: CarRideSeed[] = Array.from({ length: 200 }, (_, i) => {
    const route = malopolskaRoutePatterns[i % malopolskaRoutePatterns.length];
    const distance = haversineKm(
      { lat: route.origin.lat, lng: route.origin.lng },
      { lat: route.destination.lat, lng: route.destination.lng },
    );
    const hour = [5, 6, 7, 8, 9, 12, 14, 15, 16, 17, 18, 19][i % 12];
    const minute = [0, 10, 15, 20, 30, 40, 45, 50][i % 8];

    return {
      driverId: drivers[i % drivers.length].id,
      origin: route.origin,
      destination: route.destination,
      departureAt: at(Math.floor(i / 14), hour, minute),
      seats: (i % 4) + 1,
      price: Math.max(5, Math.round(distance * 0.32)),
      description: [
        "Regularny przejazd po Małopolsce, miejsce na mały bagaż.",
        "Dojazd do pracy lub na uczelnię, mogę zabrać z okolicy centrum.",
        "Elastyczny punkt odbioru na trasie po wcześniejszym ustaleniu.",
        "Spokojny przejazd, preferowany kontakt przez wiadomość w aplikacji.",
      ][i % 4],
      waypoints: route.waypoints,
    };
  });

  if (extraCarRides.length !== 200) {
    throw new Error(`Seeder requires exactly 200 extra Małopolska rides, got ${extraCarRides.length}.`);
  }

  // --- CAR rides ---
  const carRides: CarRideSeed[] = [
    {
      driverId: anna.id,
      origin: L.starySacz,
      destination: L.nsRynek,
      departureAt: at(0, 7, 30),
      seats: 3,
      price: 8,
      description: "Codzienny dojazd do pracy, mogę podjechać pod przychodnie.",
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
      description: "Wracam do domu, zabiorę na trasę przez Muszynę.",
      waypoints: [L.muszyna],
    },
    {
      driverId: anna.id,
      origin: L.nsRynek,
      destination: L.starySacz,
      departureAt: at(0, 17, 0),
      seats: 2,
      price: 0,
      description: "Bezpłatnie, mam wolne miejsce.",
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
    ...extraCarRides,
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
          { senderId: tomasz.id, body: "Dzień dobry, czy mogę dosiąść w Nawojowej?" },
          { senderId: anna.id, body: "Jasne, będę koło 7:40 przy kościele." },
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
            { senderId: ewa.id, body: "Czy mogę wziąć mały bagaż?" },
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

  console.log(
    `Done. Users: ${totalDemoUsers}, CAR rides: ${createdCarRides.length}.`,
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
