import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { bffFetch } from "@/lib/bff";
import type { PackageDetail, CreatePackageRequest } from "@/app/types/api";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET! });
  if (token?.role !== "Admin") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body: CreatePackageRequest = await req.json();

  const result = await bffFetch<PackageDetail>(
    `/api/Destinations/${id}/Packages`,
    req,
    {
      isPublic: false,
      method: "POST",
      cache: "no-store",
      body,
    }
  );

  if (!result.ok) return result.response;
  return NextResponse.json(result.data, { status: 201 });
}
