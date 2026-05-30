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
      className="flex flex-col gap-3 rounded-2xl bg-card p-3 shadow-md ring-1 ring-border/50 lg:flex-row lg:items-center lg:rounded-full lg:p-2 lg:pl-6"
    >
      <div className="relative z-50 flex-1">
        <LocationAutocomplete
          name="origin"
          label="Skąd"
          placeholder="Skąd? (np. Nowy Sącz)"
          required
          defaultValue={defaults?.origin}
          labelClassName="lg:sr-only"
          inputClassName="lg:border-none lg:bg-transparent lg:shadow-none lg:ring-0"
        />
      </div>
      <div className="hidden h-8 w-px bg-border lg:block relative z-40" />
      <div className="relative z-40 flex-1">
        <LocationAutocomplete
          name="destination"
          label="Dokąd"
          placeholder="Dokąd? (np. Stary Sącz)"
          required
          defaultValue={defaults?.destination}
          labelClassName="lg:sr-only"
          inputClassName="lg:border-none lg:bg-transparent lg:shadow-none lg:ring-0"
        />
      </div>
      <div className="hidden h-8 w-px bg-border lg:block relative z-30" />
      <div className="relative z-30 flex-1 grid gap-1.5 lg:gap-0">
        <Label htmlFor="when" className="lg:sr-only">Kiedy</Label>
        <Input
          id="when"
          name="when"
          type="datetime-local"
          defaultValue={defaults?.when}
          required
          className="lg:border-none lg:bg-transparent lg:shadow-none lg:ring-0"
        />
      </div>
      <div className="hidden h-8 w-px bg-border lg:block relative z-20" />
      <div className="relative z-20 flex gap-3 lg:w-auto">
        <div className="w-20 grid gap-1.5 lg:gap-0">
          <Label htmlFor="seats" className="lg:sr-only">Miejsca</Label>
          <Input
            id="seats"
            name="seats"
            type="number"
            min={1}
            max={8}
            defaultValue={defaults?.seats ?? "1"}
            className="lg:border-none lg:bg-transparent lg:shadow-none lg:ring-0"
            title="Liczba miejsc"
          />
        </div>
      </div>
      <Button type="submit" size="lg" className="w-full lg:w-auto lg:rounded-full">
        <Search className="size-4" /> Szukaj
      </Button>
    </form>
  );
}
