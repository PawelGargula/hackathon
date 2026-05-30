import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

const badges = [
  {
    image: "/assets/badge1.png",
    title: "Pierwszy przejazd",
    description: "Twój pierwszy wspólny przejazd za Tobą. Od tego zaczyna się dobra zmiana.",
  },
  {
    image: "/assets/badge4.png",
    title: "100 km razem",
    description: "Przejechałeś pierwsze 100 km we wspólnych trasach.",
  },
  {
    image: "/assets/badge6.png",
    title: "10 kg CO₂ mniej",
    description: "Dzięki wspólnym przejazdom udało Ci się ograniczyć emisję CO₂.",
  },
  {
    image: "/assets/badge2.png",
    title: "10 przejazdów",
    description: "Regularnie wybierasz wspólne podróżowanie.",
  },
  {
    image: "/assets/badge7.png",
    title: "Gwiazdkowy kierowca",
    description: "Pasażerowie wysoko oceniają Twoje przejazdy.",
  },
  {
    image: "/assets/badge8.png",
    title: "Kompletna załoga",
    description: "Udało Ci się zapełnić wszystkie dostępne miejsca w aucie.",
  },
];

export function BadgesSection() {
  return (
    <section className="mt-24 sm:mt-32">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="font-heading text-3xl font-bold sm:text-4xl">Zbieraj odznaki za wspólne przejazdy</h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Zdobywaj odznaki za pierwszą rezerwację, przejechane kilometry, oszczędzone CO₂, regularność i aktywność w społeczności. Odznaki pokazują, jaki poziom osiągnąłeś i motywują do kolejnych wspólnych tras.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {badges.map((badge, index) => (
          <Card key={index} className="border-none shadow-sm ring-1 ring-border/50 bg-card hover:shadow-md hover:scale-[1.02] transition-all duration-300">
            <CardContent className="p-6 flex flex-col items-center text-center gap-4">
              <div className="relative size-24 flex items-center justify-center">
                <Image 
                  src={badge.image} 
                  alt={badge.title} 
                  width={96} 
                  height={96}
                  className="object-contain"
                />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">{badge.title}</h3>
                <p className="text-sm text-muted-foreground">{badge.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
