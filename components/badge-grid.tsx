import type { Achievement, BadgeIconKey } from "@/lib/gamification";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Lock } from "lucide-react";

const BADGE_IMAGES: Record<BadgeIconKey, string> = {
  first: "/assets/badge1.png",
  rides: "/assets/badge2.png",
  co2: "/assets/badge6.png",
  km: "/assets/badge4.png",
  trophy: "/assets/badge3.png",
  leaf: "/assets/badge5.png",
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
        const imageSrc = BADGE_IMAGES[a.icon];
        const pct = Math.min(100, Math.round((a.current / a.target) * 100));
        return (
          <div
            key={a.id}
            className={cn(
              "relative flex flex-col items-center gap-2 rounded-2xl p-4 text-center ring-1 transition-all duration-300 overflow-hidden",
              a.unlocked
                ? a.isRecent
                  ? "bg-emerald-50/50 dark:bg-emerald-950/20 ring-emerald-500/50 shadow-sm hover:scale-[1.03]"
                  : "bg-card ring-emerald-600/20 hover:shadow-md hover:scale-[1.03]"
                : "bg-muted/40 ring-border",
            )}
            title={a.description}
          >
            {a.isRecent && (
              <div className="absolute top-0 inset-x-0 h-1 bg-emerald-500" />
            )}
            <div className="relative size-16 flex items-center justify-center">
              {imageSrc ? (
                <Image
                  src={imageSrc}
                  alt={a.label}
                  fill
                  sizes="64px"
                  className={cn(
                    "object-contain transition-all duration-300",
                    !a.unlocked && "grayscale contrast-50 opacity-40",
                    a.isRecent && "drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]"
                  )}
                />
              ) : (
                <span className="grid size-12 place-items-center rounded-full bg-muted text-muted-foreground">
                  <Lock className="size-6" />
                </span>
              )}
              {!a.unlocked && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="bg-zinc-950/80 text-white rounded-full p-1.5 shadow-sm">
                    <Lock className="size-4" />
                  </span>
                </div>
              )}
            </div>
            <span
              className={cn(
                "text-xs font-bold leading-tight mt-1",
                !a.unlocked && "text-muted-foreground",
                a.isRecent && "text-emerald-700 dark:text-emerald-400"
              )}
            >
              {a.label}
            </span>
            
            <div className="w-full mt-auto pt-1">
              {a.unlocked ? (
                <span className={cn(
                  "text-[11px] font-medium",
                  a.isRecent ? "text-emerald-600 dark:text-emerald-500" : "text-emerald-600/80 dark:text-emerald-500/80"
                )}>
                  {a.isRecent ? "Nowość!" : "Odblokowana"}
                </span>
              ) : (
                <div className="flex flex-col gap-1.5 w-full">
                  <div className="flex justify-between text-[10px] font-medium text-muted-foreground">
                    <span>{a.current}</span>
                    <span>{a.target}</span>
                  </div>
                  <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-500" 
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-medium text-muted-foreground">
                    {pct}%
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
