"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { SlidersHorizontal } from "lucide-react";

export function SearchFilters() {
  const router = useRouter();
  const params = useSearchParams();

  const dFrom = Number(params.get("dFrom") ?? "0");
  const dTo = Number(params.get("dTo") ?? "23");
  const pMax = params.get("pMax") ?? "";
  const verified = params.get("verified") === "1";
  const seats = params.get("seats") ?? "1";

  const update = useCallback(
    (patch: Record<string, string | null>) => {
      const next = new URLSearchParams(params.toString());
      for (const [k, v] of Object.entries(patch)) {
        if (v == null || v === "") next.delete(k);
        else next.set(k, v);
      }
      router.push(`/szukaj?${next.toString()}`);
    },
    [params, router],
  );

  return (
    <div className="rounded-2xl bg-card p-5 ring-1 ring-border">
      <h2 className="flex items-center gap-2 font-heading text-base font-bold">
        <SlidersHorizontal className="size-4 text-primary" /> Filtry
      </h2>

      <div className="mt-4 space-y-5 text-sm">
        <div>
          <label className="mb-1.5 block font-medium">Godzina odjazdu</label>
          <div className="flex items-center gap-2">
            <select
              value={dFrom}
              onChange={(e) => update({ dFrom: e.target.value })}
              className="h-9 flex-1 rounded-lg border border-input bg-background px-2"
            >
              {Array.from({ length: 24 }, (_, h) => (
                <option key={h} value={h}>
                  {String(h).padStart(2, "0")}:00
                </option>
              ))}
            </select>
            <span className="text-muted-foreground">–</span>
            <select
              value={dTo}
              onChange={(e) => update({ dTo: e.target.value })}
              className="h-9 flex-1 rounded-lg border border-input bg-background px-2"
            >
              {Array.from({ length: 24 }, (_, h) => (
                <option key={h} value={h}>
                  {String(h).padStart(2, "0")}:59
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block font-medium">
            Cena maks. {pMax ? `(${pMax} zł)` : ""}
          </label>
          <input
            type="range"
            min={0}
            max={50}
            step={1}
            value={pMax === "" ? 50 : Number(pMax)}
            onChange={(e) =>
              update({ pMax: e.target.value === "50" ? null : e.target.value })
            }
            className="w-full accent-[var(--primary)]"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0 zł</span>
            <span>50+ zł</span>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block font-medium">Liczba miejsc</label>
          <div className="flex gap-2">
            {["1", "2", "3", "4"].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => update({ seats: s })}
                className={`h-9 flex-1 rounded-lg text-sm font-medium ring-1 transition-colors ${
                  seats === s
                    ? "bg-primary text-primary-foreground ring-primary"
                    : "bg-background ring-input hover:bg-accent"
                }`}
              >
                {s}
                {s === "4" ? "+" : ""}
              </button>
            ))}
          </div>
        </div>

        <label className="flex cursor-pointer items-center justify-between gap-2">
          <span className="font-medium">Tylko zweryfikowani kierowcy</span>
          <input
            type="checkbox"
            checked={verified}
            onChange={(e) => update({ verified: e.target.checked ? "1" : null })}
            className="size-4 accent-[var(--primary)]"
          />
        </label>
      </div>
    </div>
  );
}
