import type { Metadata } from "next";
import { Outfit, Geist_Mono } from "next/font/google";
import { auth } from "@/lib/auth";
import { getNavCounts } from "@/lib/rides";
import { AppShell } from "@/components/app-shell";
import { SiteNav } from "@/components/site-nav";
import { SignOutButton } from "@/components/sign-out-button";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin", "latin-ext"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Razem w drogę — lokalne wspólne przejazdy",
  description:
    "Znajdź lokalny wspólny przejazd, oszczędzaj pieniądze i sprawdzaj, ile CO₂ udało Ci się ograniczyć. Pobierz aplikację Razem w drogę i jedź taniej, wygodniej i bardziej eko.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const user = session?.user;
  const counts = user?.id
    ? await getNavCounts(user.id)
    : { pending: 0, messages: 0 };

  return (
    <html
      lang="pl"
      className={`${outfit.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full">
        {user ? (
          <AppShell
            user={{ name: user.name ?? null, image: user.image ?? null }}
            counts={counts}
            signOut={<SignOutButton />}
          >
            {children}
          </AppShell>
        ) : (
          <div className="flex min-h-full flex-col">
            <SiteNav />
            <main className="flex-1">{children}</main>
          </div>
        )}
      </body>
    </html>
  );
}
