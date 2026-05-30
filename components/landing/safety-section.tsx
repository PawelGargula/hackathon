import { ShieldCheck, Check } from "lucide-react";

const points = [
  "sprawdzaj ocenę kierowcy,",
  "wybieraj przejazdy z dokładną trasą,",
  "korzystaj z lokalnych profili,",
  "oceniaj przejazdy po zakończeniu podróży.",
];

export function SafetySection() {
  return (
    <section className="mt-24 sm:mt-32">
      <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
        <div className="flex-1 space-y-6">
          <div className="inline-flex size-12 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30">
            <ShieldCheck className="size-6 text-blue-600 dark:text-blue-500" />
          </div>
          <h2 className="font-heading text-3xl font-bold sm:text-4xl">Jedź z większym spokojem</h2>
          <p className="text-lg text-muted-foreground">
            Profile użytkowników, oceny kierowców i informacje o przejazdach pomagają wybierać trasy bardziej świadomie.
          </p>
          <p className="text-lg text-muted-foreground">
            Przed rezerwacją widzisz kierowcę, godzinę wyjazdu, trasę, liczbę miejsc, cenę i najważniejsze szczegóły przejazdu.
          </p>
          
          <ul className="space-y-3 pt-4">
            {points.map((point, index) => (
              <li key={index} className="flex items-center gap-3 text-lg font-medium">
                <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400">
                  <Check className="size-4" />
                </div>
                {point}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex-1 w-full max-w-md lg:max-w-none relative">
          <div className="absolute inset-0 bg-blue-100 dark:bg-blue-900/20 blur-3xl rounded-full opacity-50" />
          <div className="relative rounded-3xl border bg-card p-6 shadow-xl">
            {/* Mockup profilu kierowcy */}
            <div className="flex items-center gap-4 mb-6">
              <div className="size-16 rounded-full bg-muted" />
              <div>
                <div className="h-5 w-32 bg-muted rounded mb-2" />
                <div className="flex gap-1">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className="size-4 rounded-full bg-amber-400" />
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="h-12 w-full bg-muted rounded-xl" />
              <div className="h-12 w-full bg-muted rounded-xl" />
              <div className="h-12 w-full bg-muted rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
