"use client";

import { useQuery } from "@tanstack/react-query";
import { reviewsApi } from "@/lib/endpoints";
import { queryKeys } from "@/lib/queryKeys";

export function useApprovedReviews() {
  return useQuery({
    queryKey: queryKeys.reviews.approved(),
    queryFn: () => reviewsApi.getApproved(),
    staleTime: 1000 * 60 * 5,
  });
}
