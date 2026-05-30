"use client";

import { ArrowRight, MapPin } from "lucide-react";

const routes = [
  { from: "Grybów", to: "Nowy Sącz" },
  { from: "Krynica-Zdrój", to: "Nowy Sącz" },
  { from: "Stary Sącz", to: "Nowy Sącz" },
  { from: "Łącko", to: "Nowy Sącz" },
  { from: "Piwniczna-Zdrój", to: "Nowy Sącz" },
  { from: "Chełmiec", to: "Nowy Sącz" },
];

export function LocalRoutesSection() {
  return (
    <section className="mt-24 sm:mt-32">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex size-12 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/30 mb-6">
          <MapPin className="size-6 text-emerald-600 dark:text-emerald-500" />
        </div>
        <h2 className="font-heading text-3xl font-bold sm:text-4xl">Stworzone z myślą o lokalnych trasach</h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Razem w drogę skupia się na codziennych trasach mieszkańców regionu. To przejazdy do pracy, szkoły, lekarza, na uczelnię i do centrum miasta.
        </p>
      </div>

      <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {routes.map((route, index) => (
          <div key={index} className="flex flex-wrap items-center gap-x-2 gap-y-1 rounded-2xl bg-card px-5 py-4 text-sm shadow-sm ring-1 ring-border/50 transition-all hover:shadow-md hover:ring-emerald-500/50">
            <span className="break-words font-medium">{route.from}</span>
            <ArrowRight className="mx-2 size-4 shrink-0 text-emerald-500" />
            <span className="break-words font-medium">{route.to}</span>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <a 
          href="#" 
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
        >
          Sprawdź przejazdy w swojej okolicy
        </a>
      </div>
    </section>
  );
}
