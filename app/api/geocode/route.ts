import { NextResponse } from "next/server";
import { autocompletePlaces } from "@/lib/geocoding";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";
  const results = await autocompletePlaces(q);
  return NextResponse.json({ results });
}
