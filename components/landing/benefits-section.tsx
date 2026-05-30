import { Wallet, Search, Leaf, MapPin, Bus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const benefits = [
  {
    icon: Wallet,
    title: "Płać mniej za dojazdy",
    description: "Dzielisz koszt przejazdu z innymi osobami, więc codzienne trasy stają się tańsze dla kierowcy i pasażerów.",
  },
  {
    icon: Search,
    title: "Znajduj przejazdy szybciej",
    description: "Nie musisz szukać transportu w wielu miejscach. W aplikacji widzisz dostępne trasy, godziny i wolne miejsca.",
  },
  {
    icon: Bus,
    title: "Integracja z MPK Nowy Sącz",
    description: "Wyszukuj przejazdy sąsiedzkie i oficjalne kursy autobusowe MPK na jednej, wspólnej liście wyników.",
  },
  {
    icon: Leaf,
    title: "Ograniczaj emisję CO₂",
    description: "Jedno auto z kilkoma osobami lub wybór autobusu to mniej samotnych przejazdów i mniejszy ruch na drogach.",
  },
];

export function BenefitsSection() {
  return (
    <section className="mt-24 sm:mt-32">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="font-heading text-3xl font-bold sm:text-4xl">Dlaczego warto jechać razem?</h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Wspólne przejazdy to prosty sposób, żeby codzienne dojazdy były tańsze, wygodniejsze i bardziej przyjazne dla środowiska.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {benefits.map((benefit, index) => (
          <Card key={index} className="border-none shadow-sm ring-1 ring-border/50 bg-card hover:shadow-md transition-all">
            <CardHeader>
              <div className="mb-4 inline-flex size-12 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
                <benefit.icon className="size-6 text-emerald-600 dark:text-emerald-500" />
              </div>
              <CardTitle className="text-xl">{benefit.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">{benefit.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
