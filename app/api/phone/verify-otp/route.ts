import { NextRequest, NextResponse } from "next/server";
import { bffFetch } from "@/lib/bff";
import type { OtpResponse } from "@/app/types/api";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { mobileNumber, otp } = await req.json();

  const session = await getServerSession(authOptions);

  console.log(`User ID: ${session?.user}`);
  const result = await bffFetch<OtpResponse>("/api/Auth/verify-otp", req, {
    isPublic: true,
    method: "POST",
    body: {
      MobileNumber: mobileNumber,
      Otp: otp,
      UserId: Number(session?.user.userId),
    },
    cache: "no-store",
  });

  if (!result.ok) return result.response;
  
  return NextResponse.json(result.data);
}
