import { SignInButton } from "@/components/sign-in-button";

export function FinalCtaSection() {
  return (
    <section className="mt-24 sm:mt-32 mb-16">
      <div className="relative rounded-[3rem] bg-emerald-600 px-6 py-16 sm:px-12 sm:py-24 text-center text-white overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 -translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-0 right-0 translate-y-1/2 translate-x-1/2 w-96 h-96 bg-emerald-700 rounded-full blur-3xl opacity-50" />
        
        <div className="relative z-10 max-w-2xl mx-auto space-y-8">
          <h2 className="font-heading text-4xl font-bold sm:text-5xl">Gotowy ruszyć razem w drogę?</h2>
          <p className="text-xl text-emerald-50">
            Dołącz do lokalnej społeczności kierowców i pasażerów. Znajduj przejazdy, oszczędzaj pieniądze, zdobywaj odznaki i rozwijaj swoje eko drzewko.
          </p>
          
          <div className="pt-4 flex flex-col items-center gap-4">
            <SignInButton redirectTo="/" className="bg-white text-emerald-700 hover:bg-emerald-50 text-lg px-8 py-6 rounded-full shadow-xl hover:shadow-2xl transition-all">
              Zacznij korzystać już teraz
            </SignInButton>
            <p className="text-sm font-medium text-emerald-200">
              Razem jedziemy taniej, wygodniej i w dobrą stronę.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
