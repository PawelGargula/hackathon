import { Co2Tree } from "@/components/co2-tree";
import { Card, CardContent } from "@/components/ui/card";
import { getTreeLevel } from "@/lib/gamification";

const levels = [
  { name: "Nasionko", desc: "Zaczynasz swoją przygodę ze wspólnymi przejazdami." },
  { name: "Kiełek", desc: "Masz już pierwsze oszczędności CO₂." },
  { name: "Sadzonka", desc: "Regularne przejazdy zaczynają dawać widoczny efekt." },
  { name: "Młode drzewko", desc: "Twoje codzienne wybory realnie pomagają ograniczać liczbę aut na drogach." },
  { name: "Dorodne drzewo", desc: "Jesteś przykładem dla innych użytkowników i aktywnie wspierasz lokalną zmianę." },
  { name: "Stary dąb", desc: "Prawdziwy eko bohater! Twój wkład w ochronę środowiska jest ogromny." },
];

export function Co2TreeSection() {
  const currentCo2 = 18.4;
  const mockTree = getTreeLevel(currentCo2);

  return (
    <section className="mt-24 sm:mt-32">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <div className="space-y-6">
          <h2 className="font-heading text-3xl font-bold sm:text-4xl">
            Twoje drzewko rośnie z każdym wspólnym przejazdem
          </h2>
          <div className="space-y-4 text-lg text-muted-foreground">
            <p>
              Każdy wspólny przejazd pomaga ograniczyć emisję CO₂. W aplikacji widzisz, ile udało Ci się zaoszczędzić i jak rozwija się Twoje eko drzewko.
            </p>
            <p>
              Im częściej korzystasz ze wspólnych przejazdów, tym szybciej przechodzisz na kolejne poziomy — od nasionka aż po eko bohatera.
            </p>
          </div>

          <div className="mt-8 space-y-4">
            {levels.map((level, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400 font-bold text-sm">
                  {i + 1}
                </div>
                <div>
                  <h4 className="font-bold">{level.name}</h4>
                  <p className="text-sm text-muted-foreground">{level.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-emerald-100 dark:bg-emerald-900/20 blur-3xl rounded-full opacity-50" />
          <Card className="relative border-none shadow-xl bg-card">
            <CardContent className="p-8">
              <Co2Tree tree={mockTree} co2Kg={currentCo2} />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
