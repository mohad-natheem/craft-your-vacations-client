import { NextResponse, NextRequest } from "next/server";
import { bffFetch } from "@/lib/bff";
import { Destination } from "@/app/types/api";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const result = await bffFetch<Destination[]>("/api/Destinations", req, {
    isPublic: true,
  });

  if (!result.ok) return result.response;
  return NextResponse.json(result.data);
}
