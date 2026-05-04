import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { bffFetch } from "@/lib/bff";
import type { Destination, CreateDestinationRequest } from "@/app/types/api";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET! });
  if (token?.role !== "Admin") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const body: CreateDestinationRequest = await req.json();

  const result = await bffFetch<Destination>("/api/Destinations", req, {
    isPublic: false,
    method: "POST",
    cache: "no-store",
    body,
  });

  if (!result.ok) return result.response;
  return NextResponse.json(result.data, { status: 201 });
}
