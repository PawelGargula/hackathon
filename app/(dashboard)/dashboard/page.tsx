import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/api/auth/signin");

  return (
    <div className="mx-auto max-w-5xl min-w-0 px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      <p className="mt-2 text-muted-foreground">
        You&apos;re in — deploy test passed. This page is protected by Auth.js.
      </p>

      <Card className="mt-8 max-w-md min-w-0">
        <CardHeader>
          <CardTitle>Signed-in user</CardTitle>
          <CardDescription>From Auth.js server session</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div>
            <span className="text-muted-foreground">Name:</span>{" "}
            <span className="font-medium break-words">{session.user.name ?? "—"}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Email:</span>{" "}
            <span className="break-all font-medium">{session.user.email ?? "—"}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
