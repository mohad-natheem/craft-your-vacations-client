import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { bffFetch } from "@/lib/bff";
import type { Customer } from "@/app/types/api";

export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET! });
  if (token?.role !== "Admin") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const result = await bffFetch<Customer[]>("/api/Users/all", req, {
    isPublic: false,
    cache: "no-store",
  });

  if (!result.ok) return result.response;
  return NextResponse.json(result.data);
}
