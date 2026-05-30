"use client";

import { type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  CalendarCheck,
  CarFront,
  Home,
  MessageSquare,
  Plus,
  Search,
  User,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";

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
    { href: "/dodaj", label: "Dodaj przejazd", icon: Plus },
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
    { href: "/panel-kierowcy", label: "Panel kierowcy", icon: CarFront },
    { href: "/konto", label: "Profil", icon: User, primaryMobile: true },
  ];

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const firstName = (user.name ?? "").split(" ")[0] || "Podróżniku";

  return (
    <div className="flex min-h-full">
      {/* Sidebar — desktop */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar px-4 py-5 lg:flex">
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
                  "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                )}
              >
                <item.icon className="size-[18px]" />
                <span className="flex-1">{item.label}</span>
                {item.badge ? (
                  <span
                    className={cn(
                      "grid size-5 place-items-center rounded-full text-[11px] font-semibold",
                      active
                        ? "bg-primary-foreground/20 text-primary-foreground"
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
        <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-border bg-background/80 px-4 py-3 backdrop-blur sm:px-6">
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
              href="/panel-kierowcy"
              aria-label="Powiadomienia"
              className="relative grid size-9 place-items-center rounded-full bg-card text-foreground ring-1 ring-border transition-colors hover:bg-accent"
            >
              <Bell className="size-[18px]" />
              {counts.pending > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid size-4 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {counts.pending}
                </span>
              )}
            </Link>
            <Link
              href="/konto"
              className="flex items-center gap-2 rounded-full bg-card py-1 pl-1 pr-3 ring-1 ring-border transition-colors hover:bg-accent"
            >
              <Avatar user={user} className="size-7" />
              <span className="hidden text-sm font-medium sm:inline">
                {firstName}
              </span>
            </Link>
            <div className="hidden sm:block">{signOut}</div>
          </div>
        </header>

        <main className="flex-1 px-4 pb-24 pt-5 sm:px-6 lg:pb-8">{children}</main>
      </div>

      {/* Bottom nav — mobile */}
      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-border bg-card/95 backdrop-blur lg:hidden">
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
                <item.icon className="size-5" />
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
    <div className="mt-4 rounded-2xl bg-gradient-to-br from-primary to-emerald-600 p-4 text-primary-foreground">
      <p className="font-heading text-sm font-bold">
        Razem zmieniamy drogi na lepsze 🌱
      </p>
      <p className="mt-1 text-xs text-primary-foreground/85">
        Dzięki wspólnym przejazdom mniej spalin, mniej korków i lepsze powietrze
        w regionie.
      </p>
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
