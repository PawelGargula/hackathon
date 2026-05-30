import { Badge } from "@/components/ui/badge";

const config: Record<
  string,
  { label: string; variant: "warning" | "success" | "destructive" }
> = {
  PENDING: { label: "oczekuje", variant: "warning" },
  ACCEPTED: { label: "zaakceptowane", variant: "success" },
  REJECTED: { label: "odrzucone", variant: "destructive" },
};

export function RequestStatusBadge({ status }: { status: string }) {
  const c = config[status] ?? config.PENDING;
  return <Badge variant={c.variant}>{c.label}</Badge>;
}
