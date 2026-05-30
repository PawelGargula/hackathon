"use client";

import { useEffect, useId, useRef, useState } from "react";
import { MapPin, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type GeoPoint = {
  label: string;
  locality: string | null;
  lat: number;
  lng: number;
  placeId: string | null;
};

type Props = {
  // Prefix for the hidden inputs, e.g. "origin" -> originLabel, originLat...
  // Pass an empty string to skip rendering hidden inputs (controlled mode).
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  defaultValue?: GeoPoint | null;
  onSelect?: (point: GeoPoint | null) => void;
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
};

export function LocationAutocomplete({
  name,
  label,
  placeholder,
  required,
  defaultValue,
  onSelect,
  className,
  labelClassName,
  inputClassName,
}: Props) {
  const id = useId();
  const [text, setText] = useState(defaultValue?.label ?? "");
  const [selected, setSelected] = useState<GeoPoint | null>(
    defaultValue ?? null,
  );
  const [results, setResults] = useState<GeoPoint[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selected && text === selected.label) return;
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      if (text.trim().length < 3) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(
          `/api/geocode?q=${encodeURIComponent(text)}`,
          { signal: controller.signal },
        );
        if (res.ok) {
          const data = (await res.json()) as { results: GeoPoint[] };
          setResults(data.results);
          setOpen(true);
        }
      } catch {
        // ignore aborted / failed requests
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [text, selected]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function choose(point: GeoPoint) {
    setSelected(point);
    setText(point.label);
    setOpen(false);
    onSelect?.(point);
  }

  return (
    <div className={cn("grid gap-1.5", className)} ref={containerRef}>
      {label && <Label htmlFor={id} className={labelClassName}>{label}</Label>}
      <div className="relative">
        <MapPin className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          id={id}
          className={cn("pl-8", inputClassName)}
          autoComplete="off"
          placeholder={placeholder}
          value={text}
          aria-required={required}
          onChange={(e) => {
            setText(e.target.value);
            setSelected(null);
            onSelect?.(null);
          }}
          onFocus={() => results.length > 0 && setOpen(true)}
        />
        {loading && (
          <Loader2 className="absolute right-2.5 top-1/2 size-4 -translate-y-1/2 animate-spin text-muted-foreground" />
        )}
        {open && results.length > 0 && (
          <ul className="absolute z-20 mt-1 w-full overflow-hidden rounded-lg border border-border bg-popover text-popover-foreground shadow-md">
            {results.map((r, i) => (
              <li key={`${r.placeId ?? r.label}-${i}`}>
                <button
                  type="button"
                  className="flex w-full items-start gap-2 px-3 py-2 text-left text-sm hover:bg-muted"
                  onClick={() => choose(r)}
                >
                  <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  <span className="line-clamp-2">{r.label}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {name && (
        <>
          <input
            type="hidden"
            name={`${name}Label`}
            value={selected?.label ?? ""}
          />
          <input
            type="hidden"
            name={`${name}Locality`}
            value={selected?.locality ?? ""}
          />
          <input type="hidden" name={`${name}Lat`} value={selected?.lat ?? ""} />
          <input type="hidden" name={`${name}Lng`} value={selected?.lng ?? ""} />
          <input
            type="hidden"
            name={`${name}PlaceId`}
            value={selected?.placeId ?? ""}
          />
        </>
      )}
    </div>
  );
}
