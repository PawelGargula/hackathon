import { Lightbulb } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const facts = [
  "Jedno auto z 3 osobami może zastąpić nawet 3 osobne samochody na tej samej trasie.",
  "Wspólny przejazd na trasie 30 km może oszczędzić około 3.6 kg CO₂ na osobę.",
  "Mniej samochodów na lokalnych drogach to mniej korków, hałasu i spalin.",
];

export function EducationSection() {
  return (
    <section className="mt-24 sm:mt-32 rounded-[2rem] bg-emerald-50 px-6 py-16 dark:bg-emerald-950/20 sm:px-10 sm:py-20">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <div className="space-y-6">
          <div className="inline-flex size-12 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
            <Lightbulb className="size-6 text-emerald-600 dark:text-emerald-500" />
          </div>
          <h2 className="font-heading text-3xl font-bold sm:text-4xl">Ucz się, jak podróżować mądrzej</h2>
          <p className="text-lg text-muted-foreground">
            Razem w drogę nie tylko pomaga znaleźć przejazd. Aplikacja pokazuje też, jak wspólne podróże wpływają na środowisko, koszty i lokalny ruch drogowy.
          </p>
          <p className="text-lg text-muted-foreground">
            Po przejazdach możesz odkrywać krótkie ciekawostki, quizy i porady, które pomagają lepiej rozumieć wpływ codziennych decyzji.
          </p>
        </div>

        <div className="space-y-4">
          {facts.map((fact, index) => (
            <Card key={index} className="border-none shadow-sm ring-1 ring-border/50 bg-white dark:bg-zinc-900 hover:shadow-md transition-all">
              <CardContent className="p-6 flex gap-4 items-start">
                <div className="text-emerald-500 font-serif text-4xl leading-none">"</div>
                <p className="text-lg font-medium pt-2">{fact}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
