"use client";

import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import type { MapPoint, MapSegment } from "@/components/route-map-inner";

const RouteMapInner = dynamic(() => import("@/components/route-map-inner"), {
  ssr: false,
  loading: () => (
    <div className="grid h-full animate-pulse place-items-center bg-muted text-sm text-muted-foreground">
      Ładowanie mapy…
    </div>
  ),
});

export type { MapPoint, MapSegment };

export function RouteMap({
  points,
  segments,
  className,
}: {
  points?: MapPoint[];
  segments?: MapSegment[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl ring-1 ring-border [&_.leaflet-container]:z-0",
        className,
      )}
    >
      <RouteMapInner points={points} segments={segments} />
    </div>
  );
}
