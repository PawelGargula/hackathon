import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { autocompletePlaces } from "@/lib/geocoding";

export async function GET(request: Request) {
  // Only logged-in users may consume the geocoding proxy.
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";
  const results = await autocompletePlaces(q);
  return NextResponse.json({ results });
}
