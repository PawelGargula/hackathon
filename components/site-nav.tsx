import Link from "next/link";
import { SignInButton } from "@/components/sign-in-button";
import { Logo } from "@/components/logo";

export async function SiteNav() {
  return (
    <header className="border-b border-border bg-background/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <Link href="/">
          <Logo />
        </Link>
        <SignInButton redirectTo="/" />
      </nav>
    </header>
  );
}
