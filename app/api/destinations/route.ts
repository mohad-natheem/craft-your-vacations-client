import { NextRequest, NextResponse } from 'next/server';
import { bffFetch } from '@/lib/bff';
// import type { PaginatedResponse, DestinationListItem } from '@/types';
 
const ALLOWED_PARAMS = ['page', 'pageSize', 'continent', 'search', 'sortBy', 'tags', 'minBudget', 'maxBudget'];
 
// export async function GET(request: NextRequest): Promise<NextResponse> {
//   const result = await bffFetch<DestinationListItem>('/destinations', {
//     searchParams: request.nextUrl.searchParams,
//     allowedParams: ALLOWED_PARAMS,
//   });
 
//   if (!result.ok) return result.response;
//   return NextResponse.json(result.data);
// }