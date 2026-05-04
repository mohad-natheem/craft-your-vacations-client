"use client";

import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/lib/endpoints";
import { queryKeys } from "@/lib/queryKeys";

export function useAdminReviews() {
  return useQuery({
    queryKey: queryKeys.admin.reviews(),
    queryFn: adminApi.getReviews,
    staleTime: 1000 * 30,
  });
}
