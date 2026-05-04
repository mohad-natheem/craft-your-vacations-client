import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { bffFetch } from "@/lib/bff";
import type { DestinationDetail, CreateDestinationRequest } from "@/app/types/api";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET! });
  if (token?.role !== "Admin") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body: Partial<CreateDestinationRequest> = await req.json();

  const result = await bffFetch<DestinationDetail>(`/api/Destinations/${id}`, req, {
    isPublic: false,
    method: "PATCH",
    cache: "no-store",
    body,
  });

  if (!result.ok) return result.response;
  return NextResponse.json(result.data);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET! });
  if (token?.role !== "Admin") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  const result = await bffFetch<void>(`/api/Destinations/${id}`, req, {
    isPublic: false,
    method: "DELETE",
    cache: "no-store",
  });

  if (!result.ok) return result.response;
  return new NextResponse(null, { status: 204 });
}
