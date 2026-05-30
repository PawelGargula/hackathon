import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { auth } from "@/lib/auth";
import { getLifetimeImpact } from "@/lib/rides";
import { BadgeGrid } from "@/components/badge-grid";

export default async function AchievementsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/api/auth/signin");

  const impact = await getLifetimeImpact(session.user.id);

  return (
    <div className="mx-auto max-w-4xl min-w-0">
      <div className="mb-6 flex items-center gap-4">
        <Link
          href="/konto"
          className="inline-flex items-center justify-center rounded-lg p-2 hover:bg-accent hover:text-accent-foreground"
        >
          <ArrowLeft className="size-5" />
          <span className="sr-only">Wróć do kokpitu</span>
        </Link>
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight">
            Moje Osiągnięcia
          </h1>
          <p className="text-sm text-muted-foreground">
            Wszystkie Twoje odznaki i postępy
          </p>
        </div>
      </div>

      <div className="rounded-3xl bg-card p-5 ring-1 ring-border">
        <BadgeGrid achievements={impact.achievements} columns={4} />
      </div>
    </div>
  );
}
