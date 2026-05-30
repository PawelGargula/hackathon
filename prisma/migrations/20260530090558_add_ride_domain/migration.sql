-- CreateEnum
CREATE TYPE "RideKind" AS ENUM ('CAR', 'BUS');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateTable
CREATE TABLE "rides" (
    "id" TEXT NOT NULL,
    "kind" "RideKind" NOT NULL DEFAULT 'CAR',
    "driver_id" TEXT,
    "origin_label" TEXT NOT NULL,
    "origin_locality" TEXT,
    "origin_lat" DOUBLE PRECISION NOT NULL,
    "origin_lng" DOUBLE PRECISION NOT NULL,
    "origin_place_id" TEXT,
    "destination_label" TEXT NOT NULL,
    "destination_locality" TEXT,
    "destination_lat" DOUBLE PRECISION NOT NULL,
    "destination_lng" DOUBLE PRECISION NOT NULL,
    "destination_place_id" TEXT,
    "departure_at" TIMESTAMP(3) NOT NULL,
    "seats" INTEGER NOT NULL DEFAULT 1,
    "price" DOUBLE PRECISION,
    "description" TEXT,
    "operator" TEXT,
    "line_number" TEXT,
    "ticket_price" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rides_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ride_waypoints" (
    "id" TEXT NOT NULL,
    "ride_id" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "loc_label" TEXT NOT NULL,
    "loc_locality" TEXT,
    "loc_lat" DOUBLE PRECISION NOT NULL,
    "loc_lng" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "ride_waypoints_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ride_requests" (
    "id" TEXT NOT NULL,
    "ride_id" TEXT NOT NULL,
    "passenger_id" TEXT NOT NULL,
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',
    "pickup_label" TEXT NOT NULL,
    "pickup_lat" DOUBLE PRECISION NOT NULL,
    "pickup_lng" DOUBLE PRECISION NOT NULL,
    "dropoff_label" TEXT NOT NULL,
    "dropoff_lat" DOUBLE PRECISION NOT NULL,
    "dropoff_lng" DOUBLE PRECISION NOT NULL,
    "seats_requested" INTEGER NOT NULL DEFAULT 1,
    "distance_km" DOUBLE PRECISION,
    "co2_saved_kg" DOUBLE PRECISION,
    "origin_zone" TEXT,
    "destination_zone" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ride_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ride_request_messages" (
    "id" TEXT NOT NULL,
    "request_id" TEXT NOT NULL,
    "sender_id" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ride_request_messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "rides_kind_departure_at_idx" ON "rides"("kind", "departure_at");

-- CreateIndex
CREATE INDEX "ride_waypoints_ride_id_order_idx" ON "ride_waypoints"("ride_id", "order");

-- CreateIndex
CREATE INDEX "ride_requests_ride_id_idx" ON "ride_requests"("ride_id");

-- CreateIndex
CREATE INDEX "ride_requests_passenger_id_idx" ON "ride_requests"("passenger_id");

-- CreateIndex
CREATE INDEX "ride_request_messages_request_id_created_at_idx" ON "ride_request_messages"("request_id", "created_at");

-- AddForeignKey
ALTER TABLE "rides" ADD CONSTRAINT "rides_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ride_waypoints" ADD CONSTRAINT "ride_waypoints_ride_id_fkey" FOREIGN KEY ("ride_id") REFERENCES "rides"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ride_requests" ADD CONSTRAINT "ride_requests_ride_id_fkey" FOREIGN KEY ("ride_id") REFERENCES "rides"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ride_requests" ADD CONSTRAINT "ride_requests_passenger_id_fkey" FOREIGN KEY ("passenger_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ride_request_messages" ADD CONSTRAINT "ride_request_messages_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "ride_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ride_request_messages" ADD CONSTRAINT "ride_request_messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
