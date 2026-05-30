import { Leaf, TrendingUp, Route, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const stats = [
  {
    icon: Leaf,
    value: "18.4 kg",
    label: "CO₂ mniej",
    accent: true,
  },
  {
    icon: TrendingUp,
    value: "124 km",
    label: "w tym miesiącu",
  },
  {
    icon: Route,
    value: "842 km",
    label: "w tym roku",
  },
  {
    icon: Users,
    value: "12",
    label: "unikniętych przejazdów solo",
  },
];

export function StatsSection() {
  return (
    <section className="mt-24 sm:mt-32">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="font-heading text-3xl font-bold sm:text-4xl">Twój wpływ w liczbach</h2>
        <p className="mt-4 text-lg text-muted-foreground">
          W aplikacji widzisz, ile kilometrów przejechałeś wspólnie, ile CO₂ udało Ci się zaoszczędzić i ile samotnych przejazdów mogło zniknąć z dróg.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card 
            key={index} 
            className={`border-none shadow-sm ring-1 transition-all hover:shadow-md ${
              stat.accent 
                ? "bg-emerald-50/50 ring-emerald-100 dark:bg-emerald-950/20 dark:ring-emerald-900/30" 
                : "bg-card ring-border/50"
            }`}
          >
            <CardContent className="p-6 flex flex-col items-center text-center gap-4">
              <stat.icon className={`size-8 ${stat.accent ? "text-emerald-600" : "text-emerald-600/70"}`} />
              <div>
                <p className="font-heading text-3xl font-bold">{stat.value}</p>
                <p className="text-sm font-medium text-muted-foreground mt-1">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <p className="text-center text-sm text-muted-foreground mt-8 italic">
        Małe codzienne wybory tworzą dużą lokalną zmianę.
      </p>
    </section>
  );
}
