"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { co2SavedKg, haversineKm, roundKg } from "@/lib/co2";

function num(value: FormDataEntryValue | null): number | null {
  if (value == null || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function str(value: FormDataEntryValue | null): string | null {
  if (value == null) return null;
  const s = String(value).trim();
  return s.length ? s : null;
}

async function requireUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) redirect("/api/auth/signin");
  return session.user.id;
}

type WaypointInput = {
  label: string;
  locality: string | null;
  lat: number;
  lng: number;
};

export async function createRide(formData: FormData) {
  const userId = await requireUserId();

  const originLabel = str(formData.get("originLabel"));
  const originLat = num(formData.get("originLat"));
  const originLng = num(formData.get("originLng"));
  const destinationLabel = str(formData.get("destinationLabel"));
  const destinationLat = num(formData.get("destinationLat"));
  const destinationLng = num(formData.get("destinationLng"));
  const departureRaw = str(formData.get("departureAt"));
  const seats = num(formData.get("seats")) ?? 1;

  if (
    !originLabel ||
    originLat == null ||
    originLng == null ||
    !destinationLabel ||
    destinationLat == null ||
    destinationLng == null ||
    !departureRaw
  ) {
    throw new Error("Brakuje wymaganych pol przejazdu (start, cel, godzina).");
  }

  let waypoints: WaypointInput[] = [];
  const waypointsRaw = str(formData.get("waypoints"));
  if (waypointsRaw) {
    try {
      waypoints = JSON.parse(waypointsRaw) as WaypointInput[];
    } catch {
      waypoints = [];
    }
  }

  const ride = await prisma.ride.create({
    data: {
      kind: "CAR",
      driverId: userId,
      originLabel,
      originLocality: str(formData.get("originLocality")),
      originLat,
      originLng,
      originPlaceId: str(formData.get("originPlaceId")),
      destinationLabel,
      destinationLocality: str(formData.get("destinationLocality")),
      destinationLat,
      destinationLng,
      destinationPlaceId: str(formData.get("destinationPlaceId")),
      departureAt: new Date(departureRaw),
      seats,
      price: num(formData.get("price")),
      description: str(formData.get("description")),
      waypoints: {
        create: waypoints
          .filter((w) => w && w.label && Number.isFinite(w.lat))
          .map((w, index) => ({
            order: index,
            locLabel: w.label,
            locLocality: w.locality ?? null,
            locLat: w.lat,
            locLng: w.lng,
          })),
      },
    },
  });

  revalidatePath("/moje-przejazdy");
  revalidatePath("/szukaj");
  redirect(`/przejazd/${ride.id}`);
}

export async function requestSeat(formData: FormData) {
  const userId = await requireUserId();

  const rideId = str(formData.get("rideId"));
  const pickupLabel = str(formData.get("pickupLabel"));
  const pickupLat = num(formData.get("pickupLat"));
  const pickupLng = num(formData.get("pickupLng"));
  const dropoffLabel = str(formData.get("dropoffLabel"));
  const dropoffLat = num(formData.get("dropoffLat"));
  const dropoffLng = num(formData.get("dropoffLng"));
  const seatsRequested = num(formData.get("seatsRequested")) ?? 1;
  const message = str(formData.get("message"));

  if (
    !rideId ||
    !pickupLabel ||
    pickupLat == null ||
    pickupLng == null ||
    !dropoffLabel ||
    dropoffLat == null ||
    dropoffLng == null
  ) {
    throw new Error("Brakuje punktu odbioru lub celu.");
  }

  const ride = await prisma.ride.findUnique({ where: { id: rideId } });
  if (!ride || ride.kind !== "CAR") {
    throw new Error("Przejazd nie istnieje lub nie jest przejazdem autem.");
  }
  if (ride.driverId === userId) {
    throw new Error("Nie mozesz poprosic o miejsce we wlasnym przejezdzie.");
  }

  await prisma.rideRequest.create({
    data: {
      rideId,
      passengerId: userId,
      status: "PENDING",
      pickupLabel,
      pickupLat,
      pickupLng,
      dropoffLabel,
      dropoffLat,
      dropoffLng,
      seatsRequested,
      messages: message
        ? { create: { senderId: userId, body: message } }
        : undefined,
    },
  });

  revalidatePath("/moje-przejazdy");
  redirect("/moje-przejazdy");
}

export async function joinBus(formData: FormData) {
  const userId = await requireUserId();
  const rideId = str(formData.get("rideId"));
  if (!rideId) throw new Error("Brak identyfikatora kursu.");

  const ride = await prisma.ride.findUnique({ where: { id: rideId } });
  if (!ride || ride.kind !== "BUS") {
    throw new Error("Kurs autobusowy nie istnieje.");
  }

  const existing = await prisma.rideRequest.findFirst({
    where: { rideId, passengerId: userId },
  });
  if (existing) {
    redirect("/moje-przejazdy");
  }

  const distanceKm = haversineKm(
    { lat: ride.originLat, lng: ride.originLng },
    { lat: ride.destinationLat, lng: ride.destinationLng },
  );

  await prisma.rideRequest.create({
    data: {
      rideId,
      passengerId: userId,
      // Bus join is auto-accepted (public service, no driver decision).
      status: "ACCEPTED",
      pickupLabel: ride.originLabel,
      pickupLat: ride.originLat,
      pickupLng: ride.originLng,
      dropoffLabel: ride.destinationLabel,
      dropoffLat: ride.destinationLat,
      dropoffLng: ride.destinationLng,
      seatsRequested: 1,
      distanceKm: Math.round(distanceKm * 10) / 10,
      co2SavedKg: roundKg(co2SavedKg("BUS", distanceKm)),
      originZone: ride.originLocality,
      destinationZone: ride.destinationLocality,
    },
  });

  revalidatePath("/moje-przejazdy");
  revalidatePath("/konto");
  redirect("/moje-przejazdy");
}

export async function decideRequest(formData: FormData) {
  const userId = await requireUserId();
  const requestId = str(formData.get("requestId"));
  const decision = str(formData.get("decision"));
  if (!requestId || (decision !== "accept" && decision !== "reject")) {
    throw new Error("Nieprawidlowa decyzja.");
  }

  const request = await prisma.rideRequest.findUnique({
    where: { id: requestId },
    include: { ride: true },
  });
  if (!request) throw new Error("Prosba nie istnieje.");
  if (request.ride.driverId !== userId) {
    throw new Error("Tylko kierowca moze decydowac o tej prosbie.");
  }

  if (decision === "reject") {
    await prisma.rideRequest.update({
      where: { id: requestId },
      data: { status: "REJECTED" },
    });
  } else {
    const distanceKm = haversineKm(
      { lat: request.pickupLat, lng: request.pickupLng },
      { lat: request.dropoffLat, lng: request.dropoffLng },
    );
    await prisma.rideRequest.update({
      where: { id: requestId },
      data: {
        status: "ACCEPTED",
        distanceKm: Math.round(distanceKm * 10) / 10,
        co2SavedKg: roundKg(co2SavedKg("CAR", distanceKm)),
        originZone: request.ride.originLocality,
        destinationZone: request.ride.destinationLocality,
      },
    });
  }

  revalidatePath("/moje-przejazdy");
  revalidatePath("/konto");
}

export async function sendMessage(formData: FormData) {
  const userId = await requireUserId();
  const requestId = str(formData.get("requestId"));
  const body = str(formData.get("body"));
  if (!requestId || !body) throw new Error("Pusta wiadomosc.");

  const request = await prisma.rideRequest.findUnique({
    where: { id: requestId },
    include: { ride: { select: { driverId: true } } },
  });
  if (!request) throw new Error("Prosba nie istnieje.");

  const isParticipant =
    request.passengerId === userId || request.ride.driverId === userId;
  if (!isParticipant) {
    throw new Error("Brak dostepu do tej rozmowy.");
  }

  await prisma.rideRequestMessage.create({
    data: { requestId, senderId: userId, body },
  });

  revalidatePath("/moje-przejazdy");
}
