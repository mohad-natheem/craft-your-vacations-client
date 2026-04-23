"use client";

import { useQuery } from "@tanstack/react-query";
import { destinationsApi } from "@/lib/endpoints";
import { queryKeys } from "@/lib/queryKeys";

export function useDestination(slug: string) {
  return useQuery({
    queryKey: queryKeys.destinations.detail(slug),
    queryFn: () => destinationsApi.getBySlug(slug),
    staleTime: 1000 * 60 * 5,
  });
}
