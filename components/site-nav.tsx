import Link from "next/link";
import { Route } from "lucide-react";
import { auth } from "@/lib/auth";
import { SignInButton } from "@/components/sign-in-button";
import { SignOutButton } from "@/components/sign-out-button";

const links = [
  { href: "/szukaj", label: "Znajdz przejazd" },
  { href: "/dodaj", label: "Dodaj przejazd" },
  { href: "/moje-przejazdy", label: "Moje przejazdy" },
  { href: "/panel-kierowcy", label: "Panel kierowcy" },
  { href: "/konto", label: "Konto" },
];

export async function SiteNav() {
  const session = await auth();

  return (
    <header className="border-b">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <Route className="size-5 text-emerald-600" />
          Razem w Drogę
        </Link>
        <div className="flex items-center gap-4">
          {session?.user && (
            <div className="hidden items-center gap-4 md:flex">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          )}
          {session?.user ? <SignOutButton /> : <SignInButton redirectTo="/szukaj" />}
        </div>
      </nav>
    </header>
  );
}
