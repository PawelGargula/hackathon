import Link from "next/link";
import { SignInButton } from "@/components/sign-in-button";
import { Logo } from "@/components/logo";

export async function SiteNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <Link href="/">
          <Logo />
        </Link>
        <SignInButton redirectTo="/">
          <span className="hidden sm:inline">Zaloguj się przez Google</span>
          <span className="sm:hidden">Zaloguj się</span>
        </SignInButton>
      </nav>
    </header>
  );
}
