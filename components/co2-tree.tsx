import { Leaf } from "lucide-react";
import type { TreeLevel } from "@/lib/gamification";
import { cn } from "@/lib/utils";

export function Co2Tree({
  tree,
  co2Kg,
  compact = false,
}: {
  tree: TreeLevel;
  co2Kg: number;
  compact?: boolean;
}) {
  const pct = Math.round(tree.progress * 100);
  return (
    <div
      className={cn(
        "rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100/60 p-5 ring-1 ring-emerald-600/15 dark:from-emerald-950/40 dark:to-emerald-900/20",
      )}
    >
      <div className="flex items-center gap-4">
        <div
          className={cn(
            "grid place-items-center rounded-2xl bg-card shadow-sm ring-1 ring-emerald-600/15",
            compact ? "size-14 text-3xl" : "size-20 text-5xl",
          )}
          aria-hidden
        >
          {tree.emoji}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
            Poziom {tree.level}
          </p>
          <p className="font-heading text-lg font-bold leading-tight">
            {tree.name}
          </p>
          <p className="mt-0.5 inline-flex items-center gap-1 text-sm text-muted-foreground">
            <Leaf className="size-3.5 text-emerald-600" />
            {co2Kg} kg zaoszczędzonego CO2
          </p>
        </div>
      </div>

      <div className="mt-4">
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-card/70">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          {tree.nextThreshold == null
            ? "Maksymalny poziom osiągnięty — brawo!"
            : `Jeszcze ${tree.toNextKg} kg CO2 do następnego poziomu`}
        </p>
      </div>
    </div>
  );
}
