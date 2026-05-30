// Gamification helpers: CO2 "tree" levels and achievement badges derived
// purely from the user's accumulated impact (no extra DB models needed).

export type TreeLevel = {
  level: number;
  name: string;
  emoji: string;
  // CO2 (kg) needed to reach this level.
  threshold: number;
  // Threshold of the next level, or null when maxed out.
  nextThreshold: number | null;
  // Progress within the current level, 0..1.
  progress: number;
  // CO2 still needed to reach the next level (0 when maxed out).
  toNextKg: number;
};

const TREE_LEVELS: { name: string; emoji: string; threshold: number }[] = [
  { name: "Nasionko", emoji: "🌰", threshold: 0 },
  { name: "Kiełek", emoji: "🌱", threshold: 5 },
  { name: "Sadzonka", emoji: "🪴", threshold: 15 },
  { name: "Młode drzewko", emoji: "🌿", threshold: 30 },
  { name: "Dorodne drzewo", emoji: "🌳", threshold: 60 },
  { name: "Stary dąb", emoji: "🌲", threshold: 120 },
];

export function getTreeLevel(co2Kg: number): TreeLevel {
  let idx = 0;
  for (let i = 0; i < TREE_LEVELS.length; i++) {
    if (co2Kg >= TREE_LEVELS[i].threshold) idx = i;
  }
  const current = TREE_LEVELS[idx];
  const next = TREE_LEVELS[idx + 1] ?? null;

  let progress = 1;
  let toNextKg = 0;
  if (next) {
    const span = next.threshold - current.threshold;
    progress = span > 0 ? Math.min(1, (co2Kg - current.threshold) / span) : 1;
    toNextKg = Math.max(0, next.threshold - co2Kg);
  }

  return {
    level: idx + 1,
    name: current.name,
    emoji: current.emoji,
    threshold: current.threshold,
    nextThreshold: next?.threshold ?? null,
    progress,
    toNextKg: Math.round(toNextKg * 10) / 10,
  };
}

export type BadgeIconKey =
  | "first"
  | "rides"
  | "km"
  | "co2"
  | "leaf"
  | "trophy";

export type Achievement = {
  id: string;
  label: string;
  description: string;
  icon: BadgeIconKey;
  unlocked: boolean;
  current: number;
  target: number;
};

export type ImpactTotals = {
  co2Kg: number;
  km: number;
  rides: number;
};

export function getAchievements(totals: ImpactTotals): Achievement[] {
  const def: Omit<Achievement, "unlocked">[] = [
    {
      id: "first-ride",
      label: "Pierwszy przejazd",
      description: "Pierwszy wspólny przejazd za Tobą",
      icon: "first",
      current: totals.rides,
      target: 1,
    },
    {
      id: "10-rides",
      label: "10 przejazdów",
      description: "10 wspólnych przejazdów",
      icon: "rides",
      current: totals.rides,
      target: 10,
    },
    {
      id: "co2-10",
      label: "10 kg CO2 mniej",
      description: "Zaoszczędzone 10 kg CO2",
      icon: "co2",
      current: totals.co2Kg,
      target: 10,
    },
    {
      id: "km-100",
      label: "100 km razem",
      description: "100 wspólnie pokonanych km",
      icon: "km",
      current: totals.km,
      target: 100,
    },
    {
      id: "50-rides",
      label: "50 przejazdów",
      description: "50 wspólnych przejazdów",
      icon: "trophy",
      current: totals.rides,
      target: 50,
    },
    {
      id: "km-500",
      label: "500 km razem",
      description: "500 wspólnie pokonanych km",
      icon: "leaf",
      current: totals.km,
      target: 500,
    },
  ];

  return def.map((b) => ({
    ...b,
    unlocked: b.current >= b.target,
  }));
}
