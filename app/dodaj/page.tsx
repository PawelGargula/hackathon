import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AddRideForm } from "@/components/add-ride-form";

export default async function AddRidePage() {
  const session = await auth();
  if (!session?.user) redirect("/api/auth/signin");

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-heading text-2xl font-bold tracking-tight">
        Dodaj przejazd
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Ogłoś trasę, którą i tak pokonujesz, i zabierz kogoś po drodze. Start i
        cel wybierz z podpowiedzi, żeby pasażerowie lepiej Cię znaleźli.
      </p>
      <div className="mt-6">
        <AddRideForm />
      </div>
    </div>
  );
}
