import { MapPin, ArrowRight } from "lucide-react";
import { SignInButton } from "@/components/sign-in-button";
import { SearchForm } from "@/components/search-form";
import { HeroIllustration } from "@/components/illustrations/hero-illustration";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function HeroSection() {
  return (
    <>
      <section className="flex min-w-0 flex-col gap-12 lg:flex-row lg:items-center">
        <div className="min-w-0 flex-1 space-y-6">
          <div className="flex min-w-0 items-center gap-3">
            <span className="inline-flex min-w-0 items-start gap-2 rounded-full bg-emerald-600/10 px-3 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">
              <MapPin className="mt-0.5 size-3.5 shrink-0" />
              <span className="min-w-0 break-words">
                Dołącz do lokalnej społeczności kierowców i pasażerów. Jedziemy razem w dobrą stronę.
              </span>
            </span>
          </div>
          <h1 className="max-w-3xl font-heading text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Jedź taniej, wygodniej i bardziej eko — <span className="text-emerald-600 dark:text-emerald-500">razem w drogę.</span>
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            Oszczędzaj na codziennych dojazdach i zobacz, jak Twoje wspólne podróże zmniejszają korki i chronią środowisko.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <SignInButton redirectTo="/">
              Zaloguj się i ruszaj w drogę
            </SignInButton>
            <a href="#jak-to-dziala" className={cn(buttonVariants({ variant: "outline" }), "gap-2 text-emerald-700 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors border-emerald-200 hover:bg-emerald-50 dark:border-emerald-800/50 dark:hover:bg-emerald-900/30")}>
              Zobacz, jak to działa <ArrowRight className="size-4" />
            </a>
          </div>
        </div>

        <div className="relative hidden flex-1 justify-center lg:flex">
          <div className="absolute inset-0 rounded-full bg-emerald-500/10 blur-[80px]" />
          <div className="relative z-10 flex h-[600px] w-[300px] flex-col overflow-hidden rounded-[3rem] border-[8px] border-zinc-900 bg-background shadow-2xl">
            <div className="absolute inset-x-0 top-0 flex justify-center">
              <div className="h-6 w-32 rounded-b-2xl bg-zinc-900" />
            </div>
            
            <div className="flex flex-1 flex-col gap-4 bg-emerald-50 p-4 pt-10 dark:bg-emerald-950/30">
              <HeroIllustration className="h-40 w-full" />
              <div className="space-y-2 rounded-xl border bg-card p-3 shadow-sm">
                <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                <div className="h-10 w-full animate-pulse rounded bg-muted" />
                <div className="h-10 w-full animate-pulse rounded bg-muted" />
                <div className="h-10 w-full animate-pulse rounded bg-primary/20" />
              </div>
              <div className="flex flex-1 flex-col gap-2 rounded-xl border bg-card p-3 shadow-sm">
                <div className="h-16 w-full animate-pulse rounded bg-muted" />
                <div className="h-16 w-full animate-pulse rounded bg-muted" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="relative z-20 mt-8 sm:mt-12">
        <SearchForm />
      </div>
    </>
  );
}
