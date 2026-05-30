"use client";

import L from "leaflet";
import { MapContainer, Marker, Polyline, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export type MapPoint = {
  lat: number;
  lng: number;
  label: string;
  role?: "start" | "end" | "stop";
};

export type MapSegment = {
  points: MapPoint[];
  label?: string;
};

function pin(color: string, size = 26) {
  return L.divIcon({
    className: "",
    html: `<span style="display:block;width:${size}px;height:${size}px;border-radius:9999px;background:${color};box-shadow:0 1px 4px rgba(0,0,0,.35);border:2px solid #fff"></span>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

const ICONS = {
  start: pin("#10b981"),
  end: pin("#047857"),
  stop: pin("#34d399", 18),
};

export default function RouteMapInner({
  points,
  segments,
}: {
  points?: MapPoint[];
  segments?: MapSegment[];
}) {
  const routes: MapSegment[] = segments?.length
    ? segments
    : points
      ? [{ points }]
      : [];

  const allPositions: [number, number][] = [];
  for (const r of routes) {
    for (const p of r.points) {
      if (Number.isFinite(p.lat) && Number.isFinite(p.lng)) {
        allPositions.push([p.lat, p.lng]);
      }
    }
  }

  if (allPositions.length === 0) {
    return (
      <div className="grid h-full place-items-center bg-muted text-sm text-muted-foreground">
        Brak danych mapy
      </div>
    );
  }

  const bounds = L.latLngBounds(allPositions);

  return (
    <MapContainer
      bounds={allPositions.length > 1 ? bounds : undefined}
      center={allPositions.length === 1 ? allPositions[0] : undefined}
      zoom={allPositions.length === 1 ? 12 : undefined}
      boundsOptions={{ padding: [28, 28] }}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {routes.map((route, ri) => {
        const valid = route.points.filter(
          (p) => Number.isFinite(p.lat) && Number.isFinite(p.lng),
        );
        const positions = valid.map((p) => [p.lat, p.lng] as [number, number]);
        return (
          <span key={ri}>
            {positions.length > 1 && (
              <Polyline
                positions={positions}
                pathOptions={{ color: "#059669", weight: 4, opacity: 0.8 }}
              />
            )}
            {valid.map((p, i) => {
              const role =
                p.role ??
                (i === 0
                  ? "start"
                  : i === valid.length - 1
                    ? "end"
                    : "stop");
              return (
                <Marker
                  key={`${ri}-${p.lat}-${p.lng}-${i}`}
                  position={[p.lat, p.lng]}
                  icon={ICONS[role]}
                >
                  <Popup>{p.label}</Popup>
                </Marker>
              );
            })}
          </span>
        );
      })}
    </MapContainer>
  );
}
