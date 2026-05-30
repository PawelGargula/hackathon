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
              "flex flex-col items-center gap-2 rounded-2xl p-4 text-center ring-1 transition-all duration-300",
              a.unlocked
                ? "bg-card ring-emerald-600/20 hover:shadow-md hover:scale-[1.03]"
                : "bg-muted/40 ring-border",
            )}
            title={a.description}
          >
            <div className="relative size-16 flex items-center justify-center">
              {imageSrc ? (
                <Image
                  src={imageSrc}
                  alt={a.label}
                  width={64}
                  height={64}
                  className={cn(
                    "object-contain transition-all duration-300",
                    !a.unlocked && "grayscale contrast-50 opacity-40"
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
                !a.unlocked && "text-muted-foreground"
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
