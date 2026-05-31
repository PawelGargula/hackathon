import { Bus, Car } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function RideTypeBadge({ kind }: { kind: "CAR" | "BUS" }) {
  if (kind === "BUS") {
    return (
      <Badge variant="success">
        <Bus /> autobus
      </Badge>
    );
  }
  return (
    <Badge variant="secondary">
      <Car /> auto
    </Badge>
  );
}
