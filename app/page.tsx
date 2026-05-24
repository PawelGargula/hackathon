import Link from "next/link";
import { auth } from "@/lib/auth";
import { SignInButton } from "@/components/sign-in-button";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const stack = [
  { name: "Next.js 16", detail: "App Router + Turbopack + React 19" },
  { name: "Tailwind CSS v4", detail: "CSS-first config, no postcss plugins to wire" },
  { name: "shadcn/ui", detail: "Accessible Radix primitives, copied into the repo" },
  { name: "Auth.js v5", detail: "Google OAuth, Prisma adapter, JWT sessions" },
  { name: "Prisma 7", detail: "pg driver adapter, prisma.config.ts" },
  { name: "Supabase Postgres", detail: "Pooled URL at runtime, direct URL for migrations" },
];

export default async function HomePage() {
  const session = await auth();

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <section className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Hackathon Template
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          All systems go — auth, database, and UI are wired up. Sign in, ship
          features, deploy to Vercel.
        </p>
        <div className="flex gap-3 pt-2">
          {session?.user ? (
            <Link href="/dashboard" className={buttonVariants()}>
              Go to dashboard
            </Link>
          ) : (
            <SignInButton redirectTo="/dashboard">
              Sign in to get started
            </SignInButton>
          )}
        </div>
      </section>

      <section className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stack.map((item) => (
          <Card key={item.name}>
            <CardHeader>
              <CardTitle>{item.name}</CardTitle>
              <CardDescription>{item.detail}</CardDescription>
            </CardHeader>
            <CardContent />
          </Card>
        ))}
      </section>
    </div>
  );
}
