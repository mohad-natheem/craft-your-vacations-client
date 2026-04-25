"use client";

import { useQuery } from "@tanstack/react-query";
import { reviewsApi } from "@/lib/endpoints";
import { queryKeys } from "@/lib/queryKeys";

export function useDestinationReviews(slug: string) {
  return useQuery({
    queryKey: queryKeys.reviews.byDestination(slug),
    queryFn: () => reviewsApi.getByDestination(slug),
    staleTime: 1000 * 60 * 5,
  });
}
