import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AddRideForm } from "@/components/add-ride-form";

export default async function AddRidePage() {
  const session = await auth();
  if (!session?.user) redirect("/api/auth/signin");

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="text-2xl font-bold tracking-tight">Dodaj przejazd</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Oglos trase, ktora i tak pokonujesz, i zabierz kogos po drodze. Start i
        cel wybierz z podpowiedzi, zeby pasazerowie lepiej Cie znalezli.
      </p>
      <div className="mt-6">
        <AddRideForm />
      </div>
    </div>
  );
}
