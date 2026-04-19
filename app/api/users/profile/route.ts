import { NextRequest, NextResponse } from "next/server";
import { bffFetch } from "@/lib/bff";
import type { User } from "@/app/types/api";

export async function PATCH(req: NextRequest) {
  const body = await req.json();

  const result = await bffFetch<User>("/users/profile", req, {
    isPublic: false,
    method: "PATCH",
    body: {
      DateOfBirth: body.dateOfBirth,
      Nationality: body.nationality,
      Designation: body.designation,
    },
    cache: "no-store",
  });

  if (!result.ok) return result.response;
  return NextResponse.json(result.data);
}
