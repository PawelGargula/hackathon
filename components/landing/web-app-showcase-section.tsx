import { Monitor, CheckCircle } from "lucide-react";
import { SignInButton } from "@/components/sign-in-button";
import Image from "next/image";

export function WebAppShowcaseSection() {
  return (
    <section className="mt-24 sm:mt-32">
      <div className="flex flex-col lg:flex-row items-center gap-12 rounded-3xl bg-zinc-50 border border-zinc-200 px-6 py-12 sm:px-12 sm:py-16 text-zinc-900 overflow-hidden relative">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-64 h-64 bg-emerald-600/20 rounded-full blur-3xl" />
        
        <div className="flex-1 relative z-10 space-y-6">
          <div className="inline-flex size-12 items-center justify-center rounded-xl bg-emerald-100 backdrop-blur-sm mb-2">
            <Monitor className="size-6 text-emerald-600" />
          </div>
          <h2 className="font-heading text-3xl font-bold sm:text-4xl">Wspólne przejazdy zawsze pod ręką</h2>
          <p className="text-lg text-zinc-600 max-w-xl">
            Nasza platforma działa bezpośrednio w przeglądarce internetowej na każdym urządzeniu — telefonie, tablecie i komputerze. Nie musisz niczego instalować ze sklepów z aplikacjami!
          </p>
          
          <ul className="space-y-3 text-zinc-600">
            <li className="flex items-center gap-2">
              <CheckCircle className="size-5 text-emerald-600 shrink-0" />
              <span>Brak konieczności pobierania i instalacji</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="size-5 text-emerald-600 shrink-0" />
              <span>Pełna responsywność i wygoda na smartfonie</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="size-5 text-emerald-600 shrink-0" />
              <span>Szybkie rezerwacje i dodawanie przejazdów w kilka chwil</span>
            </li>
          </ul>
          
          <div className="pt-4 space-y-4">
            <SignInButton redirectTo="/">
              Zacznij korzystać już teraz
            </SignInButton>
            <p className="text-sm text-zinc-500">
              Dostępne przejazdy, rezerwacje i Twoje eko statystyki zawsze pod ręką.
            </p>
          </div>
        </div>

        <div className="flex-1 relative z-10 w-full max-w-2xl flex justify-center">
          {/* Mockup okna przeglądarki */}
          <div className="relative w-full rounded-2xl border-4 border-zinc-200/50 bg-white shadow-2xl overflow-hidden flex flex-col">
            {/* Browser top bar */}
            <div className="bg-zinc-100 px-4 py-3 flex items-center gap-2 border-b border-zinc-200">
              <div className="flex gap-1.5">
                <div className="size-3 rounded-full bg-red-500/80" />
                <div className="size-3 rounded-full bg-yellow-500/80" />
                <div className="size-3 rounded-full bg-green-500/80" />
              </div>
              <div className="flex-1 max-w-xs mx-auto bg-white border border-zinc-200 rounded-md py-1 px-3 text-[11px] text-zinc-500 text-center truncate">
                razemwdroge.pl
              </div>
            </div>
            {/* Image content */}
            <div className="relative aspect-[16/10] w-full bg-white">
              <Image 
                src="/assets/imgmainpage.png" 
                alt="Razem w drogę platforma" 
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover object-top"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
