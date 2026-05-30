import {
  Award,
  Leaf,
  Lock,
  Route,
  Sparkles,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import type { Achievement, BadgeIconKey } from "@/lib/gamification";
import { cn } from "@/lib/utils";

const ICONS: Record<BadgeIconKey, LucideIcon> = {
  first: Sparkles,
  rides: Route,
  km: Route,
  co2: Leaf,
  leaf: Leaf,
  trophy: Trophy,
};

export function BadgeGrid({
  achievements,
  columns = 4,
}: {
  achievements: Achievement[];
  columns?: 3 | 4;
}) {
  return (
    <div
      className={cn(
        "grid gap-3",
        columns === 4 ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-3",
      )}
    >
      {achievements.map((a) => {
        const Icon = a.unlocked ? (ICONS[a.icon] ?? Award) : Lock;
        const pct = Math.min(100, Math.round((a.current / a.target) * 100));
        return (
          <div
            key={a.id}
            className={cn(
              "flex flex-col items-center gap-2 rounded-2xl p-3 text-center ring-1 transition-colors",
              a.unlocked
                ? "bg-card ring-emerald-600/20"
                : "bg-muted/40 ring-border",
            )}
            title={a.description}
          >
            <span
              className={cn(
                "grid size-12 place-items-center rounded-full",
                a.unlocked
                  ? "bg-emerald-600/15 text-emerald-600"
                  : "bg-muted text-muted-foreground",
              )}
            >
              <Icon className="size-6" />
            </span>
            <span
              className={cn(
                "text-xs font-semibold leading-tight",
                !a.unlocked && "text-muted-foreground",
              )}
            >
              {a.label}
            </span>
            <span className="text-[11px] font-medium text-muted-foreground">
              {a.unlocked ? "Odblokowana" : `Postęp: ${pct}%`}
            </span>
          </div>
        );
      })}
    </div>
  );
}
