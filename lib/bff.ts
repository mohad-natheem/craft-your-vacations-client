import { getServerSession } from "next-auth/next";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

const BACKEND_URL = "http://localhost:5025";

interface BffFetchOptions {
  /** If true, skips the auth check. Use for public endpoints. */
  isPublic?: boolean;
  /** Next.js cache strategy. Defaults to revalidate every 300s. */
  cache?: RequestCache | { revalidate: number };
  /** Extra headers to forward to .NET */
  headers?: Record<string, string>;
}

type BffResult<T> =
  | { ok: true; data: T }
  | { ok: false; response: NextResponse };

export async function bffFetch<T>(
  path: string,
  req: NextRequest,
  options: BffFetchOptions = {},
): Promise<BffResult<T>> {
  const {
    isPublic = false,
    cache = { revalidate: 300 },
    headers = {},
  } = options;

  // 1. Auth check
  const session = isPublic ? null : await getServerSession(authOptions);

  if (!isPublic && !session?.user) {
    return {
      ok: false,
      response: NextResponse.json({ message: "Unauthorized" }, { status: 401 }),
    };
  }

  // 2. Build headers
  const fetchHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...headers,
  };

  if (session?.user) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (token) fetchHeaders["Authorization"] = `Bearer ${token}`;
  }

  // 3. Build fetch options (supports both Next.js revalidate and standard cache)
  const fetchOptions: RequestInit =
    typeof cache === "object" && "revalidate" in cache
      ? { headers: fetchHeaders, next: cache }
      : { headers: fetchHeaders, cache };

  // 4. Call .NET backend
  let backendResponse: Response;

  try {
    backendResponse = await fetch(`${BACKEND_URL}${path}`, fetchOptions);
  } catch {
    return {
      ok: false,
      response: NextResponse.json(
        { message: "Service unavailable. Please try again later." },
        { status: 503 },
      ),
    };
  }

  // 5. Handle .NET errors
  if (!backendResponse.ok) {
    let message = `Request to ${path} failed`;
    try {
      const body = (await backendResponse.json()) as { message?: string };
      if (body.message) message = body.message;
    } catch {
      // non-JSON error body — use fallback message
    }
    return {
      ok: false,
      response: NextResponse.json(
        { message },
        { status: backendResponse.status },
      ),
    };
  }

  // 6. Parse and return
  const data = (await backendResponse.json()) as T;
  return { ok: true, data };
}
