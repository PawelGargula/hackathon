import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { auth } from "@/lib/auth";
import { getNavCounts } from "@/lib/rides";
import { AppShell } from "@/components/app-shell";
import { SiteNav } from "@/components/site-nav";
import { SignOutButton } from "@/components/sign-out-button";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Razem w Drogę",
  description:
    "Lokalne przejazdy współdzielone i kursy MPK Nowy Sącz w jednej wyszukiwarce - przeciw wykluczeniu transportowemu w subregionie nowosądeckim.",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
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
