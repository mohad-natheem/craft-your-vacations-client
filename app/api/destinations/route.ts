import { NextResponse } from "next/server";
import { bffFetch } from "@/lib/bff";
import { Destination } from "@/app/types/api";

export async function GET(): Promise<NextResponse> {
  const result = await bffFetch<Destination[]>("/api/Destinations", {
    isPublic: true,
  });

  if (!result.ok) return result.response;
  return NextResponse.json(result.data);
}
