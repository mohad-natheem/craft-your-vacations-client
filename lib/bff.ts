// Shared server-side fetch utility for all BFF route handlers.
// Never import this in components or hooks — server only.
 
// import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';
 
const BACKEND_URL = process.env.BACKEND_API_URL;
 
// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
 
interface BffFetchOptions {
  /** Additional headers to forward to .NET */
  headers?: Record<string, string>;
  /** Next.js fetch cache strategy. Defaults to revalidate: 300 */
  cache?: RequestCache | { revalidate: number };
  /** If true, skips auth check. Use only for public endpoints */
  isPublic?: boolean;
  /** Allowed query param keys to whitelist from the incoming request */
  allowedParams?: string[];
  /** Parsed URLSearchParams from the incoming request */
  searchParams?: URLSearchParams;
}
 
interface BffFetchSuccess<T> {
  ok: true;
  data: T;
}
 
interface BffFetchFailure {
  ok: false;
  response: NextResponse;
}
 
type BffFetchResult<T> = BffFetchSuccess<T> | BffFetchFailure;
 
// ---------------------------------------------------------------------------
// Core fetcher
// ---------------------------------------------------------------------------
 
export async function bffFetch<T>(
  path: string,
  options: BffFetchOptions = {},
): Promise<BffFetchResult<T>> {
  const {
    headers = {},
    cache = { revalidate: 300 },
    isPublic = false,
    allowedParams = [],
    searchParams,
  } = options;
 
  // -------------------------------------------------------------------------
  // 1. Auth
  // -------------------------------------------------------------------------
//   const session = isPublic ? null : await auth();
 
//   if (!isPublic && !session?.user) {
//     return {
//       ok: false,
//       response: NextResponse.json(
//         { message: 'Unauthorized', success: false },
//         { status: 401 },
//       ),
//     };
//   }
 
  // -------------------------------------------------------------------------
  // 2. Build query string from whitelisted params
  // -------------------------------------------------------------------------
  let queryString = '';
 
  if (searchParams && allowedParams.length > 0) {
    const forwarded = new URLSearchParams();
    for (const key of allowedParams) {
      const value = searchParams.get(key);
      if (value !== null) forwarded.set(key, value);
    }
    queryString = forwarded.toString() ? `?${forwarded.toString()}` : '';
  }
 
  // -------------------------------------------------------------------------
  // 3. Build fetch options
  // -------------------------------------------------------------------------
  const fetchHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Request-ID': crypto.randomUUID(),
    ...headers,
  };
 
//   if (session?.user?.accessToken) {
//     fetchHeaders['Authorization'] = `Bearer ${session.user.accessToken}`;
//   }
 
  const fetchOptions: RequestInit =
    typeof cache === 'object' && 'revalidate' in cache
      ? { headers: fetchHeaders, next: cache }
      : { headers: fetchHeaders, cache };
 
  // -------------------------------------------------------------------------
  // 4. Call .NET backend
  // -------------------------------------------------------------------------
  let backendResponse: Response;
 
  try {
    backendResponse = await fetch(
      `${BACKEND_URL}${path}${queryString}`,
      fetchOptions,
    );
  } catch {
    return {
      ok: false,
      response: NextResponse.json(
        { message: 'Service unavailable. Please try again later.', success: false },
        { status: 503 },
      ),
    };
  }
 
  // -------------------------------------------------------------------------
  // 5. Handle error responses from .NET
  // -------------------------------------------------------------------------
  if (!backendResponse.ok) {
    let errorMessage = `Request to ${path} failed`;
 
    try {
      const errorBody = (await backendResponse.json()) as { message?: string };
      if (errorBody.message) errorMessage = errorBody.message;
    } catch {
      // non-JSON error body — use fallback
    }
 
    return {
      ok: false,
      response: NextResponse.json(
        { message: errorMessage, success: false },
        { status: backendResponse.status },
      ),
    };
  }
 
  // -------------------------------------------------------------------------
  // 6. Parse and return
  // -------------------------------------------------------------------------
  const data = (await backendResponse.json()) as T;
 
  return { ok: true, data };
}