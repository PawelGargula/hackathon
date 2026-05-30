"use client";

import { Search, User } from "lucide-react";
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
      className="flex min-w-0 flex-col gap-3 rounded-2xl bg-card p-3 shadow-md ring-1 ring-border/50 xl:flex-row xl:items-center xl:rounded-full xl:p-2 xl:pl-6"
    >
      <div className="relative z-30 min-w-0 flex-1">
        <LocationAutocomplete
          name="origin"
          label="Skąd"
          placeholder="Skąd? (np. Nowy Sącz)"
          required
          defaultValue={defaults?.origin}
          labelClassName="xl:sr-only"
          inputClassName="xl:border-none xl:bg-transparent xl:shadow-none xl:ring-0"
        />
      </div>
      <div className="relative z-20 hidden h-8 w-px bg-border xl:block" />
      <div className="relative z-20 min-w-0 flex-1">
        <LocationAutocomplete
          name="destination"
          label="Dokąd"
          placeholder="Dokąd? (np. Stary Sącz)"
          required
          defaultValue={defaults?.destination}
          labelClassName="xl:sr-only"
          inputClassName="xl:border-none xl:bg-transparent xl:shadow-none xl:ring-0"
        />
      </div>
      <div className="relative z-10 hidden h-8 w-px bg-border xl:block" />
      <div className="relative z-10 grid min-w-0 flex-1 gap-1.5 xl:gap-0">
        <Label htmlFor="when" className="xl:sr-only">Kiedy</Label>
        <Input
          id="when"
          name="when"
          type="datetime-local"
          defaultValue={defaults?.when}
          required
          className="xl:border-none xl:bg-transparent xl:shadow-none xl:ring-0"
        />
      </div>
      <div className="relative z-0 hidden h-8 w-px bg-border xl:block" />
      <div className="relative z-0 flex min-w-0 gap-3 xl:w-auto">
        <div className="grid w-24 gap-1.5 xl:gap-0">
          <Label htmlFor="seats" className="xl:sr-only">Miejsca</Label>
          <div className="relative flex items-center">
            <User className="absolute left-3 size-4 text-muted-foreground xl:left-2" />
            <Input
              id="seats"
              name="seats"
              type="number"
              min={1}
              max={8}
              defaultValue={defaults?.seats ?? "1"}
              className="pl-9 xl:border-none xl:bg-transparent xl:shadow-none xl:ring-0 xl:pl-8"
              title="Liczba miejsc"
            />
          </div>
        </div>
      </div>
      <Button type="submit" size="lg" className="w-full xl:w-auto xl:rounded-full">
        <Search className="size-4" /> Szukaj
      </Button>
    </form>
  );
}
