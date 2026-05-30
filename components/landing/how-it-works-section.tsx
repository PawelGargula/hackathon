import { Search, ListChecks, CheckCircle2 } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Wpisz trasę",
    description: "Podaj, skąd i dokąd chcesz jechać. Możesz wybrać popularną lokalną trasę albo wpisać własną.",
  },
  {
    icon: ListChecks,
    title: "Wybierz przejazd lub autobus",
    description: "Porównaj godziny wyjazdu, ceny, liczbę wolnych miejsc oraz oceny kierowców. Na tej samej liście zobaczysz też pasujące kursy MPK Nowy Sącz!",
  },
  {
    icon: CheckCircle2,
    title: "Zarezerwuj i jedź",
    description: "Potwierdź rezerwację w aplikacji i jedź razem. Po przejeździe Twoje statystyki i eko drzewko automatycznie rosną.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="jak-to-dziala" className="mt-24 sm:mt-32 rounded-[2rem] bg-emerald-50 px-6 py-16 dark:bg-emerald-950/20 sm:px-10 sm:py-20">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="font-heading text-3xl font-bold sm:text-4xl text-emerald-950 dark:text-emerald-50">Jak działa Razem w drogę?</h2>
        <p className="mt-4 text-lg text-emerald-800/80 dark:text-emerald-200/80">
          Wystarczą trzy proste kroki, żeby ruszyć we wspólną trasę.
        </p>
      </div>

      <div className="grid gap-10 md:grid-cols-3 relative">
        {/* Connecting line for desktop */}
        <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-emerald-200 dark:bg-emerald-800" />
        
        {steps.map((step, index) => (
          <div key={index} className="relative flex flex-col items-center text-center">
            <div className="relative z-10 flex size-24 items-center justify-center rounded-full bg-white dark:bg-emerald-900 shadow-sm ring-4 ring-emerald-50 dark:ring-emerald-950/20 mb-6">
              <step.icon className="size-10 text-emerald-600 dark:text-emerald-400" />
              <div className="absolute -top-2 -right-2 flex size-8 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-sm">
                {index + 1}
              </div>
            </div>
            <h3 className="text-xl font-bold mb-3 text-emerald-950 dark:text-emerald-50">{step.title}</h3>
            <p className="text-emerald-800/80 dark:text-emerald-200/80 leading-relaxed">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
