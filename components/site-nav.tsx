import Link from "next/link";
import { auth } from "@/lib/auth";
import { SignInButton } from "@/components/sign-in-button";
import { SignOutButton } from "@/components/sign-out-button";

export async function SiteNav() {
  const session = await auth();

  return (
    <header className="border-b">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-semibold tracking-tight">
          Hackathon Template
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Dashboard
          </Link>
          {session?.user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">
                {session.user.email}
              </span>
              <SignOutButton />
            </div>
          ) : (
            <SignInButton />
          )}
        </div>
      </nav>
    </header>
  );
}
