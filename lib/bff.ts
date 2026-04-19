import { getServerSession } from "next-auth/next";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { url } from "inspector";

const BACKEND_URL = "http://localhost:5025";

interface BffFetchOptions {
  /** If true, skips the auth check. Use for public endpoints. */
  isPublic?: boolean;
  /** Next.js cache strategy. Defaults to revalidate every 300s. */
  cache?: RequestCache | { revalidate: number };
  /** Extra headers to forward to .NET */
  headers?: Record<string, string>;
  /** HTTP method. Defaults to GET. */
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  /** Request body — will be JSON-serialised. */
  body?: unknown;
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
    method = "GET",
    body,
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
  const cacheConfig =
    typeof cache === "object" && "revalidate" in cache
      ? { next: cache as { revalidate: number } }
      : { cache: cache as RequestCache };

  const fetchOptions: RequestInit = {
    method,
    headers: fetchHeaders,
    ...cacheConfig,
    ...(body !== undefined && { body: JSON.stringify(body) }),
  };

  // 4. Call .NET backend
  let backendResponse: Response;

  try {
    backendResponse = await fetch(`${BACKEND_URL}${path}`, fetchOptions);
  } catch {
    console.log(`BFF fetch failed ${url}`);
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
