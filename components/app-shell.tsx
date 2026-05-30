"use client";

import { type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarCheck,
  Home,
  MessageSquare,
  Plus,
  Search,
  User,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";
import { LinkLoadingIndicator } from "@/components/link-loading-indicator";
import { PromoIllustration } from "@/components/illustrations/promo-illustration";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
  primaryMobile?: boolean;
};

type ShellUser = {
  name: string | null;
  image: string | null;
};

export function AppShell({
  user,
  counts,
  signOut,
  children,
}: {
  user: ShellUser;
  counts: { messages: number; pending: number };
  signOut: ReactNode;
  children: ReactNode;
}) {
  const pathname = usePathname();

  const nav: NavItem[] = [
    { href: "/", label: "Strona główna", icon: Home, primaryMobile: true },
    { href: "/szukaj", label: "Szukaj przejazdu", icon: Search, primaryMobile: true },
    { href: "/dodaj", label: "Dodaj przejazd", icon: Plus, primaryMobile: true },
    {
      href: "/moje-przejazdy",
      label: "Moje przejazdy",
      icon: CalendarCheck,
      primaryMobile: true,
    },
    {
      href: "/wiadomosci",
      label: "Wiadomości",
      icon: MessageSquare,
      badge: counts.messages,
      primaryMobile: true,
    },
    { href: "/konto", label: "Profil", icon: User },
  ];

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const firstName = (user.name ?? "").split(" ")[0] || "Podróżniku";

  return (
    <div className="flex min-h-full bg-muted/30">
      {/* Sidebar — desktop */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-transparent bg-sidebar px-4 py-5 shadow-[4px_0_24px_rgba(0,0,0,0.02)] lg:flex">
        <Link href="/" className="px-1">
          <Logo />
        </Link>

        <nav className="mt-7 flex flex-1 flex-col gap-1">
          {nav.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all",
                  active
                    ? "bg-emerald-50 text-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-100"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                )}
              >
                <span className="grid size-[18px] shrink-0 place-items-center">
                  <LinkLoadingIndicator className="size-[18px]">
                    <item.icon
                      className={cn(
                        "size-[18px]",
                        active && "text-emerald-600 dark:text-emerald-400",
                      )}
                    />
                  </LinkLoadingIndicator>
                </span>
                <span className="flex-1">{item.label}</span>
                {item.badge ? (
                  <span
                    className={cn(
                      "grid size-5 place-items-center rounded-full text-[11px] font-bold",
                      active
                        ? "bg-emerald-600 text-white"
                        : "bg-primary text-primary-foreground",
                    )}
                  >
                    {item.badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>

        <PromoCard />
      </aside>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-40 flex items-center justify-between gap-4 border-b border-border bg-background/80 px-4 py-3 backdrop-blur sm:px-6">
          <Link href="/" className="lg:hidden">
            <Logo withText={false} />
          </Link>
          <div className="hidden flex-col lg:flex">
            <p className="text-sm text-muted-foreground">Witaj ponownie,</p>
            <p className="font-heading text-lg font-bold leading-tight">
              Cześć, {firstName}! 👋
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/konto"
              className="flex items-center gap-2 rounded-full bg-card py-1 pl-1 pr-3 ring-1 ring-border transition-colors hover:bg-accent"
            >
              <Avatar user={user} className="size-7" />
              <span className="text-sm font-medium">
                {firstName}
              </span>
            </Link>
            <div className="hidden sm:block">{signOut}</div>
          </div>
        </header>

        <main className="min-w-0 flex-1 overflow-x-hidden px-4 pb-24 pt-5 sm:px-6 lg:pb-8">
          {children}
        </main>
      </div>

      {/* Bottom nav — mobile */}
      <nav className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-5 border-t border-border bg-card/95 backdrop-blur lg:hidden">
        {nav
          .filter((i) => i.primaryMobile)
          .map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              >
                <span className="grid size-5 place-items-center">
                  <LinkLoadingIndicator className="size-5">
                    <item.icon className="size-5" />
                  </LinkLoadingIndicator>
                </span>
                <span className="truncate px-0.5">
                  {item.label.split(" ")[0]}
                </span>
                {item.badge ? (
                  <span className="absolute right-[22%] top-1.5 grid size-4 place-items-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                    {item.badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
      </nav>
    </div>
  );
}

function PromoCard() {
  return (
    <div className="mt-4 overflow-hidden rounded-3xl bg-emerald-50 dark:bg-emerald-950/30">
      <div className="p-5 pb-0">
        <p className="font-heading text-sm font-bold text-emerald-900 dark:text-emerald-100">
          Razem zmieniamy drogi na lepsze! 🌱
        </p>
        <p className="mt-2 text-xs leading-relaxed text-emerald-700 dark:text-emerald-300/80">
          Dzięki wspólnym przejazdom mniej spalin, mniej korków, lepsze powietrze.
        </p>
      </div>
      <PromoIllustration className="mt-2 h-24 w-full" />
    </div>
  );
}

function Avatar({
  user,
  className,
}: {
  user: ShellUser;
  className?: string;
}) {
  if (user.image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={user.image}
        alt=""
        className={cn("rounded-full object-cover", className)}
      />
    );
  }
  const initial = (user.name ?? "?").charAt(0).toUpperCase();
  return (
    <span
      className={cn(
        "grid place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground",
        className,
      )}
    >
      {initial}
    </span>
  );
}
