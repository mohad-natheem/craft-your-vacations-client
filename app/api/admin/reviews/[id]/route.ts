import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { bffFetch } from "@/lib/bff";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET! });
  if (token?.role !== "Admin") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  const result = await bffFetch<void>(`/api/Reviews/${id}`, req, {
    isPublic: false,
    method: "DELETE",
    cache: "no-store",
  });

  if (!result.ok) return result.response;
  return new NextResponse(null, { status: 204 });
}
