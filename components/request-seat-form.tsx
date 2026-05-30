"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import {
  LocationAutocomplete,
  type GeoPoint,
} from "@/components/location-autocomplete";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { requestSeat } from "@/app/actions";

export function RequestSeatForm({
  rideId,
  defaultPickup,
  defaultDropoff,
  maxSeats,
}: {
  rideId: string;
  defaultPickup: GeoPoint;
  defaultDropoff: GeoPoint;
  maxSeats: number;
}) {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <Button size="lg" onClick={() => setOpen(true)}>
        Popros o miejsce
      </Button>
    );
  }

  return (
    <form
      action={requestSeat}
      className="grid gap-4 rounded-xl bg-card p-5 ring-1 ring-foreground/10"
    >
      <input type="hidden" name="rideId" value={rideId} />
      <p className="text-sm font-medium">Potwierdz szczegoly prosby</p>
      <LocationAutocomplete
        name="pickup"
        label="Punkt odbioru"
        required
        defaultValue={defaultPickup}
      />
      <LocationAutocomplete
        name="dropoff"
        label="Punkt docelowy"
        required
        defaultValue={defaultDropoff}
      />
      <div className="grid w-32 gap-1.5">
        <Label htmlFor="seatsRequested">Liczba miejsc</Label>
        <Input
          id="seatsRequested"
          name="seatsRequested"
          type="number"
          min={1}
          max={Math.max(1, maxSeats)}
          defaultValue="1"
        />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="message">Wiadomosc do kierowcy</Label>
        <Textarea
          id="message"
          name="message"
          placeholder="np. Moge dojsc do rynku, jadę z malym bagazem."
        />
      </div>
      <div className="flex gap-2">
        <Button type="submit">
          <Send /> Wyslij prosbe
        </Button>
        <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
          Anuluj
        </Button>
      </div>
    </form>
  );
}
