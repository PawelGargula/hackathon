"use client";

import { useState, useTransition } from "react";
import { Plus, X } from "lucide-react";
import {
  LocationAutocomplete,
  type GeoPoint,
} from "@/components/location-autocomplete";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createRide } from "@/app/actions";

type Waypoint = { key: number; point: GeoPoint | null };

export function AddRideForm() {
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
  const [originPoint, setOriginPoint] = useState<GeoPoint | null>(null);
  const [destPoint, setDestPoint] = useState<GeoPoint | null>(null);
  const [originError, setOriginError] = useState("");
  const [destError, setDestError] = useState("");
  const [isPending, startTransition] = useTransition();

  const serialized = JSON.stringify(
    waypoints
      .map((w) => w.point)
      .filter((p): p is GeoPoint => p != null)
      .map((p) => ({
        label: p.label,
        locality: p.locality,
        lat: p.lat,
        lng: p.lng,
      })),
  );

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    let valid = true;
    if (!originPoint) {
      setOriginError("Wybierz lokalizację z listy podpowiedzi");
      valid = false;
    }
    if (!destPoint) {
      setDestError("Wybierz lokalizację z listy podpowiedzi");
      valid = false;
    }
    if (!valid) return;
    const formData = new FormData(e.currentTarget);
    startTransition(() => {
      createRide(formData);
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-5 rounded-2xl bg-card p-5 ring-1 ring-border"
    >
      <div className="grid gap-1">
        <LocationAutocomplete
          name="origin"
          label="Skąd jedziesz"
          placeholder="np. Nowy Sącz, Rynek"
          onSelect={(point) => {
            setOriginPoint(point);
            if (point) setOriginError("");
          }}
        />
        {originError && (
          <p className="text-xs text-destructive">{originError}</p>
        )}
      </div>
      <div className="grid gap-1">
        <LocationAutocomplete
          name="destination"
          label="Dokąd jedziesz"
          placeholder="np. Krynica-Zdrój"
          onSelect={(point) => {
            setDestPoint(point);
            if (point) setDestError("");
          }}
        />
        {destError && (
          <p className="text-xs text-destructive">{destError}</p>
        )}
      </div>

      <div className="grid gap-2">
        <div className="flex items-center justify-between">
          <Label>Punkty po drodze (opcjonalnie)</Label>
          <Button
            type="button"
            variant="outline"
            size="xs"
            onClick={() =>
              setWaypoints((prev) => [
                ...prev,
                { key: Date.now(), point: null },
              ])
            }
          >
            <Plus /> Dodaj punkt
          </Button>
        </div>
        {waypoints.map((w) => (
          <div key={w.key} className="flex items-end gap-2">
            <div className="flex-1">
              <LocationAutocomplete
                name=""
                label=""
                placeholder="Miejscowość lub punkt po drodze"
                onSelect={(point) =>
                  setWaypoints((prev) =>
                    prev.map((x) => (x.key === w.key ? { ...x, point } : x)),
                  )
                }
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Usuń punkt"
              onClick={() =>
                setWaypoints((prev) => prev.filter((x) => x.key !== w.key))
              }
            >
              <X />
            </Button>
          </div>
        ))}
      </div>
      <input type="hidden" name="waypoints" value={serialized} />

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="grid gap-1.5">
          <Label htmlFor="departureAt">Data i godzina</Label>
          <Input
            id="departureAt"
            name="departureAt"
            type="datetime-local"
            required
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="seats">Wolne miejsca</Label>
          <Input
            id="seats"
            name="seats"
            type="number"
            min={1}
            max={8}
            defaultValue="3"
            required
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="price">Cena (PLN)</Label>
          <Input
            id="price"
            name="price"
            type="number"
            min={0}
            step="0.5"
            placeholder="bezpłatnie"
          />
        </div>
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="description">Opis (opcjonalnie)</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="np. punkt odbioru pod przychodnią, miejsce na bagaż, elastyczna godzina."
        />
      </div>

      <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={isPending}>
        {isPending ? "Publikowanie…" : "Opublikuj przejazd"}
      </Button>
    </form>
  );
}
