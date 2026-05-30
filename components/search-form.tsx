"use client";

import { Search } from "lucide-react";
import {
  LocationAutocomplete,
  type GeoPoint,
} from "@/components/location-autocomplete";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  defaults?: {
    origin?: GeoPoint | null;
    destination?: GeoPoint | null;
    when?: string;
    seats?: string;
    flex?: string;
  };
};

export function SearchForm({ defaults }: Props) {
  return (
    <form
      method="get"
      action="/szukaj"
      className="grid gap-4 rounded-xl bg-card p-5 ring-1 ring-foreground/10 sm:grid-cols-2"
    >
      <LocationAutocomplete
        name="origin"
        label="Skad"
        placeholder="np. Nowy Sacz, Rynek"
        required
        defaultValue={defaults?.origin}
      />
      <LocationAutocomplete
        name="destination"
        label="Dokad"
        placeholder="np. Stary Sacz, Rynek"
        required
        defaultValue={defaults?.destination}
      />
      <div className="grid gap-1.5">
        <Label htmlFor="when">Kiedy</Label>
        <Input
          id="when"
          name="when"
          type="datetime-local"
          defaultValue={defaults?.when}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="grid gap-1.5">
          <Label htmlFor="seats">Miejsca</Label>
          <Input
            id="seats"
            name="seats"
            type="number"
            min={1}
            max={8}
            defaultValue={defaults?.seats ?? "1"}
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="flex">Elastycznosc (h)</Label>
          <Input
            id="flex"
            name="flex"
            type="number"
            min={0}
            max={12}
            step={1}
            placeholder="dowolnie"
            defaultValue={defaults?.flex}
          />
        </div>
      </div>
      <div className="sm:col-span-2">
        <Button type="submit" size="lg" className="w-full sm:w-auto">
          <Search /> Szukaj przejazdow
        </Button>
      </div>
    </form>
  );
}
