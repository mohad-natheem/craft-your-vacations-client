import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { bffFetch } from "@/lib/bff";
import type { AdminReview } from "@/app/types/api";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET! });
  if (token?.role !== "Admin") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  const result = await bffFetch<AdminReview>(`/api/Reviews/${id}/approve`, req, {
    isPublic: false,
    method: "POST",
    cache: "no-store",
    body: {},
  });

  if (!result.ok) return result.response;
  return NextResponse.json(result.data);
}
